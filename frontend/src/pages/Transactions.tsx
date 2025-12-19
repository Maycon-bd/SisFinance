import { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'
import { useTransactions } from '../hooks/useTransactions'
import { useBanks } from '../hooks/useBanks'
import { useVaults } from '../hooks/useVaults'
import { useCategories, useCreateCategory } from '../hooks/useCategories'
import { useCreditCards } from '../hooks/useCreditCards'
import { formatCurrency, formatCurrencyInput, parseCurrency } from '../utils/currency'
import { useToast } from '../components/Toast'

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/* ═══════════════════════════════════════════════════════════════════════════
   QUICK CATEGORY MODAL
═══════════════════════════════════════════════════════════════════════════ */

interface QuickCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; type: 'income' | 'expense'; icon?: string }) => void
  type: 'income' | 'expense'
}

function QuickCategoryModal({ isOpen, onClose, onSave, type }: QuickCategoryModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, type, icon: icon || undefined })
    setName('')
    setIcon('')
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content quick-category-modal">
        <h3 className="modal-title">Nova Categoria</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <label className="input-label">Nome</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Freelance, Uber, Streaming..."
              required
              autoFocus
            />
          </div>
          <div className="input-group">
            <label className="input-label">Ícone (emoji opcional)</label>
            <input
              type="text"
              className="input-field"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder="🎯"
              maxLength={4}
            />
          </div>
          <p className="category-type-hint">
            Tipo: <strong>{type === 'income' ? '💰 Receita' : '💸 Despesa'}</strong>
          </p>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn primary">Criar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTIONS PAGE
   List and add transactions
═══════════════════════════════════════════════════════════════════════════ */

