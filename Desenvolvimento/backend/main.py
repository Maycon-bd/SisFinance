from fastapi import FastAPI
from api.routers import categorias
# Importe os modelos para que o SQLAlchemy saiba que eles existem
from db import models
# Importe Base e engine de onde eles realmente estão
from db.database import Base, engine

# Use a Base importada para criar as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SisFinance API",
    description="API para o sistema de gerenciamento financeiro SisFinance.",
    version="0.1.0"
)

app.include_router(categorias.router)

@app.get("/")
def read_root():
    return {"Status": "API do SisFinance está no ar!"}