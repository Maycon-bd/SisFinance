from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..auth import get_current_user
from ..models import Bank, Vault, User
from ..schemas import BankCreate, BankUpdate, BankOut

router = APIRouter(prefix="/banks", tags=["banks"])

def calculate_bank_balance(db: Session, bank_id: int) -> float:
    """Calculate bank balance as sum of all linked vault balances"""
    result = db.query(func.coalesce(func.sum(Vault.balance), 0)).filter(
        Vault.bank_id == bank_id
    ).scalar()
    return float(result)

def update_bank_balance(db: Session, bank_id: int):
    """Recalculate and update bank current_balance"""
    bank = db.query(Bank).filter(Bank.id == bank_id).first()
    if bank:
        bank.current_balance = calculate_bank_balance(db, bank_id)
        db.commit()

@router.get("/", response_model=List[BankOut])
def list_banks(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    banks = db.query(Bank).filter(Bank.user_id == user.id).all()
    # Recalculate balances for accuracy
    for bank in banks:
        bank.current_balance = calculate_bank_balance(db, bank.id)
    return banks

@router.post("/", response_model=BankOut)
def create_bank(payload: BankCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bank = Bank(
        user_id=user.id,
        name=payload.name,
        initial_balance=0,  # Always 0 - balance comes from vaults
        current_balance=0,  # Will be sum of vaults
        icon_color=payload.icon_color
    )
    db.add(bank)
    db.commit()
    db.refresh(bank)
    return bank

@router.get("/{id}", response_model=BankOut)
def get_bank(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bank = db.query(Bank).filter(Bank.id == id, Bank.user_id == user.id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Banco não encontrado")
    # Recalculate balance
    bank.current_balance = calculate_bank_balance(db, bank.id)
    return bank

@router.put("/{id}", response_model=BankOut)
def update_bank(id: int, payload: BankUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bank = db.query(Bank).filter(Bank.id == id, Bank.user_id == user.id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Banco não encontrado")
    
    if payload.name is not None:
        bank.name = payload.name
    if payload.icon_color is not None:
        bank.icon_color = payload.icon_color
    
    db.commit()
    db.refresh(bank)
    # Recalculate balance
    bank.current_balance = calculate_bank_balance(db, bank.id)
    return bank

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bank(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    bank = db.query(Bank).filter(Bank.id == id, Bank.user_id == user.id).first()
    if not bank:
        raise HTTPException(status_code=404, detail="Banco não encontrado")
    
    # Check if there are vaults linked
    vault_count = db.query(Vault).filter(Vault.bank_id == id).count()
    if vault_count > 0:
        raise HTTPException(status_code=400, detail="Não é possível excluir banco com cofres vinculados")
    
    db.delete(bank)
    db.commit()
    return None
