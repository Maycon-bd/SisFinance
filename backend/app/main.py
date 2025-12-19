import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, SessionLocal
from .models import Category
from .routers import auth as auth_router
from .routers import transactions as transactions_router
from .routers import dashboard as dashboard_router
from .routers import reports as reports_router
from .routers import banks as banks_router
from .routers import vaults as vaults_router
from .routers import categories as categories_router
from .routers import credit_cards as credit_cards_router
from .routers import recurring as recurring_router

app = FastAPI(title="SysFinance API", version="0.1.0")

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5175",
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler to ensure CORS headers are sent on errors
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print(f"Global error: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

# Create tables
Base.metadata.create_all(bind=engine)

# Seed default categories (income/expense)
def seed_categories():
    db: Session = SessionLocal()
    try:
        names = [("Salário", "income"), ("Investimentos", "income"), ("Alimentação", "expense"), ("Moradia", "expense"), ("Transporte", "expense")]
        for name, typ in names:
            exists = db.query(Category).filter(Category.name == name, Category.type == typ, Category.is_system == True).first()
            if not exists:
                # Check if old categories exist (without is_system) e update them?
                # Or just create new ones with is_system=True
                # For compatibility, let's assume we create new ones or use existing if name/type match
                # Safe approach: create if not found
                 db.add(Category(name=name, type=typ, is_system=True))
        db.commit()
    finally:
        db.close()

seed_categories()

# Routers
app.include_router(auth_router.router)
app.include_router(transactions_router.router)
app.include_router(dashboard_router.router)
app.include_router(reports_router.router)
app.include_router(banks_router.router)
app.include_router(vaults_router.router)
app.include_router(categories_router.router)
app.include_router(credit_cards_router.router)
app.include_router(recurring_router.router)

@app.get("/")
def root():
    return {"status": "ok", "name": "SysFinance API"}