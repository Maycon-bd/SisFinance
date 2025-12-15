import { useNavigate } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS PAGE
   User settings and account management
═══════════════════════════════════════════════════════════════════════════ */

export default function Settings() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
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
              <p className="settings-card__description">Gerencie suas informações pessoais</p>
            </div>
          </div>
          <div className="settings-card__actions">
            <button className="btn secondary" disabled>
              Editar Perfil (em breve)
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
    </div>
  )
}