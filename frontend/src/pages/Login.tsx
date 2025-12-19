import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, setAuthToken } from '../services/api'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

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
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '))
      } else {
        setError('Falha no login')
      }
    }
  }

  return (
    <div className="auth-page">
      <Card>
        <h2>Entrar</h2>
        <form onSubmit={onSubmit} className="auth-form">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" fullWidth>Entrar</Button>
        </form>
        <div className="auth-footer">
          <div style={{ marginBottom: 12 }}>
            <Link to="/forgot-password" style={{ fontSize: 14 }}>Esqueci minha senha</Link>
          </div>
          <Link to="/register">
            Não tem conta? <span>Cadastre-se</span>
          </Link>
        </div>
      </Card>
    </div>
  )
}