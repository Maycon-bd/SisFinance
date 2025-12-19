import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../services/api'
import { useDashboard } from '../hooks/useDashboard'
import { useBanks } from '../hooks/useBanks'
import { useVaults } from '../hooks/useVaults'
import { useEvolution } from '../hooks/useEvolution'
import { useRecurringTransactions } from '../hooks/useRecurringTransactions'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrency } from '../utils/currency'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const CHART_COLORS = [
  '#E31C23', '#FF5252', '#B71C1C', '#BDBDBD', '#9E9E9E',
  '#666666', '#424242', '#333333',
]

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD PAGE
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
  const { listQuery: banksQuery } = useBanks()
  const { listQuery: vaultsQuery } = useVaults()
  const { data: evolutionData, isLoading: evolutionLoading } = useEvolution(6)
  const { data: recurringData } = useRecurringTransactions()

  const banks = banksQuery.data || []
  const vaults = vaultsQuery.data || []
  const recurring = recurringData || []

  // Consolidated totals by currency
  // Bank balance now already includes vault sums (cofres dentro do banco)
  const totalBRL = banks.reduce((sum, b) => sum + Number(b.current_balance), 0)
  // Only count foreign currency vaults separately (they're not in BRL)
  const totalUSD = vaults.filter(v => v.currency === 'USD').reduce((sum, v) => sum + Number(v.balance), 0)
  const totalEUR = vaults.filter(v => v.currency === 'EUR').reduce((sum, v) => sum + Number(v.balance), 0)

  const chartData = data
    ? Object.entries(data.by_category).map(([name, value]) => ({ name, value }))
    : []

  // Check if a recurring expense is near due (within 3 days)
  const isNearDue = (dayOfMonth: number) => {
    const today = new Date().getDate()
    const diff = dayOfMonth - today
    return diff >= 0 && diff <= 3
  }

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
              value={formatCurrency(data.total_income)}
              icon="📈"
              accent="green"
            />
            <MetricCard
              title="Despesas"
              value={formatCurrency(data.total_expense)}
              icon="📉"
              accent="red"
            />
            <MetricCard
              title="Saldo do Mês"
              value={formatCurrency(data.net)}
              icon="💰"
              accent={data.net >= 0 ? "green" : "red"}
            />
          </div>

          {/* Patrimônio Section */}
          <div className="patrimony-section">
            <div className="patrimony-main">
              <span className="patrimony-label">💼 Patrimônio Total (BRL)</span>
              <span className="patrimony-value">{formatCurrency(totalBRL)}</span>
            </div>
            {(totalUSD > 0 || totalEUR > 0) && (
              <div className="patrimony-currencies">
                {totalUSD > 0 && (
                  <span className="currency-badge usd">$ {totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                )}
                {totalEUR > 0 && (
                  <span className="currency-badge eur">€ {totalEUR.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</span>
                )}
              </div>
            )}
          </div>

          {/* Accounts Preview */}
          {banks.length > 0 && (
            <div className="accounts-preview">
              <h3>🏦 Minhas Contas</h3>
              <div className="accounts-scroll">
                {banks.slice(0, 6).map(bank => (
                  <div
                    key={bank.id}
                    className="account-mini-card"
                    style={{ borderLeftColor: bank.icon_color || 'var(--md-sys-color-primary)' }}
                  >
                    <span className="account-mini-name">{bank.name}</span>
                    <span className="account-mini-balance">
                      {formatCurrency(bank.current_balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="dashboard-content">
            {/* Line Chart - Evolution */}
            <div className="dashboard-card">
              <h3>📊 Evolução Mensal</h3>
              {evolutionLoading ? (
                <div className="loading">Carregando...</div>
              ) : evolutionData && evolutionData.some(e => e.income > 0 || e.expense > 0) ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
                    <XAxis
                      dataKey="month"
                      stroke="var(--md-sys-color-on-surface-variant)"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="var(--md-sys-color-on-surface-variant)"
                      fontSize={12}
                      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        background: 'var(--md-sys-color-surface-container-high)',
                        border: '1px solid var(--md-sys-color-outline-variant)',
                        borderRadius: '8px',
                        color: 'var(--md-sys-color-on-surface)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="var(--md-sys-color-success)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--md-sys-color-success)', strokeWidth: 2 }}
                      name="Receitas"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="var(--md-sys-color-error)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--md-sys-color-error)', strokeWidth: 2 }}
                      name="Despesas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📈</div>
                  <p className="empty-state__text">
                    Adicione transações para visualizar a evolução.
                  </p>
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="dashboard-card">
              <h3>🍕 Despesas por Categoria</h3>
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
                      formatter={(value: number) => formatCurrency(Math.abs(value))}
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

          {/* Recurring and Category Grid */}
          <div className="dashboard-content">
            {/* Recurring Transactions */}
            <div className="dashboard-card">
              <h3>📅 Próximos Vencimentos</h3>
              {recurring.length > 0 ? (
                <ul className="upcoming-list">
                  {recurring.slice(0, 5).map(r => (
                    <li key={r.id} className={isNearDue(r.day_of_month) ? 'near-due' : ''}>
                      <span className="upcoming-desc">{r.description || 'Despesa recorrente'}</span>
                      <span className="upcoming-info">
                        {formatCurrency(r.amount)} • Dia {r.day_of_month}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📅</div>
                  <p className="empty-state__text">Nenhuma despesa recorrente cadastrada.</p>
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div className="dashboard-card">
              <h3>📋 Detalhamento por Categoria</h3>
              <ul className="category-list">
                {Object.entries(data.by_category).map(([name, val]) => (
                  <li key={name} className="category-item">
                    <span className="category-name">{name}</span>
                    <span className={`category-value ${val >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(Math.abs(val))}
                    </span>
                  </li>
                ))}
                {Object.keys(data.by_category).length === 0 && (
                  <li className="empty-state">
                    <p className="empty-state__text">Sem dados para este período.</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Floating Action Button */}
      <button className="m3-fab" onClick={() => navigate('/transactions')} title="Nova Transação">
        <svg className="m3-fab__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>

      <style>{`
        .patrimony-section {
          background: var(--md-sys-color-surface-container);
          border-radius: 16px;
          padding: var(--spacing-4);
          margin-bottom: var(--spacing-4);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-3);
        }
        .patrimony-main {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1);
        }
        .patrimony-label {
          font-size: var(--md-sys-typescale-label-medium-font-size);
          color: var(--md-sys-color-on-surface-variant);
        }
        .patrimony-value {
          font-size: var(--md-sys-typescale-headline-medium-font-size);
          font-weight: 600;
          color: var(--md-sys-color-primary);
        }
        .patrimony-currencies {
          display: flex;
          gap: var(--spacing-2);
        }
        .currency-badge {
          padding: var(--spacing-1) var(--spacing-3);
          border-radius: 20px;
          font-size: var(--md-sys-typescale-label-medium-font-size);
          font-weight: 500;
        }
        .currency-badge.usd {
          background: var(--md-sys-color-tertiary-container);
          color: var(--md-sys-color-on-tertiary-container);
        }
        .currency-badge.eur {
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
        }
        
        .accounts-preview {
          margin-bottom: var(--spacing-4);
        }
        .accounts-preview h3 {
          font-size: var(--md-sys-typescale-title-medium-font-size);
          color: var(--md-sys-color-on-surface);
          margin-bottom: var(--spacing-3);
        }
        .accounts-scroll {
          display: flex;
          gap: var(--spacing-3);
          overflow-x: auto;
          padding-bottom: var(--spacing-2);
        }
        .accounts-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .accounts-scroll::-webkit-scrollbar-track {
          background: var(--md-sys-color-surface-container);
          border-radius: 4px;
        }
        .accounts-scroll::-webkit-scrollbar-thumb {
          background: var(--md-sys-color-outline-variant);
          border-radius: 4px;
        }
        .account-mini-card {
          min-width: 160px;
          background: var(--md-sys-color-surface-container);
          border-radius: 12px;
          padding: var(--spacing-3);
          border-left: 4px solid var(--md-sys-color-primary);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-1);
        }
        .account-mini-name {
          font-size: var(--md-sys-typescale-label-medium-font-size);
          color: var(--md-sys-color-on-surface-variant);
        }
        .account-mini-balance {
          font-size: var(--md-sys-typescale-title-medium-font-size);
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
        }

        .upcoming-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .upcoming-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-3);
          border-radius: 8px;
          margin-bottom: var(--spacing-2);
          background: var(--md-sys-color-surface-container);
          transition: background 0.2s;
        }
        .upcoming-list li:hover {
          background: var(--md-sys-color-surface-container-high);
        }
        .upcoming-list li.near-due {
          background: var(--md-sys-color-error-container);
          border-left: 3px solid var(--md-sys-color-error);
        }
        .upcoming-desc {
          font-weight: 500;
          color: var(--md-sys-color-on-surface);
        }
        .upcoming-info {
          font-size: var(--md-sys-typescale-label-medium-font-size);
          color: var(--md-sys-color-on-surface-variant);
        }
        
        .category-value.positive {
          color: var(--md-sys-color-success);
        }
        .category-value.negative {
          color: var(--md-sys-color-error);
        }
      `}</style>
    </div>
  )
}