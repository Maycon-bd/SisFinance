# 💰 SysFinance

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![License](https://img.shields.io/badge/license-Portfolio-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

**Aplicativo completo de gestão financeira pessoal**

[Funcionalidades](#-funcionalidades) •
[Screenshots](#-screenshots) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[API](#-api-endpoints) •
[Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

SysFinance é um sistema completo de gestão financeira pessoal desenvolvido com **React + TypeScript** no frontend e **FastAPI + Python** no backend. O sistema permite controle total de finanças pessoais com:

- Dashboard interativo com gráficos de evolução
- Gerenciamento de bancos, cofres e cartões de crédito
- Controle de transações (receitas e despesas)
- Despesas fixas/recorrentes automáticas
- Categorização flexível
- Tema escuro moderno (Material Design 3)

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e registro seguro com JWT
- Hash de senhas com bcrypt
- Sessão persistente com refresh automático

### 📊 Dashboard
- Resumo financeiro mensal (receitas, despesas, saldo)
- Gráfico de evolução dos últimos 6 meses
- Últimas transações
- Visão rápida dos cartões de crédito

### 🏦 Contas e Bancos
- Cadastro de múltiplos bancos
- Cofres/contas vinculados a bancos
- Suporte a múltiplas moedas (BRL, USD, EUR, etc.)
- Saldo consolidado por banco

### 💳 Cartões de Crédito
- Cadastro de cartões com limite
- Dia de fechamento e vencimento da fatura
- Cores personalizáveis
- Compras parceladas

### 💸 Transações
- Registro de receitas e despesas
- Categorização por tipo
- Filtro por mês/ano
- Vinculação com conta ou cartão de crédito

### 🔄 Despesas Fixas
- Cadastro de despesas recorrentes
- Geração automática mensal
- Vinculação com banco ou cartão

### 📂 Categorias
- Categorias do sistema (padrão)
- Categorias personalizadas por usuário
- Ícones e tipos (receita/despesa)

### 👤 Perfil
- Edição de nome e salário mensal
- Alteração de senha

---

## 🖼 Screenshots

> *Interface com tema escuro moderno baseado em Material Design 3*

| Dashboard | Transações | Contas |
|-----------|------------|--------|
| Visão geral com gráficos | Lista de movimentações | Bancos, cofres e cartões |

---

## 🛠 Tecnologias

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca UI com hooks |
| **Vite 7** | Build tool ultrarrápido |
| **TypeScript 5** | Tipagem estática |
| **React Query** | Cache e estado do servidor |
| **React Router 6** | Navegação SPA |
| **Axios** | Cliente HTTP |
| **Recharts** | Gráficos interativos |

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| **FastAPI** | Framework Python de alta performance |
| **SQLAlchemy 2** | ORM para banco de dados |
| **Pydantic 2** | Validação de dados |
| **python-jose** | Tokens JWT |
| **Passlib + bcrypt** | Hash seguro de senhas |
| **SQLite** | Banco de dados (desenvolvimento) |

---

## 📁 Estrutura do Projeto

```
SysFinance/
├── backend/
│   ├── app/
│   │   ├── main.py              # Inicialização FastAPI + CORS
│   │   ├── database.py          # Configuração SQLAlchemy
│   │   ├── models.py            # Modelos do banco (User, Transaction, etc.)
│   │   ├── schemas.py           # Schemas Pydantic (validação)
│   │   ├── auth.py              # JWT + hash de senhas
│   │   └── routers/
│   │       ├── auth.py          # Login, registro, perfil
│   │       ├── banks.py         # CRUD de bancos
│   │       ├── vaults.py        # CRUD de cofres
│   │       ├── categories.py    # CRUD de categorias
│   │       ├── transactions.py  # CRUD de transações
│   │       ├── credit_cards.py  # CRUD de cartões
│   │       ├── recurring.py     # Despesas fixas
│   │       └── dashboard.py     # Dados do dashboard
│   ├── sql_app.db               # Banco SQLite
│   ├── requirements.txt         # Dependências Python
│   ├── fix_password.py          # Script para resetar senha
│   └── .env                     # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # Páginas da aplicação
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Accounts.tsx
│   │   │   ├── Categories.tsx
│   │   │   └── Profile.tsx
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── ui/              # Componentes base (Button, Card, Input)
│   │   │   ├── layout/          # Layout (NavigationRail)
│   │   │   └── Toast.tsx        # Notificações
│   │   ├── hooks/               # Custom hooks (React Query)
│   │   ├── services/            # API client (Axios)
│   │   ├── types/               # Tipos TypeScript
│   │   ├── utils/               # Funções utilitárias
│   │   ├── App.tsx              # Rotas principais
│   │   └── index.css            # Estilos globais (Material Design 3)
│   ├── package.json
│   └── .env
│
├── docs/                        # Documentação adicional
├── MANUAL_EXECUCAO.md           # Guia rápido de execução
└── docker-compose.yml           # (opcional) PostgreSQL
```

---

## 🚀 Instalação

### Pré-requisitos

- **Python 3.10+**
- **Node.js 18+**
- **npm** (incluído com Node.js)

### Passo a Passo

#### 1. Clone o repositório
```bash
git clone https://github.com/Maycon-bd/SisFinance.git
cd SisFinance
```

#### 2. Configure o Backend
```bash
cd backend

# Crie e ative o ambiente virtual
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
# ou: source .venv/bin/activate  # Linux/Mac

# Instale as dependências
pip install -r requirements.txt

# Copie o arquivo de ambiente
cp .env.example .env

# Inicie o servidor
python -m uvicorn app.main:app --reload --port 8000
```

#### 3. Configure o Frontend (novo terminal)
```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

#### 4. Acesse a aplicação
- **Frontend:** http://localhost:5173
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## 🔌 API Endpoints

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Criar nova conta |
| POST | `/auth/login` | Fazer login (retorna JWT) |
| GET | `/auth/me` | Dados do usuário atual |
| PUT | `/auth/profile` | Atualizar perfil |

### Bancos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/banks/` | Listar bancos |
| POST | `/banks/` | Criar banco |
| PUT | `/banks/{id}` | Atualizar banco |
| DELETE | `/banks/{id}` | Excluir banco |

### Cofres (Vaults)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/vaults/` | Listar cofres |
| POST | `/vaults/` | Criar cofre |
| PUT | `/vaults/{id}` | Atualizar cofre |
| DELETE | `/vaults/{id}` | Excluir cofre |
| POST | `/vaults/transfer` | Transferir entre cofres |

### Transações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/transactions/?month=X&year=Y` | Listar por mês |
| POST | `/transactions/` | Criar transação |
| DELETE | `/transactions/{id}` | Excluir transação |

### Cartões de Crédito
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/credit-cards/` | Listar cartões |
| POST | `/credit-cards/` | Criar cartão |
| PUT | `/credit-cards/{id}` | Atualizar cartão |
| DELETE | `/credit-cards/{id}` | Excluir cartão |

### Categorias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/categories/` | Listar categorias |
| POST | `/categories/` | Criar categoria |
| PUT | `/categories/{id}` | Atualizar categoria |
| DELETE | `/categories/{id}` | Excluir categoria |

### Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/summary?month=X&year=Y` | Resumo financeiro |

---

## 📝 Variáveis de Ambiente

### Backend (`backend/.env`)
```env
DATABASE_URL=sqlite:///./sql_app.db
SECRET_KEY=sua-chave-secreta-aqui
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

---

## 🔒 Segurança

- ✅ Autenticação JWT com expiração configurável
- ✅ Hash de senhas com bcrypt (12 rounds)
- ✅ CORS configurado para origens específicas
- ✅ Validação de dados com Pydantic
- ✅ Proteção contra SQL Injection (SQLAlchemy ORM)
- ✅ Tokens Bearer para rotas protegidas

---

## 🛠 Scripts Úteis

### Resetar senha de usuário
```bash
cd backend
python fix_password.py
# Edite o arquivo para mudar email/senha
```

### Visualizar usuários do banco
```bash
cd backend
python view_db.py
```

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [MANUAL_EXECUCAO.md](MANUAL_EXECUCAO.md) | Guia rápido para rodar o sistema |
| [docs/architecture.md](docs/architecture.md) | Visão detalhada dos componentes |
| [docs/api.md](docs/api.md) | Documentação completa da API |
| [docs/roadmap.md](docs/roadmap.md) | Planejamento de evoluções |

---

## ⚠️ Problemas Comuns

| Problema | Solução |
|----------|---------|
| Porta em uso | `taskkill /F /IM node.exe` ou `taskkill /F /IM python.exe` |
| `ModuleNotFoundError` | `pip install -r requirements.txt` |
| `npm ERR!` | `npm install` |
| Credenciais inválidas | Execute `python fix_password.py` |
| Database locked | Pare o backend antes de scripts de banco |

---

## 🤝 Contribuição

Este projeto é um portfólio de demonstração técnica. Sugestões e feedbacks são bem-vindos!

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é de uso para fins de portfólio e demonstração técnica.

---

<div align="center">

Feito com ❤️ por [Maycon](https://github.com/Maycon-bd)

⭐ Se este projeto te ajudou, deixe uma estrela!

</div>