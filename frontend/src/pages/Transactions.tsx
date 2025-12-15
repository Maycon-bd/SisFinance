import { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'
import { useTransactions } from '../hooks/useTransactions'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTIONS PAGE
   List and add transactions
═══════════════════════════════════════════════════════════════════════════ */

export default function Transactions() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [form, setForm] = useState<{
    amount?: number | string;
    type: 'income' | 'expense';
    category_id?: number | null;
    date: string;
    description?: string | null;
  }>({ type: 'expense', date: new Date().toISOString().slice(0, 10) })

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAuthToken(token || undefined)
  }, [])

  const { listQuery, addMutation } = useTransactions(month, year)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    addMutation.mutate({
      amount: Number(form.amount),
      type: form.type,
      category_id: form.category_id || null,
      date: form.date,
      description: form.description || null,
    })
    // Reset form after successful add
    if (!addMutation.isError) {
      setForm({ type: 'expense', date: new Date().toISOString().slice(0, 10) })
    }
  }

  const items = listQuery.data || []

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__title-section">
          <h1 className="page-header__title">Transações</h1>
          <p className="page-header__subtitle">Gerencie suas receitas e despesas</p>
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

      {/* Two Column Layout */}
      <div className="grid-2">
        {/* Add Transaction Form */}
        <div className="m3-card">
          <h3 className="card-title">Nova Transação</h3>
          <form onSubmit={add} className="transaction-form">
            <div className="input-group">
              <label className="input-label">Valor</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                className="input-field"
                value={form.amount || ''}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tipo</label>
              <select
                className="m3-select"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as 'income' | 'expense' }))}
              >
                <option value="income">💰 Receita</option>
                <option value="expense">💸 Despesa</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Data</label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Categoria (opcional)</label>
              <input
                type="number"
                placeholder="ID da categoria"
                className="input-field"
                value={form.category_id || ''}
                onChange={e => setForm(f => ({ ...f, category_id: Number(e.target.value) || null }))}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Descrição</label>
              <input
                type="text"
                placeholder="Ex: Salário, Aluguel, Mercado..."
                className="input-field"
                value={form.description || ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <button
              type="submit"
              className="btn primary"
              disabled={addMutation.isPending}
            >
              {addMutation.isPending ? 'Adicionando...' : 'Adicionar Transação'}
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="m3-card">
          <h3 className="card-title">Histórico</h3>

          {listQuery.isLoading && <div className="loading">Carregando...</div>}

          {(listQuery.error || addMutation.error) && (
            <div className="auth-error">
              {(listQuery.error as any)?.message || (addMutation.error as any)?.message || 'Erro ao carregar transações'}
            </div>
          )}

          {items.length === 0 && !listQuery.isLoading && (
            <div className="empty-state">
              <div className="empty-state__icon">📝</div>
              <p className="empty-state__text">Nenhuma transação neste período.</p>
            </div>
          )}

          <div className="transactions-list">
            {items.map(t => (
              <div key={t.id} className="transaction-item">
                <div className="transaction-item__info">
                  <span className="transaction-item__description">
                    {t.description || (t.type === 'income' ? 'Receita' : 'Despesa')}
                  </span>
                  <span className="transaction-item__date">
                    {new Date(t.date).toLocaleDateString('pt-BR')}
                    {t.category_id && ` • Cat: ${t.category_id}`}
                  </span>
                </div>
                <span className={`transaction-item__amount transaction-item__amount--${t.type === 'income' ? 'income' : 'expense'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}