"""Configurações da aplicação."""

from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação SisFinance."""
    
    # Configurações da aplicação
    app_name: str = "SisFinance API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Configurações do banco de dados
    database_url: str = "mysql+pymysql://user:password@localhost:3307/expenses_db"
    
    # Configurações de segurança
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Configurações de CORS
    allowed_origins: list = ["http://localhost:3000", "http://localhost:8080"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Instância global das configurações
settings = Settings()