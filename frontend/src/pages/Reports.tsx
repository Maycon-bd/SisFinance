import { useEffect, useState } from 'react'
import { api, setAuthToken } from '../services/api'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/* ═══════════════════════════════════════════════════════════════════════════
   REPORTS PAGE
   Export reports in CSV/PDF formats
═══════════════════════════════════════════════════════════════════════════ */

export default function Reports() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAuthToken(token || undefined)
  }, [])

  const base = api.defaults.baseURL || ''
  const qs = `?month=${month}&year=${year}`

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__title-section">
          <h1 className="page-header__title">Relatórios</h1>
          <p className="page-header__subtitle">Exporte seus dados financeiros</p>
        </div>
        <div className="page-header__actions">
          <select
            className="m3-select"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            className="m3-select"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
          >
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid-2">
        <div className="m3-card export-card">
          <div className="export-card__icon">📊</div>
          <h3 className="export-card__title">Exportar CSV</h3>
          <p className="export-card__description">
            Exporte seus dados em formato CSV para análise em planilhas como Excel ou Google Sheets.
          </p>
          <a
            href={`${base}/reports/export/csv${qs}`}
            target="_blank"
            rel="noreferrer"
            className="btn primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Baixar CSV
          </a>
        </div>

        <div className="m3-card export-card">
          <div className="export-card__icon">📄</div>
          <h3 className="export-card__title">Exportar PDF</h3>
          <p className="export-card__description">
            Gere um relatório em PDF formatado para impressão ou compartilhamento.
          </p>
          <a
            href={`${base}/reports/export/pdf${qs}`}
            target="_blank"
            rel="noreferrer"
            className="btn primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            Baixar PDF
          </a>
        </div>
      </div>

      {/* Info Card */}
      <div className="m3-card">
        <h3 className="card-title">📈 Dicas de uso</h3>
        <ul className="tips-list">
          <li>Selecione o mês e ano desejado antes de exportar</li>
          <li>O CSV é ideal para importar em planilhas e fazer análises personalizadas</li>
          <li>O PDF é formatado para impressão e compartilhamento</li>
          <li>Em breve: relatórios anuais e comparativos</li>
        </ul>
      </div>
    </div>
  )
}