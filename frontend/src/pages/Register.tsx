import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

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
      setTimeout(()=>navigate('/login'), 800)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Falha no cadastro')
    }
  }

  return (
    <div style={{maxWidth: 400, margin: '40px auto'}}>
      <h2>Cadastrar</h2>
      <form onSubmit={onSubmit} style={{display:'grid', gap:8}}>
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div style={{color:'red'}}>{error}</div>}
        {success && <div style={{color:'green'}}>{success}</div>}
        <button type="submit">Cadastrar</button>
      </form>
      <div style={{marginTop:10}}>
        <Link to="/login">Já tem conta? Entrar</Link>
      </div>
    </div>
  )
}