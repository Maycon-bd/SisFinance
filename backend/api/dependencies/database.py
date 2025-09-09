"""Dependências relacionadas ao banco de dados."""

from sqlalchemy.orm import Session
from backend.db.database import SessionLocal


def get_db() -> Session:
    """Obtém uma sessão do banco de dados.
    
    Yields:
        Session: Sessão do SQLAlchemy
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()