import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../services/api'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { formatCurrency, formatCurrencyInput, parseCurrency } from '../utils/currency'
import { useToast } from '../components/Toast'

interface UserProfile {
  id: number
  email: string
  full_name: string | null
  monthly_salary: number | null
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS PAGE
   User settings and account management
═══════════════════════════════════════════════════════════════════════════ */

export default function Settings() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showEditModal, setShowEditModal] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [fullName, setFullName] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      fetchUser()
    }
  }, [])

  async function fetchUser() {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
      setFullName(res.data.full_name || '')
      if (res.data.monthly_salary) {
        setMonthlySalary(formatCurrency(res.data.monthly_salary))
      }
    } catch (err) {
      console.error('Error fetching user:', err)
    } finally {
      setLoading(false)
    }
  }

  function openEditModal() {
    setError(null)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowEditModal(true)
  }

  function handleSalaryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrencyInput(e.target.value)
    setMonthlySalary(formatted)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validate password change
    if (newPassword || confirmPassword) {
      if (!currentPassword) {
        setError('Digite sua senha atual para alterar a senha')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('As senhas não coincidem')
        return
      }
      if (newPassword.length < 6) {
        setError('A nova senha deve ter no mínimo 6 caracteres')
        return
      }
    }

    setSaving(true)
    try {
      const payload: any = {
        full_name: fullName || null,
        monthly_salary: parseCurrency(monthlySalary) || null
      }

      if (newPassword && currentPassword) {
        payload.current_password = currentPassword
        payload.new_password = newPassword
      }

      const res = await api.put('/auth/profile', payload)
      setUser(res.data)
      showToast('Perfil atualizado com sucesso!', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowEditModal(false)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      if (typeof detail === 'string') {
        setError(detail)
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '))
      } else {
        setError('Erro ao atualizar perfil')
      }
    } finally {
      setSaving(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    showToast('Você saiu da conta', 'info')
    navigate('/login')
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__title-section">
          <h1 className="page-header__title">Configurações</h1>
          <p className="page-header__subtitle">Gerencie sua conta e preferências</p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="settings-grid">
        {/* Account Card */}
        <div className="m3-card settings-card">
          <div className="settings-card__header">
            <div className="m3-avatar m3-avatar--large">👤</div>
            <div className="settings-card__info">
              <h3 className="settings-card__title">Minha Conta</h3>
              <p className="settings-card__description">
                {loading ? 'Carregando...' : user?.email || 'Gerencie suas informações pessoais'}
              </p>
            </div>
          </div>
          <div className="settings-card__content" style={{ marginTop: 12 }}>
            {user && (
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>
                <p><strong>Nome:</strong> {user.full_name || 'Não informado'}</p>
                <p><strong>Salário:</strong> {user.monthly_salary ? formatCurrency(user.monthly_salary) : 'Não informado'}</p>
              </div>
            )}
          </div>
          <div className="settings-card__actions">
            <button className="btn primary" onClick={openEditModal}>
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="m3-card settings-card">
          <div className="settings-card__header">
            <div className="settings-card__icon">🔔</div>
            <div className="settings-card__info">
              <h3 className="settings-card__title">Notificações</h3>
              <p className="settings-card__description">Configure alertas e lembretes</p>
            </div>
          </div>
          <div className="settings-card__content">
            <p className="coming-soon-text">Em breve: notificações personalizadas para limites de gastos e vencimentos.</p>
          </div>
        </div>

        {/* Theme Card */}
        <div className="m3-card settings-card">
          <div className="settings-card__header">
            <div className="settings-card__icon">🎨</div>
            <div className="settings-card__info">
              <h3 className="settings-card__title">Aparência</h3>
              <p className="settings-card__description">Personalize o visual do app</p>
            </div>
          </div>
          <div className="settings-card__content">
            <div className="theme-badge">
              <span className="theme-badge__icon">🌙</span>
              <span className="theme-badge__text">Modo Escuro Ativo</span>
            </div>
          </div>
        </div>

        {/* Logout Card */}
        <div className="m3-card settings-card settings-card--danger">
          <div className="settings-card__header">
            <div className="settings-card__icon">🚪</div>
            <div className="settings-card__info">
              <h3 className="settings-card__title">Sair da Conta</h3>
              <p className="settings-card__description">Encerre sua sessão atual</p>
            </div>
          </div>
          <div className="settings-card__actions">
            <button className="btn danger" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Editar Perfil</h2>

            <form onSubmit={handleSaveProfile} className="modal-form">
              <div className="form-section">
                <h4 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: 12 }}>Informações Pessoais</h4>
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome completo"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
                <Input
                  label="Salário Mensal"
                  placeholder="R$ 0,00"
                  type="text"
                  value={monthlySalary}
                  onChange={handleSalaryChange}
                />
              </div>

              <div className="form-section" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                <h4 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: 12 }}>Alterar Senha</h4>
                <p style={{ fontSize: 12, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: 12 }}>
                  Deixe em branco para manter a senha atual
                </p>
                <Input
                  label="Senha Atual"
                  placeholder="Digite sua senha atual"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
                <Input
                  label="Nova Senha"
                  placeholder="Digite a nova senha"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirmar Nova Senha"
                  placeholder="Confirme a nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <div className="auth-error" style={{ marginTop: 12 }}>{error}</div>}

              <div className="modal-actions">
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: var(--md-sys-color-surface-container);
          padding: 24px;
          border-radius: 28px;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--md-sys-elevation-3);
        }
        .modal-title {
          margin: 0 0 24px 0;
          font-size: 1.5rem;
          color: var(--md-sys-color-on-surface);
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  )
}