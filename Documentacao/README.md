# SisFinance - Sistema de Gerenciamento Financeiro Pessoal

## 📋 Visão Geral

O SisFinance é um sistema de gerenciamento financeiro pessoal desenvolvido em Python utilizando FastAPI, com arquitetura cliente-servidor e banco de dados MySQL. O projeto segue padrões de Clean Architecture e boas práticas de desenvolvimento.

## 🏗️ Arquitetura

### Padrão Arquitetural
- **Arquitetura Cliente-Servidor**: Separação clara entre frontend e backend
- **Clean Architecture**: Organização em camadas com responsabilidades bem definidas
- **API RESTful**: Interface padronizada para comunicação

### Stack Tecnológica
- **Backend**: FastAPI (Python)
- **Banco de Dados**: MySQL 8.0
- **ORM**: SQLAlchemy
- **Containerização**: Docker + Docker Compose
- **Driver de Banco**: PyMySQL

### Benefícios da Arquitetura Cliente-Servidor
- **Separação de Responsabilidades**: Backend focado na lógica de negócio e dados, frontend na apresentação
- **Escalabilidade**: Possibilidade de escalar backend e frontend independentemente
- **Manutenibilidade**: Código organizado em camadas com responsabilidades bem definidas
- **Testabilidade**: Facilita a criação de testes unitários e de integração
- **Reutilização**: API pode ser consumida por diferentes tipos de clientes (web, mobile, desktop)

## 📁 Estrutura do Projeto

```
SisFinance/
├── backend/                      # Servidor da aplicação
│   ├── api/                      # Camada de API
│   │   ├── dependencies/         # Dependências da API
│   │   │   ├── database.py       # Dependência do banco de dados
│   │   │   └── __init__.py
│   │   ├── routers/              # Endpoints da API
│   │   │   ├── categorias.py     # Rotas de categorias
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── core/                     # Núcleo da aplicação
│   │   ├── config.py             # Configurações da aplicação
│   │   ├── exceptions.py         # Exceções personalizadas
│   │   └── __init__.py
│   ├── db/                       # Camada de dados
│   │   ├── models/               # Modelos de dados
│   │   │   ├── models.py         # Modelos SQLAlchemy
│   │   │   └── __init__.py
│   │   ├── database.py           # Configuração do banco
│   │   └── __init__.py
│   ├── schemas/                  # Schemas de validação
│   │   ├── schemas.py            # Schemas Pydantic
│   │   └── __init__.py
│   ├── services/                 # Lógica de negócio
│   │   ├── categoria_service.py  # Serviços de categoria
│   │   └── __init__.py
│   ├── main.py                   # Ponto de entrada da API
│   ├── requirements.txt          # Dependências Python
│   └── __init__.py
├── frontend/                     # Cliente da aplicação
│   ├── categoria_view.py         # Interface de categorias
│   └── __init__.py
├── Configuracao de ambiente/     # Documentação de configuração
├── Desenvolvimento/              # Recursos de desenvolvimento
├── Documentacao/                 # Documentação do projeto
│   └── README.md                 # Este arquivo
├── Dockerfile                    # Configuração do container
├── docker-compose.yml            # Orquestração de serviços
└── .gitignore                    # Arquivos ignorados pelo Git
```

## 🚀 Configuração e Execução

### Pré-requisitos
- Docker
- Docker Compose
- Python 3.8+ (para desenvolvimento local)

### Executando com Docker

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd SisFinance
   ```

2. **Execute os serviços**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - API: http://localhost:8000
   - Documentação Swagger: http://localhost:8000/docs
   - MySQL: localhost:3307

### Configuração do Banco de Dados

**Credenciais padrão (desenvolvimento):**
- Host: localhost
- Porta: 3307
- Database: expenses_db
- Usuário: user
- Senha: password
- Root Password: rootpassword

## 📊 Status Atual do Desenvolvimento

### ✅ Implementado
- [x] Estrutura básica do projeto
- [x] Configuração Docker/Docker Compose
- [x] FastAPI básico com endpoint de status
- [x] Dependências definidas
- [x] Organização em camadas

### ⏳ Em Desenvolvimento
- [ ] Configuração do banco de dados (SQLAlchemy)
- [ ] Modelos de dados financeiros
- [ ] Schemas Pydantic para validação
- [ ] Controllers com lógica de negócio
- [ ] Routers com endpoints da API
- [ ] Views para apresentação

### 🔄 Próximas Funcionalidades
- [ ] Autenticação e autorização
- [ ] Gestão de categorias
- [ ] Controle de receitas e despesas
- [ ] Relatórios financeiros
- [ ] Dashboard analítico
- [ ] Backup e recuperação

## 🛠️ Desenvolvimento

### Instalação Local

1. **Instale as dependências**
   ```bash
   cd app
   pip install -r requirements.txt
   ```

2. **Execute localmente**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Padrões de Código

- **Nomenclatura**: snake_case para funções e variáveis
- **Documentação**: Docstrings em português
- **Validação**: Schemas Pydantic obrigatórios
- **Tratamento de Erros**: Middleware personalizado
- **Logs**: Estruturados para auditoria

## 🔒 Segurança

### Medidas Implementadas
- Containerização com Docker
- Separação de credenciais por ambiente

### Medidas Planejadas
- [ ] Variáveis de ambiente para credenciais
- [ ] Autenticação JWT
- [ ] Validação rigorosa de inputs
- [ ] Logs de auditoria
- [ ] Criptografia de dados sensíveis
- [ ] Rate limiting
- [ ] CORS configurado

## 📈 Funcionalidades Planejadas

### Módulo de Categorias
- Criação, edição e exclusão de categorias
- Categorização hierárquica
- Associação com transações

### Módulo Financeiro
- Registro de receitas e despesas
- Controle de saldos
- Histórico de transações
- Conciliação bancária

### Módulo de Relatórios
- Relatórios por período
- Gráficos de evolução
- Análise de gastos por categoria
- Projeções financeiras

### Módulo de Configurações
- Perfil do usuário
- Configurações de moeda
- Backup automático
- Notificações

## 🧪 Testes

### Estratégia de Testes
- **Testes Unitários**: Validação de funções individuais
- **Testes de Integração**: Fluxos completos da API
- **Testes de Carga**: Performance sob stress
- **Testes de Segurança**: Vulnerabilidades

### Cenários Críticos
- Precisão em cálculos monetários
- Integridade de transações
- Concorrência em operações
- Recuperação após falhas

## 📚 Documentação

- **README.md**: Este arquivo
- **API Docs**: Swagger UI em `/docs`
- **Configuração**: `Configuracao de ambiente/`
- **Desenvolvimento**: `Desenvolvimento/`
- **Documentação Técnica**: `Documentacao/`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

[Definir licença do projeto]

## 📞 Contato

[Informações de contato do desenvolvedor]

---

**Última atualização**: [Data atual]
**Versão**: 0.1.0 (Desenvolvimento)
**Status**: Em desenvolvimento ativo