# 🚀 Manual de Execução - SysFinance

## 📋 Pré-requisitos

- **Python 3.10+** instalado
- **Node.js 18+** instalado
- **npm** (vem com Node.js)

---

## ⚡ Iniciar o Sistema

### 1️⃣ Iniciar o Backend (Terminal 1)

```powershell
cd "c:\Users\User\Documents\PROJETOS SOFTWARE\SisFinance\backend"
python -m uvicorn app.main:app --reload --port 8000
```

**✅ Sucesso quando aparecer:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 2️⃣ Iniciar o Frontend (Terminal 2)

```powershell
cd "c:\Users\User\Documents\PROJETOS SOFTWARE\SisFinance\frontend"
npm run dev
```

**✅ Sucesso quando aparecer:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🔍 Verificar se Está Rodando

### Testar Backend (API)
Abra no navegador ou execute:
```powershell
curl http://localhost:8000/docs
```
Deve abrir a documentação Swagger da API.

### Testar Frontend
Abra no navegador:
```
http://localhost:5173
```
Deve mostrar a página de login.

### Comando rápido para testar ambos (PowerShell):
```powershell
# Testar Backend
try { 
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Backend OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch { 
    Write-Host "❌ Backend NÃO está rodando" -ForegroundColor Red 
}

# Testar Frontend
try { 
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 3
    Write-Host "✅ Frontend OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch { 
    Write-Host "❌ Frontend NÃO está rodando" -ForegroundColor Red 
}
```

---

## 🔐 Credenciais de Acesso

| Email | Senha |
|-------|-------|
| maycongarcia001@gmail.com | 123456 |

---

## 🔧 Scripts Úteis

### Resetar Senha de Usuário
```powershell
cd "c:\Users\User\Documents\PROJETOS SOFTWARE\SisFinance\backend"
python fix_password.py
```
> Edite o arquivo `fix_password.py` para mudar o email/senha desejados.

### Ver Usuários do Banco
```powershell
cd "c:\Users\User\Documents\PROJETOS SOFTWARE\SisFinance\backend"
python view_db.py
```

---

## 🛑 Parar o Sistema

Pressione `Ctrl + C` em cada terminal para parar os servidores.

---

## ⚠️ Problemas Comuns

| Problema | Solução |
|----------|---------|
| `EADDRINUSE` ou porta em uso | Feche o terminal anterior ou use `taskkill /F /IM node.exe` |
| `ModuleNotFoundError` | Execute `pip install -r requirements.txt` no backend |
| `npm ERR!` | Execute `npm install` no frontend |
| Login não funciona | Execute `python fix_password.py` para resetar senha |
| Banco bloqueado (`database is locked`) | Pare o backend antes de rodar scripts de banco |

---

## 📁 Estrutura de Pastas

```
SisFinance/
├── backend/           # API Python (FastAPI)
│   ├── app/           # Código fonte
│   ├── sql_app.db     # Banco SQLite
│   └── fix_password.py # Script reset senha
├── frontend/          # Interface React (Vite)
│   └── src/           # Código fonte
└── MANUAL_EXECUCAO.md # Este arquivo
```

---

## 🌐 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8000 |
| **Swagger Docs** | http://localhost:8000/docs |
| **ReDoc** | http://localhost:8000/redoc |
