import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/auth/register', { email, password })
      setSuccess('Cadastro realizado! Faça login.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err: any) {
      console.error(err)
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '))
      } else {
        setError('Falha no cadastro')
      }
    }
  }

  return (
    <Card>
      <h2>Cadastrar</h2>
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
        {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
        <Button type="submit" fullWidth>Cadastrar</Button>
      </form>
      <div className="auth-footer">
        <Link to="/login">Já tem conta? <span>Entrar</span></Link>
      </div>
    </Card>
  )
}