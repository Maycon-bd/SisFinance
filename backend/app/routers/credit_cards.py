from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import CreditCard, User, Transaction
from ..schemas import CreditCardCreate, CreditCardUpdate, CreditCardOut

router = APIRouter(prefix="/credit-cards", tags=["credit-cards"])

@router.get("/", response_model=List[CreditCardOut])
def get_credit_cards(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(CreditCard).filter(CreditCard.user_id == user.id).all()

@router.post("/", response_model=CreditCardOut, status_code=status.HTTP_201_CREATED)
def create_credit_card(payload: CreditCardCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cc = CreditCard(
        user_id=user.id,
        name=payload.name,
        limit=payload.limit,
        closing_day=payload.closing_day,
        due_day=payload.due_day,
        color=payload.color
    )
    db.add(cc)
    db.commit()
    db.refresh(cc)
    return cc

@router.put("/{id}", response_model=CreditCardOut)
def update_credit_card(id: int, payload: CreditCardUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cc = db.query(CreditCard).filter(CreditCard.id == id, CreditCard.user_id == user.id).first()
    if not cc:
        raise HTTPException(status_code=404, detail="Cartão de crédito não encontrado")
    
    if payload.name is not None:
        cc.name = payload.name
    if payload.limit is not None:
        cc.limit = payload.limit
    if payload.closing_day is not None:
        cc.closing_day = payload.closing_day
    if payload.due_day is not None:
        cc.due_day = payload.due_day
    if payload.color is not None:
        cc.color = payload.color
        
    db.commit()
    db.refresh(cc)
    return cc

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_credit_card(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cc = db.query(CreditCard).filter(CreditCard.id == id, CreditCard.user_id == user.id).first()
    if not cc:
        raise HTTPException(status_code=404, detail="Cartão de crédito não encontrado")
    
    # Check if there are transactions
    tx_count = db.query(Transaction).filter(Transaction.credit_card_id == id).count()
    if tx_count > 0:
        raise HTTPException(status_code=400, detail="Não é possível excluir cartão com transações vinculadas")
        
    db.delete(cc)
    db.commit()
