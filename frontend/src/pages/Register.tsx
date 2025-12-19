import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { formatCurrencyInput, parseCurrency } from '../utils/currency'
import { useToast } from '../components/Toast'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()

  function handleSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrencyInput(e.target.value)
    setMonthlySalary(formatted)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const salaryValue = parseCurrency(monthlySalary)
      await api.post('/auth/register', {
        email,
        password,
        full_name: fullName || null,
        monthly_salary: salaryValue || null
      })
      showToast('Cadastro realizado com sucesso!', 'success')
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
    <div className="auth-page">
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
          <Input
            placeholder="Seu nome completo"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          <Input
            placeholder="Salário mensal (Ex: R$ 1.500,00)"
            type="text"
            value={monthlySalary}
            onChange={handleSalaryChange}
          />
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" fullWidth>Cadastrar</Button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Já tem conta? <span>Entrar</span></Link>
        </div>
      </Card>
    </div>
  )
}