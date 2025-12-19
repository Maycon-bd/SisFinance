from datetime import date, datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, EmailStr, Field, field_validator

# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    monthly_salary: Optional[float] = 0

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str):
        if len(v) < 6:
            raise ValueError('A senha deve ter no mínimo 6 caracteres')
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
    full_name: Optional[str] = None
    monthly_salary: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    monthly_salary: Optional[float] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v: str):
        if v and len(v) < 6:
            raise ValueError('A nova senha deve ter no mínimo 6 caracteres')
        return v

# Banks
class BankCreate(BaseModel):
    name: str
    icon_color: Optional[str] = None

class BankUpdate(BaseModel):
    name: Optional[str] = None
    icon_color: Optional[str] = None

class BankOut(BaseModel):
    id: int
    user_id: int
    name: str
    current_balance: float  # Calculated from sum of vaults
    icon_color: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Vaults (Cofres dentro de Bancos - como caixinhas Nubank)
class VaultCreate(BaseModel):
    name: str
    bank_id: int  # Required - vault must be inside a bank
    currency: str = "BRL"
    initial_balance: float = 0

class VaultUpdate(BaseModel):
    name: Optional[str] = None
    balance: Optional[float] = None  # Allow editing balance directly
    bank_id: Optional[int] = None  # Allow changing the linked bank

class VaultOut(BaseModel):
    id: int
    user_id: int
    bank_id: int  # Always linked to a bank
    name: str
    currency: str
    balance: float
    created_at: datetime
    
    class Config:
        from_attributes = True

# Credit Cards
class CreditCardCreate(BaseModel):
    name: str
    limit: float
    closing_day: int = Field(..., ge=1, le=31)
    due_day: int = Field(..., ge=1, le=31)
    color: Optional[str] = None

class CreditCardUpdate(BaseModel):
    name: Optional[str] = None
    limit: Optional[float] = None
    closing_day: Optional[int] = None
    due_day: Optional[int] = None
    color: Optional[str] = None

class CreditCardOut(BaseModel):
    id: int
    user_id: int
    name: str
    limit: float
    closing_day: int
    due_day: int
    color: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Categories
class CategoryCreate(BaseModel):
    name: str
    type: str
    icon: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    icon: Optional[str] = None

class CategoryOut(BaseModel):
    id: int
    name: str
    type: str
    is_system: bool
    icon: Optional[str]
    user_id: Optional[int]

    class Config:
        from_attributes = True

# Transactions
class TransactionCreate(BaseModel):
    amount: float
    type: str
    category_id: Optional[int] = None
    bank_id: Optional[int] = None
    vault_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    date: date
    description: Optional[str] = None
    installments: Optional[int] = 1 # Number of installments (1 = one time)

class TransactionOut(BaseModel):
    id: int
    amount: float
    type: str
    category_id: Optional[int]
    bank_id: Optional[int]
    vault_id: Optional[int]
    credit_card_id: Optional[int]
    installment_number: Optional[int]
    total_installments: Optional[int]
    date: date
    description: Optional[str]

    class Config:
        from_attributes = True

# Recurring Transactions
class RecurringTransactionCreate(BaseModel):
    amount: float
    type: str
    category_id: Optional[int] = None
    bank_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    day_of_month: int
    description: Optional[str] = None

class RecurringTransactionUpdate(BaseModel):
    amount: Optional[float] = None
    day_of_month: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class RecurringTransactionOut(BaseModel):
    id: int
    amount: float
    type: str
    category_id: Optional[int]
    bank_id: Optional[int]
    credit_card_id: Optional[int] = None
    day_of_month: int
    description: Optional[str]
    is_active: bool
    created_at: datetime

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