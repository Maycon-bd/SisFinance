# Documentação de API

Base URL: `http://localhost:8000`

## Autenticação
### POST `/auth/register`
- Body: `{ email: string, password: string }`
- 201: `UserOut`
- 400: `Email já cadastrado`

### POST `/auth/login`
- Body: `{ email: string, password: string }`
- 200: `{ access_token: string, token_type: 'bearer' }`
- 401: `Credenciais inválidas`

Autorização: nas rotas protegidas, enviar `Authorization: Bearer <token>`.

## Transações
### POST `/transactions/`
- Body: `{ amount: number, type: 'income'|'expense', category_id?: number, date: string(YYYY-MM-DD), description?: string }`
- 200: `TransactionOut`

### GET `/transactions`
- Query: `month` (1..12), `year` (1970..2100)
- 200: `TransactionOut[]`

## Dashboard
### GET `/dashboard/summary`
- Query: `month`, `year`
- 200: `{ month, year, total_income, total_expense, net, by_category: Record<string, number> }`

## Relatórios
### GET `/reports/export/csv`
- Query: `month`, `year`
- 200: `text/csv` (attachment)

### GET `/reports/export/pdf`
- Query: `month`, `year`
- 200: `application/pdf` (attachment)

## Modelos (Schemas)
- `UserOut`: `{ id, email, created_at }`
- `TransactionOut`: `{ id, amount, type, category_id?, date, description? }`
- `BudgetOut`: `{ id, category_id?, month, year, amount, created_at }`
- `NotificationOut`: `{ id, title, message, created_at, read }`