from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas import schemas
from services import categoria_service
from api.dependencies.database import get_db

router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"]
)

@router.post("/", response_model=schemas.CategoriaBase)
def create_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    return categoria_service.criar_categoria(db=db, categoria=categoria)

@router.get("/", response_model=List[schemas.CategoriaBase])
def read_categorias(db: Session = Depends(get_db)):
    return categoria_service.listar_categorias(db=db)