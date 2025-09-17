from sqlalchemy import Column, Integer, String
from db.database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(255), unique=True, index=True, nullable=False)
    descricao = Column(String(255), nullable=True)