import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../services/api'
import { useDashboard } from '../hooks/useDashboard'
import { MetricCard } from '../components/ui/MetricCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const CHART_COLORS = [
  '#D0BCFF', // Primary
  '#CCC2DC', // Secondary
  '#EFB8C8', // Tertiary
  '#7DDC7F', // Success
  '#F2B8B5', // Error
  '#4F378B', // Primary Container
  '#4A4458', // Secondary Container
  '#633B48', // Tertiary Container
]

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   Main overview with KPIs and charts
═══════════════════════════════════════════════════════════════════════════ */

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAuthToken(token || undefined)
  }, [])

  const { data, error, isLoading } = useDashboard(month, year)

  const chartData = data
    ? Object.entries(data.by_category).map(([name, value]) => ({ name, value }))
    : []



  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1>Visão Geral</h1>
          <p>Acompanhe suas finanças de forma simples e organizada.</p>
        </div>
        <div className="dashboard-filters">
          <select value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2023, 2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {isLoading && <div className="loading">Carregando...</div>}
      {error && <div className="auth-error">{(error as any)?.message || 'Erro ao carregar dados'}</div>}

      {/* Metrics */}
      {data && (
        <>
          <div className="metrics-grid">
            <MetricCard
              title="Receitas"
              value={`R$ ${data.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon="📈"
              accent="green"
            />
            <MetricCard
              title="Despesas"
              value={`R$ ${data.total_expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon="📉"
              accent="red"
            />
            <MetricCard
              title="Saldo"
              value={`R$ ${data.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              icon="💰"
              accent="neutral"
            />
          </div>

          {/* Content Grid */}
          <div className="dashboard-content">
            {/* Line Chart - Evolution (Coming Soon - requires backend endpoint) */}
            <div className="dashboard-card">
              <h3>Evolução Mensal</h3>
              <div className="empty-state">
                <div className="empty-state__icon">📈</div>
                <p className="empty-state__text">
                  Gráfico de evolução em breve.<br />
                  <small style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Adicione transações para visualizar a evolução.
                  </small>
                </p>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="dashboard-card">
              <h3>Despesas por Categoria</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name }) => name}
                      labelLine={{ stroke: 'var(--md-sys-color-outline)' }}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      contentStyle={{
                        background: 'var(--md-sys-color-surface-container-high)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        borderRadius: '8px',
                        color: 'var(--md-sys-color-on-surface)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📊</div>
                  <p className="empty-state__text">Nenhuma categoria registrada.</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="dashboard-card">
            <h3>Detalhamento por Categoria</h3>
            <ul className="category-list">
              {Object.entries(data.by_category).map(([name, val]) => (
                <li key={name} className="category-item">
                  <span className="category-name">{name}</span>
                  <span className="category-value">R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </li>
              ))}
              {Object.keys(data.by_category).length === 0 && (
                <li className="empty-state">
                  <p className="empty-state__text">Sem dados para este período.</p>
                </li>
              )}
            </ul>
          </div>
        </>
      )}

      {/* Floating Action Button */}
      <button className="m3-fab" onClick={() => navigate('/transactions')} title="Nova Transação">
        <svg className="m3-fab__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </div>
  )
}