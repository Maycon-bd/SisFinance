from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import RecurringTransaction, User, Bank, Category, CreditCard
from ..schemas import RecurringTransactionCreate, RecurringTransactionUpdate, RecurringTransactionOut

router = APIRouter(prefix="/recurring", tags=["recurring"])

@router.get("/", response_model=List[RecurringTransactionOut])
def get_recurring(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(RecurringTransaction).filter(RecurringTransaction.user_id == user.id).all()

@router.post("/", response_model=RecurringTransactionOut, status_code=status.HTTP_201_CREATED)
def create_recurring(payload: RecurringTransactionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Validate Bank or Credit Card
    if payload.bank_id:
        bank = db.query(Bank).filter(Bank.id == payload.bank_id, Bank.user_id == user.id).first()
        if not bank:
            raise HTTPException(status_code=404, detail="Banco não encontrado")
            
    # For now, simplistic validation. In future validade if either bank OR credit card (when supported) is set.
    
    rt = RecurringTransaction(
        user_id=user.id,
        amount=payload.amount,
        type=payload.type,
        category_id=payload.category_id,
        bank_id=payload.bank_id,
        day_of_month=payload.day_of_month,
        description=payload.description
    )
    db.add(rt)
    db.commit()
    db.refresh(rt)
    return rt

@router.put("/{id}", response_model=RecurringTransactionOut)
def update_recurring(id: int, payload: RecurringTransactionUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rt = db.query(RecurringTransaction).filter(RecurringTransaction.id == id, RecurringTransaction.user_id == user.id).first()
    if not rt:
        raise HTTPException(status_code=404, detail="Despesa fixa não encontrada")
    
    if payload.amount is not None:
        rt.amount = payload.amount
    if payload.day_of_month is not None:
        rt.day_of_month = payload.day_of_month
    if payload.description is not None:
        rt.description = payload.description
    if payload.is_active is not None:
        rt.is_active = payload.is_active
        
    db.commit()
    db.refresh(rt)
    return rt

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rt = db.query(RecurringTransaction).filter(RecurringTransaction.id == id, RecurringTransaction.user_id == user.id).first()
    if not rt:
        raise HTTPException(status_code=404, detail="Despesa fixa não encontrada")
        
    db.delete(rt)
    db.commit()
