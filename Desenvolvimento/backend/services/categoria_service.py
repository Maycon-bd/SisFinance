from sqlalchemy.orm import Session
from db.models import models
from schemas import schemas

def criar_categoria(db: Session, categoria: schemas.CategoriaCreate):
    """Cria uma nova categoria no banco de dados."""
    db_categoria = models.Categoria(nome=categoria.nome, descricao=categoria.descricao)
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def listar_categorias(db: Session):
    """Retorna uma lista de todas as categorias."""
    return db.query(models.Categoria).all()