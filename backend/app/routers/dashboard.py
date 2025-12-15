from typing import Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import Transaction, Category, User
from ..schemas import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=1970, le=2100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import extract

    txs = (
        db.query(Transaction)
        .filter(Transaction.user_id == user.id)
        .filter(extract('month', Transaction.date) == month)
        .filter(extract('year', Transaction.date) == year)
        .all()
    )

    total_income = sum(float(t.amount) for t in txs if t.type == "income")
    total_expense = sum(float(t.amount) for t in txs if t.type == "expense")
    net = total_income - total_expense

    by_category: Dict[str, float] = {}
    for t in txs:
        name = t.category.name if t.category else "Sem categoria"
        by_category[name] = by_category.get(name, 0.0) + float(t.amount) * (1 if t.type == "income" else -1)

    return DashboardSummary(
        month=month,
        year=year,
        total_income=total_income,
        total_expense=total_expense,
        net=net,
        by_category=by_category,
    )