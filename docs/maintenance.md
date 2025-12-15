# Boas Práticas de Manutenção e Escalabilidade

## Código e Organização
- Separação de responsabilidades (routers, models, schemas, auth, db).
- Nomeação clara e consistente.
- Evitar acoplamento; favorecer composição e dependências explícitas.

## Banco de Dados
- Usar migrações (Alembic) para versionamento do schema.
- Índices em colunas de filtro (ex.: `Transaction.date`, `Transaction.user_id`).
- Backups (volumes Docker ou scripts externos).

## API
- Validar entrada com Pydantic.
- Retornar erros claros e status HTTP apropriados.
- Rate limit e proteção contra brute-force em login (a ser implementado).

## Frontend
- React Query para cache e sincronização com backend.
- Evitar re-renderizações desnecessárias; memoização quando aplicável.
- Acessibilidade: rótulos, foco, navegação por teclado.

## Segurança
- Manter `SECRET_KEY` seguro e rotacionável.
- Usar HTTPS em produção.
- Configurar CORS restrito.

## Observabilidade
- Logs estruturados (FastAPI uvicorn).
- Métricas e health checks.

## Deploy
- CI/CD com testes automatizados.
- Variáveis de ambiente para separar config por ambiente.