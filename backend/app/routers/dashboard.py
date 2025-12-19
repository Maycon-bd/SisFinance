from typing import Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date
import calendar
from pydantic import BaseModel

from ..database import get_db
from ..auth import get_current_user
from ..models import Transaction, Category, User, RecurringTransaction
from ..schemas import DashboardSummary, RecurringTransactionOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class EvolutionItem(BaseModel):
    month: str
    income: float
    expense: float


def subtract_months(d: date, months: int) -> date:
    """Subtract months from a date using standard library."""
    year = d.year
    month = d.month - months
    while month <= 0:
        month += 12
        year -= 1
    day = min(d.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


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


@router.get("/evolution", response_model=List[EvolutionItem])
def evolution(
    months: int = Query(6, ge=1, le=12),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from sqlalchemy import extract
    
    result = []
    today = date.today()
    
    for i in range(months - 1, -1, -1):
        target_date = subtract_months(today, i)
        target_month = target_date.month
        target_year = target_date.year
        
        txs = (
            db.query(Transaction)
            .filter(Transaction.user_id == user.id)
            .filter(extract('month', Transaction.date) == target_month)
            .filter(extract('year', Transaction.date) == target_year)
            .all()
        )
        
        income = sum(float(t.amount) for t in txs if t.type == "income")
        expense = sum(float(t.amount) for t in txs if t.type == "expense")
        
        month_names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        month_label = f"{month_names[target_month - 1]}/{str(target_year)[2:]}"
        
        result.append(EvolutionItem(month=month_label, income=income, expense=expense))
    
    return result


@router.get("/recurring", response_model=List[RecurringTransactionOut])
def get_recurring(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    recurring = (
        db.query(RecurringTransaction)
        .filter(RecurringTransaction.user_id == user.id)
        .filter(RecurringTransaction.is_active == True)
        .order_by(RecurringTransaction.day_of_month)
        .all()
    )
    return recurring