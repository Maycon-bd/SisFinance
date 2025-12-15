# Guia de Instalação e Configuração

## Requisitos
- Node.js 18+
- Python 3.10+
- Docker Desktop (para PostgreSQL via Compose)

## Banco de Dados
1. Inicie o Docker Desktop.
2. No diretório raiz do projeto: `docker compose up -d`.
3. O Postgres ficará disponível em `localhost:5432` com usuário `postgres`, senha `postgres`, DB `sysfinance`.

## Backend (FastAPI)
1. Acesse `backend/`.
2. Crie e ative um ambiente virtual (opcional):
   - Windows PowerShell: `python -m venv .venv` e `.\.venv\Scripts\Activate.ps1`
3. Instale dependências: `pip install -r requirements.txt`.
4. Configure `.env` se desejar (baseado em `.env.example`).
5. Inicie a API: `python -m uvicorn app.main:app --reload --port 8000`.

## Frontend (React/Vite)
1. Acesse `frontend/`.
2. Instale dependências: `npm install`.
3. Configure `.env` (baseado em `.env.example`), por padrão `VITE_API_URL=http://localhost:8000`.
4. Inicie o dev server: `npm run dev` e abra `http://localhost:5173/`.

## Variáveis de Ambiente
- Backend:
  - `DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/sysfinance`
  - `SECRET_KEY=...`
  - `ACCESS_TOKEN_EXPIRE_MINUTES=60`
  - `FRONTEND_URL=http://localhost:5173`
- Frontend:
  - `VITE_API_URL=http://localhost:8000`

## Teste Rápido
1. Acesse `/register` e crie um usuário.
2. Faça login em `/login` e navegue para o Dashboard.
3. Adicione transações em `/transactions` e veja os totais no Dashboard.
4. Gere relatórios em `/reports` (CSV/PDF).