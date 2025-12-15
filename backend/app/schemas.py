from datetime import date, datetime, timedelta
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, Field, field_validator
import re

# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str):
        if len(v) < 6:
            raise ValueError('A senha deve ter no mínimo 6 caracteres')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str):
         # Pydantic's EmailStr validation happens before this, but its error is hard to customize easily without a custom type.
         # So we can catch the basic structure here or let frontend handle "invalid email".
         # However, to be safe, since EmailStr is already validated, this might not run if Pydantic fails first.
         # Actually, Pydantic v2 runs logic differently.
         return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# Categories
class CategoryOut(BaseModel):
    id: int
    name: str
    type: str

    class Config:
        from_attributes = True


# Transactions
class TransactionCreate(BaseModel):
    amount: float
    type: str
    category_id: Optional[int]
    date: date
    description: Optional[str] = None


class TransactionOut(BaseModel):
    id: int
    amount: float
    type: str
    category_id: Optional[int]
    date: date
    description: Optional[str]

    class Config:
        from_attributes = True


# Budgets
class BudgetCreate(BaseModel):
    category_id: Optional[int]
    month: int
    year: int
    amount: float


class BudgetOut(BaseModel):
    id: int
    category_id: Optional[int]
    month: int
    year: int
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


# Notifications
class NotificationCreate(BaseModel):
    title: str
    message: str


class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    created_at: datetime
    read: bool

    class Config:
        from_attributes = True


# Dashboard
class DashboardSummary(BaseModel):
    month: int
    year: int
    total_income: float
    total_expense: float
    net: float
    by_category: Dict[str, float]