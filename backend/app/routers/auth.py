from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from sqlalchemy import extract

from ..database import get_db
from ..models import User, RecurringTransaction, Transaction, Bank
from ..schemas import UserCreate, UserLogin, Token, UserOut, UserUpdate
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Update full_name if provided
    if payload.full_name is not None:
        user.full_name = payload.full_name
    
    # Update monthly_salary if provided
    if payload.monthly_salary is not None:
        user.monthly_salary = payload.monthly_salary
    
    # Update password if provided
    if payload.new_password:
        if not payload.current_password:
            raise HTTPException(status_code=400, detail="Senha atual é obrigatória para alterar a senha")
        if not verify_password(payload.current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Senha atual incorreta")
        user.hashed_password = get_password_hash(payload.new_password)
    
    db.commit()
    db.refresh(user)
    return user


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    user = User(
        email=payload.email, 
        hashed_password=get_password_hash(payload.password),
        full_name=payload.full_name,
        monthly_salary=payload.monthly_salary
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def generate_recurring_transactions(user: User, db: Session):
    today = date.today()
    recurring = db.query(RecurringTransaction)\
        .filter(RecurringTransaction.user_id == user.id)\
        .filter(RecurringTransaction.is_active == True).all()
    
    for r in recurring:
        # Check if transaction for this month/year already exists
        # We assume description starts with "[Auto]"
        desc = f"[Auto] {r.description}"
        exists = db.query(Transaction).filter(
            Transaction.user_id == user.id,
            Transaction.description == desc,
            extract('month', Transaction.date) == today.month,
            extract('year', Transaction.date) == today.year
        ).first()
        
        if not exists:
            # Create transaction
            # Current day for date? Or day_of_month if valid?
            try:
                tx_date = date(today.year, today.month, r.day_of_month)
            except ValueError:
                # Fallback to last day of month if day is invalid (e.g. 31 in Feb)
                # Simple logic: use today or 1st
                tx_date = date(today.year, today.month, 1) # Simplification
            
            tx = Transaction(
                user_id=user.id,
                amount=r.amount,
                type=r.type,
                category_id=r.category_id,
                bank_id=r.bank_id,
                date=tx_date,
                description=desc
            )
            db.add(tx)
            
            # Update bank balance
            bank = db.query(Bank).filter(Bank.id == r.bank_id).first()
            if bank:
                if r.type == "income":
                    bank.current_balance += r.amount
                else:
                    bank.current_balance -= r.amount
            
    db.commit()


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    
    # Generate recurring transactions on login
    try:
        generate_recurring_transactions(user, db)
    except Exception as e:
        print(f"Error generating recurring transactions: {e}")
        # Don't block login if this fails
        pass

    token = create_access_token(subject=user.email)
    return Token(access_token=token)