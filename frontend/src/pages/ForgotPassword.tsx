import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(false)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Mock functionality since backend doesn't support it yet
        setSuccess(true)
    }

    return (
        <Card>
            <h2>Recuperar Senha</h2>
            {!success ? (
                <form onSubmit={onSubmit} className="auth-form">
                    <p style={{ color: 'var(--color-gray-text)', fontSize: 14, marginBottom: 16 }}>
                        Digite seu email para receber as instruções de recuperação.
                    </p>
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" fullWidth>Enviar Email</Button>
                    <div className="auth-footer">
                        <Link to="/login">Voltar para <span>Login</span></Link>
                    </div>
                </form>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
                    <h3 style={{ color: 'var(--color-white)', marginTop: 0 }}>Email Enviado!</h3>
                    <p style={{ color: 'var(--color-gray-text)', fontSize: 14 }}>
                        Se o email <b>{email}</b> estiver cadastrado, você receberá um link de recuperação em instantes.
                    </p>
                    <div className="auth-footer">
                        <Link to="/login">Voltar para <span>Login</span></Link>
                    </div>
                </div>
            )}
        </Card>
    )
}
