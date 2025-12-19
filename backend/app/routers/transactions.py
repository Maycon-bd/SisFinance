from datetime import date
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import Transaction, Category, User, Bank, Vault
from ..schemas import TransactionCreate, TransactionOut

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.post("/", response_model=TransactionOut)
def create_transaction(payload: TransactionCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        if payload.type not in ("income", "expense"):
            raise HTTPException(status_code=400, detail="O tipo deve ser 'receita' (income) ou 'despesa' (expense)")
        
        # Validate category if provided
        if payload.category_id:
            cat = db.query(Category).filter(Category.id == payload.category_id).first()
            if not cat:
                raise HTTPException(status_code=404, detail="Categoria não encontrada")

        bank = None
        vault = None
        credit_card = None

        # Validate Credit Card
        if payload.credit_card_id:
            from ..models import CreditCard
            credit_card = db.query(CreditCard).filter(CreditCard.id == payload.credit_card_id, CreditCard.user_id == user.id).first()
            if not credit_card:
                raise HTTPException(status_code=404, detail="Cartão de crédito não encontrado")
            
            # If credit card, ignore bank/vault for initial balance update (only update limit later if we want)
            if payload.installments and payload.installments > 1:
                # INSTALLMENTS LOGIC
                import calendar
                from datetime import timedelta

                total_amount = Decimal(str(payload.amount))
                installments = payload.installments
                installment_amount = total_amount / installments
                
                # Create N transactions
                created_trans = []
                current_date = payload.date
                
                for i in range(1, installments + 1):
                    tr = Transaction(
                        user_id=user.id,
                        amount=installment_amount,
                        type=payload.type,
                        category_id=payload.category_id,
                        credit_card_id=credit_card.id,
                        installment_number=i,
                        total_installments=installments,
                        date=current_date,
                        description=f"{payload.description or ''} ({i}/{installments})".strip(),
                    )
                    db.add(tr)
                    created_trans.append(tr)
                    
                    # Move to next month (approximated logic: add 30 days or using relativedelta if available, otherwise manual)
                    # Simple manual month increment
                    year = current_date.year
                    month = current_date.month + 1
                    if month > 12:
                        month = 1
                        year += 1
                        
                    # Handle end of month (e.g. if started on 31st, next month 31st might not exist)
                    last_day_next_month = calendar.monthrange(year, month)[1]
                    day = min(current_date.day, last_day_next_month)
                    current_date = date(year, month, day)

                db.commit()
                # Refresh the first one to return (or last? API returns only one)
                db.refresh(created_trans[0])
                return created_trans[0]
                
        # If NOT credit card, proceed with normal Bank/Vault logic
        if not payload.credit_card_id:
            if payload.bank_id:
                bank = db.query(Bank).filter(Bank.id == payload.bank_id, Bank.user_id == user.id).first()
                if not bank:
                    raise HTTPException(status_code=404, detail="Banco não encontrado")
            
            if payload.vault_id:
                vault = db.query(Vault).filter(Vault.id == payload.vault_id, Vault.user_id == user.id).first()
                if not vault:
                    raise HTTPException(status_code=404, detail="Cofre não encontrado")
        
        # Create Single Transaction (Bank, Vault or Credit Card with 1 installment)
        tr = Transaction(
            user_id=user.id,
            amount=Decimal(str(payload.amount)),
            type=payload.type,
            category_id=payload.category_id if payload.category_id else None,
            bank_id=payload.bank_id if payload.bank_id else None,
            vault_id=payload.vault_id if payload.vault_id else None,
            credit_card_id=payload.credit_card_id if payload.credit_card_id else None,
            installment_number=1 if payload.credit_card_id else None,
            total_installments=1 if payload.credit_card_id else None,
            date=payload.date,
            description=payload.description if payload.description else None,
        )
        db.add(tr)
        
        # Update Balance - new logic: if vault selected, update vault (bank balance = sum of vaults)
        if vault:
            amount_decimal = Decimal(str(payload.amount))
            if payload.type == "income":
                vault.balance = Decimal(str(vault.balance)) + amount_decimal
            else:
                vault.balance = Decimal(str(vault.balance)) - amount_decimal

        db.commit()
        db.refresh(tr)
        return tr
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error creating transaction: {e}")
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


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


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tr = db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user.id).first()
    if not tr:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    # Reverse Balance - if transaction had a vault, reverse vault balance
    if tr.vault_id:
        vault = db.query(Vault).filter(Vault.id == tr.vault_id).first()
        if vault:
            if tr.type == "income":
                vault.balance -= tr.amount
            else:
                vault.balance += tr.amount

    db.delete(tr)
    db.commit()
    return None