from datetime import date, datetime, timedelta
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, Field


# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)


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