# 💰 SysFinance

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![License](https://img.shields.io/badge/license-Portfolio-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)

**Aplicativo completo de gestão financeira pessoal**

[Funcionalidades](#-funcionalidades) •
[Tecnologias](#-tecnologias) •
[Instalação](#-instalação) •
[Documentação](#-documentação)

</div>

---

## 📋 Sobre o Projeto

SysFinance é um sistema de gestão financeira pessoal desenvolvido para auxiliar no controle de gastos e ganhos, com dashboard mensal, relatórios exportáveis (CSV/PDF), orçamentos e metas financeiras.

## ✨ Funcionalidades

- 🔐 **Autenticação segura** - Login e registro com JWT
- 📊 **Dashboard interativo** - Visualização de receitas, despesas e saldo mensal
- 💳 **Controle de transações** - Registro de gastos e ganhos por categoria
- 📈 **Relatórios** - Exportação em CSV e PDF
- 🎯 **Orçamentos e metas** - Definição e acompanhamento de limites por categoria
- 🌙 **Tema escuro** - Interface moderna com suporte a dark mode

## 🛠 Tecnologias

### Frontend
- **React 18** + **Vite** - Build rápido e moderno
- **TypeScript** - Tipagem estática
- **React Query** - Gerenciamento de estado do servidor
- **Axios** - Requisições HTTP
- **React Router** - Navegação SPA

### Backend
- **FastAPI** - Framework Python de alta performance
- **SQLAlchemy** - ORM para banco de dados
- **Pydantic** - Validação de dados
- **JWT (python-jose)** - Autenticação
- **ReportLab** - Geração de PDFs
- **Passlib** - Hash de senhas com bcrypt

### Infraestrutura
- **PostgreSQL** - Banco de dados relacional
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
SysFinance/
├── backend/
│   ├── app/
│   │   ├── main.py          # Inicialização FastAPI
│   │   ├── database.py      # Configuração SQLAlchemy
│   │   ├── models.py        # Modelos do banco
│   │   ├── schemas.py       # Schemas Pydantic
│   │   ├── auth.py          # Autenticação JWT
│   │   └── routers/         # Rotas da API
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # Serviços de API
│   │   └── App.tsx          # Componente principal
│   └── package.json
├── docs/                    # Documentação detalhada
└── docker-compose.yml       # Configuração dos containers
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Python 3.10+
- Docker Desktop

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/Maycon-bd/SisFinance.git
cd SisFinance
```

2. **Suba o banco de dados**
```bash
docker compose up -d
```

3. **Configure o Backend**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

4. **Configure o Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Acesse a aplicação**
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [Arquitetura](docs/architecture.md) | Visão detalhada dos componentes e fluxos |
| [Instalação](docs/installation.md) | Guia completo de instalação |
| [API](docs/api.md) | Endpoints, modelos e exemplos |
| [Roadmap](docs/roadmap.md) | Planejamento de evoluções |
| [Manutenção](docs/maintenance.md) | Boas práticas e escalabilidade |

## 🔒 Segurança

- Autenticação JWT com expiração configurável
- Hash de senhas com bcrypt
- CORS restrito em produção
- Validação de dados com Pydantic

## 📝 Variáveis de Ambiente

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sysfinance
SECRET_KEY=sua-chave-secreta
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

## 🤝 Contribuição

Este projeto é um portfólio de demonstração técnica. Sugestões e feedbacks são bem-vindos!

## 📄 Licença

Este projeto é de uso para fins de portfólio e demonstração técnica.

---

<div align="center">

Feito com ❤️ por [Maycon](https://github.com/Maycon-bd)

</div>