export default function Transactions() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [form, setForm] = useState<{
    amount: string;
    type: 'income' | 'expense';
    category_id?: number | null;
    date: string;
    description?: string | null;
    credit_card_id?: number | null;
    installments?: number;
  }>({ amount: '', type: 'expense', date: new Date().toISOString().slice(0, 10), installments: 1 })
  const [selectedVaultId, setSelectedVaultId] = useState<string>('')
  // Unified Account Selection (Bank/Vault OR Credit Card)
  const [paymentMethod, setPaymentMethod] = useState<'account' | 'credit_card'>('account')
  const [selectedCardId, setSelectedCardId] = useState<string>('')

  const [showCategoryModal, setShowCategoryModal] = useState(false)

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrencyInput(e.target.value)
    setForm(f => ({ ...f, amount: formatted }))
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setAuthToken(token || undefined)
  }, [])

  const { listQuery, addMutation, deleteMutation } = useTransactions(month, year)
  const { listQuery: banksQuery } = useBanks()
  const { listQuery: vaultsQuery } = useVaults()
  const { listQuery: cardsQuery } = useCreditCards()
  const { data: categories = [], refetch: refetchCategories } = useCategories()
  const createCategoryMutation = useCreateCategory()
  const { showToast } = useToast()

  const banks = banksQuery.data || []
  const vaults = vaultsQuery.data || []
  const creditCards = cardsQuery.data || []

  const handleCreateCategory = async (data: { name: string; type: 'income' | 'expense'; icon?: string }) => {
    try {
      await createCategoryMutation.mutateAsync(data)
      refetchCategories()
      showToast('Categoria criada com sucesso!', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Erro ao criar categoria', 'error')
    }
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()

    // Get vault if selected
    let vault_id: number | null = null
    let bank_id: number | null = null
    let credit_card_id: number | null = null
    let installments: number | null | undefined = null

    if (paymentMethod === 'account') {
      vault_id = selectedVaultId ? Number(selectedVaultId) : null
      const vault = vault_id ? vaults.find(v => v.id === vault_id) : null
      bank_id = vault?.bank_id || null
    } else {
      credit_card_id = selectedCardId ? Number(selectedCardId) : null
      if (!credit_card_id) {
        showToast('Selecione um cartão de crédito', 'error')
        return
      }
      installments = form.installments
    }

    try {
      await addMutation.mutateAsync({
        amount: parseCurrency(form.amount),
        type: form.type,
        category_id: form.category_id || null,
        bank_id,
        vault_id,
        date: form.date,
        description: form.description || null,
        credit_card_id,
        installments,
      })
      // Reset form
      setForm({ amount: '', type: 'expense', date: new Date().toISOString().slice(0, 10), installments: 1, description: '' })
      setSelectedVaultId('')
      setSelectedCardId('')
      setPaymentMethod('account')
      showToast('Transação adicionada com sucesso!', 'success')
    } catch (err: any) {
      showToast(err?.response?.data?.detail || 'Erro ao adicionar transação', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteMutation.mutateAsync(id)
        showToast('Transação excluída com sucesso!', 'success')
      } catch (err: any) {
        showToast(err?.response?.data?.detail || 'Erro ao excluir transação', 'error')
      }
    }
  }

  const items = listQuery.data || []
  const filteredCategories = categories.filter(c => c.type === form.type)

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
                type="text"
                placeholder="R$ 0,00"
                className="input-field"
                value={form.amount}
                onChange={handleAmountChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tipo</label>
              <select
                className="m3-select"
                value={form.type}
                onChange={e => {
                  setForm(f => ({ ...f, type: e.target.value as 'income' | 'expense', category_id: null }))
                }}
              >
                <option value="income">💰 Receita</option>
                <option value="expense">💸 Despesa</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Categoria</label>
              <div className="category-select-wrapper">
                <select
                  className="m3-select"
                  value={form.category_id || ''}
                  onChange={e => {
                    if (e.target.value === 'add_new') {
                      setShowCategoryModal(true)
                    } else {
                      setForm(f => ({ ...f, category_id: e.target.value ? Number(e.target.value) : null }))
                    }
                  }}
                >
                  <option value="">Selecione a categoria</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon || '📌'} {c.name}</option>
                  ))}
                  <option value="add_new">➕ Adicionar categoria...</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Forma de Pagamento</label>
              <div className="payment-method-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${paymentMethod === 'account' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('account')}
                >
                  🏦 Conta/Caixinha
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${paymentMethod === 'credit_card' ? 'active' : ''}`}
                  onClick={() => { setPaymentMethod('credit_card'); setForm(f => ({ ...f, type: 'expense' })); }}
                >
                  💳 Cartão de Crédito
                </button>
              </div>

              {paymentMethod === 'account' ? (
                <select
                  className="m3-select mt-2"
                  value={selectedVaultId}
                  onChange={e => setSelectedVaultId(e.target.value)}
                >
                  <option value="">Selecione a caixinha...</option>
                  {banks.map(bank => {
                    const bankVaults = vaults.filter(v => v.bank_id === bank.id)
                    if (bankVaults.length === 0) return null
                    return (
                      <optgroup key={bank.id} label={`🏦 ${bank.name}`}>
                        {bankVaults.map(v => (
                          <option key={v.id} value={v.id}>
                            📦 {v.name} ({formatCurrency(v.balance)})
                          </option>
                        ))}
                      </optgroup>
                    )
                  })}
                </select>
              ) : (
                <div className="space-y-2 mt-2">
                  <select
                    className="m3-select"
                    value={selectedCardId}
                    onChange={e => setSelectedCardId(e.target.value)}
                  >
                    <option value="">Selecione o cartão...</option>
                    {creditCards.map(card => (
                      <option key={card.id} value={card.id}>
                        💳 {card.name} (Dia {card.closing_day}/{card.due_day})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-secondary-300">Parcelas:</label>
                    <select
                      className="m3-select w-20"
                      value={form.installments}
                      onChange={e => setForm(f => ({ ...f, installments: Number(e.target.value) }))}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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
            {items.map(t => {
              const category = categories.find(c => c.id === t.category_id)
              const vault = vaults.find(v => v.id === t.vault_id)
              const bank = banks.find(b => b.id === vault?.bank_id)

              return (
                <div key={t.id} className="transaction-item">
                  <div className="transaction-item__info">
                    <span className="transaction-item__description">
                      {t.description || (t.type === 'income' ? 'Receita' : 'Despesa')}
                    </span>
                    <span className="transaction-item__date">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                      {category && ` • ${category.icon || ''} ${category.name}`}
                      {category && ` • ${category.icon || ''} ${category.name}`}
                      {vault && ` • 📦 ${vault.name}`}
                      {t.credit_card_id && ` • 💳 Cartão`}
                      {t.total_installments && t.total_installments > 1 && ` • ${t.installment_number}/${t.total_installments}`}
                      {bank && !vault && !t.credit_card_id && ` • 🏦 ${bank.name}`}
                    </span>
                  </div>
                  <div className="transaction-item__actions">
                    <span className={`transaction-item__amount transaction-item__amount--${t.type === 'income' ? 'income' : 'expense'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </span>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDelete(t.id)}
                      title="Excluir transação"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Category Modal */}
      <QuickCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleCreateCategory}
        type={form.type}
      />

      <style>{`
        .transaction-item__actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
        }
        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: var(--spacing-1);
          border-radius: 50%;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: var(--md-sys-color-surface-container-highest);
        }
        .btn-icon.danger:hover {
          background: var(--md-sys-color-error-container);
        }
        .quick-category-modal {
          max-width: 360px;
        }
        .category-type-hint {
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
          margin: 8px 0;
        }
        .category-select-wrapper {
          position: relative;
        }
        .input-hint {
          font-size: 0.75rem;
          color: var(--md-sys-color-on-surface-variant);
          margin-top: 4px;
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
          max-width: 400px;
        }
        .modal-title {
          margin: 0 0 16px 0;
          font-size: 1.25rem;
          color: var(--md-sys-color-on-surface);
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 8px;
        }
          .toggle-btn {
              padding: 8px 12px;
              border-radius: 8px;
              border: 1px solid var(--md-sys-color-outline);
              background: transparent;
              color: var(--md-sys-color-on-surface-variant);
              cursor: pointer;
              transition: all 0.2s;
          }
          .toggle-btn.active {
              background: var(--md-sys-color-primary-container);
              color: var(--md-sys-color-on-primary-container);
              border-color: var(--md-sys-color-primary);
          }
          .payment-method-toggle {
              display: flex;
              gap: 8px;
          }
          .mt-2 { margin-top: 8px; }
      `}</style>
    </div>
  )
}