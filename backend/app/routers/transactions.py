from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import Transaction, Category, User
from ..schemas import TransactionCreate, TransactionOut

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionOut)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if payload.type not in ("income", "expense"):
        raise HTTPException(status_code=400, detail="O tipo deve ser 'receita' (income) ou 'despesa' (expense)")
    if payload.category_id:
        cat = db.query(Category).filter(Category.id == payload.category_id).first()
        if not cat:
            raise HTTPException(status_code=404, detail="Categoria não encontrada")
    tr = Transaction(
        user_id=user.id,
        amount=payload.amount,
        type=payload.type,
        category_id=payload.category_id,
        date=payload.date,
        description=payload.description,
    )
    db.add(tr)
    db.commit()
    db.refresh(tr)
    return tr


@router.get("/", response_model=List[TransactionOut])
def list_transactions(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=1970, le=2100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Transaction).filter(Transaction.user_id == user.id)
    if month and year:
        # filter by month/year
        from sqlalchemy import extract
        q = q.filter(extract('month', Transaction.date) == month).filter(extract('year', Transaction.date) == year)
    return q.order_by(Transaction.date.desc()).all()