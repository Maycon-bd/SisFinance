from pydantic import BaseModel
from typing import Optional

# Schema para criação de categoria (o que a API recebe)
class CategoriaCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None

# Schema base para leitura (para evitar duplicação de código)
class CategoriaBase(CategoriaCreate):
    id: int

    class Config:
        orm_mode = True # Permite que o Pydantic leia dados de objetos do SQLAlchemy