# Arquitetura do Sistema

## Visão Geral
- Frontend (React/Vite): páginas para Login, Cadastro, Dashboard, Transações, Relatórios, Orçamentos e Configurações.
- Backend (FastAPI): rotas de autenticação, transações, dashboard e exportação de relatórios.
- Banco (PostgreSQL): tabelas para usuários, categorias, transações, orçamentos e notificações.

## Camadas
- UI/UX: componentes acessíveis, navegação simples, feedbacks de erro/estado.
- Estado de Dados: React Query para cache de requisições e mutations.
- Comunicação: Axios com `Authorization: Bearer` e baseURL configurável (`VITE_API_URL`).
- API: FastAPI com Pydantic (schemas), SQLAlchemy (ORM), JWT (auth), ReportLab (PDF).

## Módulos de Backend
- `app/main.py`: inicialização, CORS, criação de tabelas, seed de categorias, registros de routers.
- `app/database.py`: engine SQLAlchemy, `SessionLocal`, `Base`, dependência `get_db`.
- `app/models.py`: `User`, `Category`, `Transaction`, `Budget`, `Notification`.
- `app/schemas.py`: modelos Pydantic para inputs/outputs.
- `app/auth.py`: hash/verify senha (`passlib`), geração/validação JWT (`python-jose`).
- `app/routers/*`: `auth`, `transactions`, `dashboard`, `reports`.

## Fluxos Principais
- Autenticação: `POST /auth/register` e `POST /auth/login` retornando `access_token` (JWT).
- Transações: `POST /transactions/` cria; `GET /transactions` lista com filtro por mês/ano.
- Dashboard: `GET /dashboard/summary` agrega receitas, despesas, saldo e por categoria.
- Relatórios: `GET /reports/export/csv` e `GET /reports/export/pdf` para exportação.

## Segurança
- JWT com expiração configurável (`ACCESS_TOKEN_EXPIRE_MINUTES`).
- Hash de senha com bcrypt via Passlib.
- CORS restrito ao `FRONTEND_URL` em produção.

## Escalabilidade e Manutenção
- Separação de camadas (routers, models, schemas, auth, db).
- Seeds e migrações: recomendado adicionar Alembic para versionamento de schema.
- Observabilidade: logs estruturados (padrão FastAPI) e, opcionalmente, métricas com Prometheus.