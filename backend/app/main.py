import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Category
from .routers import auth as auth_router
from .routers import transactions as transactions_router
from .routers import dashboard as dashboard_router
from .routers import reports as reports_router

app = FastAPI(title="SysFinance API", version="0.1.0")

origins = [os.getenv("FRONTEND_URL", "http://localhost:5173"), "*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Seed default categories (income/expense)
def seed_categories():
    db: Session = SessionLocal()
    try:
        names = [("Salário", "income"), ("Investimentos", "income"), ("Alimentação", "expense"), ("Moradia", "expense"), ("Transporte", "expense")]
        for name, typ in names:
            exists = db.query(Category).filter(Category.name == name, Category.type == typ).first()
            if not exists:
                db.add(Category(name=name, type=typ))
        db.commit()
    finally:
        db.close()

seed_categories()

# Routers
app.include_router(auth_router.router)
app.include_router(transactions_router.router)
app.include_router(dashboard_router.router)
app.include_router(reports_router.router)

@app.get("/")
def root():
    return {"status": "ok", "name": "SysFinance API"}