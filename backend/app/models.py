from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.types import Numeric

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    monthly_salary = Column(Numeric(12, 2), nullable=True, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user")
    banks = relationship("Bank", back_populates="user")
    vaults = relationship("Vault", back_populates="user")
    credit_cards = relationship("CreditCard", back_populates="user")
    recurring_transactions = relationship("RecurringTransaction", back_populates="user")
    # Categories now can be per-user, so we might want a relationship here too, but it's optional if we query directly


class Bank(Base):
    __tablename__ = "banks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    initial_balance = Column(Numeric(12, 2), nullable=False, default=0)
    current_balance = Column(Numeric(12, 2), nullable=False, default=0)
    icon_color = Column(String(7), nullable=True)  # Hex color
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="banks")
    transactions = relationship("Transaction", back_populates="bank")
    recurring_transactions = relationship("RecurringTransaction", back_populates="bank")


class Vault(Base):
    __tablename__ = "vaults"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bank_id = Column(Integer, ForeignKey("banks.id"), nullable=True)
    name = Column(String(100), nullable=False)
    currency = Column(String(3), nullable=False, default="BRL")
    balance = Column(Numeric(12, 2), nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="vaults")
    bank = relationship("Bank")
    transactions = relationship("Transaction", back_populates="vault")


class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    limit = Column(Numeric(12, 2), nullable=False, default=0)
    closing_day = Column(Integer, nullable=False)  # Day of month the invoice closes
    due_day = Column(Integer, nullable=False)  # Day of month the invoice is due
    color = Column(String(7), nullable=True)  # Hex color
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="credit_cards")
    transactions = relationship("Transaction", back_populates="credit_card")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Null = System category
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    is_system = Column(Boolean, default=False)
    icon = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="category")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    bank_id = Column(Integer, ForeignKey("banks.id"), nullable=True)
    vault_id = Column(Integer, ForeignKey("vaults.id"), nullable=True)
    date = Column(Date, nullable=False)
    description = Column(String(255), nullable=True)

    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    installment_number = Column(Integer, nullable=True)  # Current installment number (e.g. 1)
    total_installments = Column(Integer, nullable=True)  # Total installments (e.g. 12)
    # If credit_card_id is present, bank_id and vault_id should be NULL for the purchase itself.
    # The payment of the invoice will be a separate transaction with bank_id.

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")
    bank = relationship("Bank", back_populates="transactions")
    vault = relationship("Vault", back_populates="transactions")
    credit_card = relationship("CreditCard", back_populates="transactions")


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    bank_id = Column(Integer, ForeignKey("banks.id"), nullable=True)  # Optional: logic to auto-debit
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    day_of_month = Column(Integer, nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recurring_transactions")
    category = relationship("Category")
    bank = relationship("Bank", back_populates="recurring_transactions")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(120), nullable=False)
    message = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    read = Column(Boolean, default=False)