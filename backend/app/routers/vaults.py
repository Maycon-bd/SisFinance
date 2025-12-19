from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import Vault, Bank, User
from ..schemas import VaultCreate, VaultUpdate, VaultOut

router = APIRouter(prefix="/vaults", tags=["vaults"])

@router.get("/", response_model=List[VaultOut])
def list_vaults(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Vault).filter(Vault.user_id == user.id).all()

@router.post("/", response_model=VaultOut)
def create_vault(payload: VaultCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Validate bank ownership - bank_id is now required
    bank = db.query(Bank).filter(Bank.id == payload.bank_id, Bank.user_id == user.id).first()
    if not bank:
        raise HTTPException(status_code=400, detail="Banco não encontrado ou não pertence ao usuário")

    vault = Vault(
        user_id=user.id,
        bank_id=payload.bank_id,
        name=payload.name,
        currency=payload.currency,
        balance=payload.initial_balance
    )
    db.add(vault)
    db.commit()
    db.refresh(vault)
    return vault

@router.get("/{id}", response_model=VaultOut)
def get_vault(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    vault = db.query(Vault).filter(Vault.id == id, Vault.user_id == user.id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Cofre não encontrado")
    return vault

@router.put("/{id}", response_model=VaultOut)
def update_vault(id: int, payload: VaultUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    vault = db.query(Vault).filter(Vault.id == id, Vault.user_id == user.id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Cofre não encontrado")
    
    if payload.name is not None:
        vault.name = payload.name
    if payload.balance is not None:
        vault.balance = payload.balance
    if payload.bank_id is not None:
        # Validate new bank belongs to user
        bank = db.query(Bank).filter(Bank.id == payload.bank_id, Bank.user_id == user.id).first()
        if not bank:
            raise HTTPException(status_code=400, detail="Banco não encontrado ou não pertence ao usuário")
        vault.bank_id = payload.bank_id
    
    db.commit()
    db.refresh(vault)
    return vault

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vault(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    vault = db.query(Vault).filter(Vault.id == id, Vault.user_id == user.id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Cofre não encontrado")
    
    db.delete(vault)
    db.commit()
    return None

# Transfer endpoint removed - vaults are now inside banks like "caixinhas"
# The bank balance = sum of all vault balances, no need for transfers
