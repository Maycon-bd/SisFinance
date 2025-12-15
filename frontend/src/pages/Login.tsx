import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setAuthToken } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      setAuthToken(res.data.access_token)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Falha no login')
    }
  }

  return (
    <div className="auth-container">
      <h2>Entrar</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Entrar</button>
      </form>
      <div className="auth-footer">
        <Link to="/register">
          Não tem conta? <span>Cadastre-se</span>
        </Link>
      </div>
    </div>
  )
}