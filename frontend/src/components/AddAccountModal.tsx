import { useState, useEffect } from 'react'
import type { Bank, Vault } from '../types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { formatCurrencyInput, parseCurrency, formatCurrency } from '../utils/currency'

interface AddAccountModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'bank' | 'vault'
    editData?: Bank | Vault | null
    banks?: Bank[]
    onSave: (data: any) => Promise<void>
}

const COLORS = ['#E31C23', '#6750A4', '#B3261E', '#7D5260', '#625B71', '#5B684F', '#006C51']
const CURRENCIES = ['BRL', 'USD', 'EUR']

export function AddAccountModal({ isOpen, onClose, type, editData, banks, onSave }: AddAccountModalProps) {
    const [name, setName] = useState('')
    const [balance, setBalance] = useState('')
    const [color, setColor] = useState(COLORS[0])
    const [currency, setCurrency] = useState('BRL')
    const [bankId, setBankId] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (editData) {
            if ('icon_color' in editData) {
                // Bank Edit
                setName(editData.name)
                setColor(editData.icon_color || COLORS[0])
            } else {
                // Vault Edit
                setName((editData as any).name)
                setBalance(formatCurrency((editData as any).balance))
                setCurrency((editData as any).currency)
                setBankId((editData as any).bank_id ? String((editData as any).bank_id) : '')
            }
        } else {
            setName('')
            setBalance('')
            setColor(COLORS[0])
            setCurrency('BRL')
            setBankId(banks && banks.length > 0 ? String(banks[0].id) : '')
        }
        setError(null)
    }, [editData, isOpen, banks])

    function handleBalanceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatCurrencyInput(e.target.value)
        setBalance(formatted)
    }

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSaving) return // Prevent duplicate submissions

        setError(null)
        setIsSaving(true)

        const payload: any = { name }

        if (type === 'bank') {
            // Bank: no initial balance needed
            payload.icon_color = color
        } else {
            // Vault: bank_id is required
            if (!bankId) {
                setError('Selecione um banco para o cofre')
                setIsSaving(false)
                return
            }
            if (!editData) {
                payload.initial_balance = parseCurrency(balance) || 0
            } else {
                payload.balance = parseCurrency(balance) || 0
            }
            payload.currency = currency
            payload.bank_id = Number(bankId)
        }

        if (editData) {
            payload.id = editData.id
        }

        try {
            await onSave(payload)
            // onClose is handled by parent after successful save
        } catch (err: any) {
            setError(err?.response?.data?.detail || 'Erro ao salvar')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {editData ? `Editar ${type === 'bank' ? 'Banco' : 'Cofre'}` : `Novo ${type === 'bank' ? 'Banco' : 'Cofre'}`}
                </h2>

                <form onSubmit={handleSubmit} className="modal-form">
                    <Input
                        label="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />

                    {type === 'bank' && (
                        <div className="form-group">
                            <label>Cor do ícone</label>
                            <div className="color-picker">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        className={`color-option ${color === c ? 'selected' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => setColor(c)}
                                    />
                                ))}
                            </div>
                            <p className="form-hint">
                                💡 O saldo do banco é a soma de todos os cofres vinculados
                            </p>
                        </div>
                    )}

                    {type === 'vault' && (
                        <>
                            <div className="form-group">
                                <label>Banco *</label>
                                <select
                                    className="m3-select"
                                    value={bankId}
                                    onChange={e => setBankId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione o banco</option>
                                    {banks?.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label={editData ? "Saldo" : "Saldo Inicial (opcional)"}
                                type="text"
                                placeholder="R$ 0,00"
                                value={balance}
                                onChange={handleBalanceChange}
                            />

                            {!editData && (
                                <div className="form-group">
                                    <label>Moeda</label>
                                    <select
                                        className="m3-select"
                                        value={currency}
                                        onChange={e => setCurrency(e.target.value)}
                                    >
                                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {error && <div className="auth-error">{error}</div>}

                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </div>

            <style>{`
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
          gap: 16px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .form-group label {
            font-size: 0.875rem;
            color: var(--md-sys-color-on-surface-variant);
        }
        .form-hint {
            font-size: 0.75rem;
            color: var(--md-sys-color-on-surface-variant);
            margin: 8px 0 0 0;
        }
        .m3-select {
            padding: 12px 16px;
            background: var(--md-sys-color-surface-container-high);
            border: 1px solid var(--md-sys-color-outline);
            border-radius: 8px;
            color: var(--md-sys-color-on-surface);
            font-size: 16px;
            outline: none;
        }
        .color-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
        }
        .color-option.selected {
          border-color: var(--md-sys-color-on-surface);
          transform: scale(1.1);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 16px;
        }
      `}</style>
        </div>
    )
}
