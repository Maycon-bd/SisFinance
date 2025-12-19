from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth import get_current_user
from ..models import Category, User
from ..schemas import CategoryCreate, CategoryUpdate, CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[CategoryOut])
def list_categories(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Return system categories OR user's own categories
    # Use distinct or union logic? Or just simple OR filter
    # Check if SQLAlchemy can handle OR easily
    from sqlalchemy import or_
    return db.query(Category).filter(
        or_(Category.is_system == True, Category.user_id == user.id)
    ).all()

@router.post("/", response_model=CategoryOut)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = Category(
        user_id=user.id,
        name=payload.name,
        type=payload.type,
        icon=payload.icon,
        is_system=False
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{id}", response_model=CategoryOut)
def update_category(id: int, payload: CategoryUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    # Check permissions
    if category.is_system:
        raise HTTPException(status_code=403, detail="Não é possível editar categorias do sistema")
    if category.user_id != user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    if payload.name is not None:
        category.name = payload.name
    if payload.type is not None:
        category.type = payload.type
    if payload.icon is not None:
        category.icon = payload.icon
        
    db.commit()
    db.refresh(category)
    return category

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    
    if category.is_system:
        raise HTTPException(status_code=403, detail="Não é possível deletar categorias do sistema")
    if category.user_id != user.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    
    db.delete(category)
    db.commit()
    return None
