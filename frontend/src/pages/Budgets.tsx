/* ═══════════════════════════════════════════════════════════════════════════
   BUDGETS PAGE
   Budget and goals management (Coming Soon)
═══════════════════════════════════════════════════════════════════════════ */

export default function Budgets() {
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__title-section">
          <h1 className="page-header__title">Orçamentos</h1>
          <p className="page-header__subtitle">Defina limites e acompanhe seus gastos</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="m3-card coming-soon-card">
        <div className="coming-soon-card__icon">🎯</div>
        <h2 className="coming-soon-card__title">Em breve!</h2>
        <p className="coming-soon-card__description">
          Estamos trabalhando em recursos incríveis para você:
        </p>
        <ul className="feature-list">
          <li className="feature-list__item">
            <span className="feature-list__icon">💰</span>
            <div className="feature-list__content">
              <strong>Orçamentos por Categoria</strong>
              <span>Defina limites mensais para cada categoria de despesa</span>
            </div>
          </li>
          <li className="feature-list__item">
            <span className="feature-list__icon">📊</span>
            <div className="feature-list__content">
              <strong>Acompanhamento em Tempo Real</strong>
              <span>Veja quanto já gastou vs. o limite definido</span>
            </div>
          </li>
          <li className="feature-list__item">
            <span className="feature-list__icon">🔔</span>
            <div className="feature-list__content">
              <strong>Alertas Inteligentes</strong>
              <span>Receba notificações quando estiver próximo do limite</span>
            </div>
          </li>
          <li className="feature-list__item">
            <span className="feature-list__icon">🎯</span>
            <div className="feature-list__content">
              <strong>Metas de Economia</strong>
              <span>Defina objetivos e acompanhe seu progresso</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}