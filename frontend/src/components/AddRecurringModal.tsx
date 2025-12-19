import { useState, useEffect } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { formatCurrencyInput, parseCurrency } from '../utils/currency'
import { useToast } from './Toast'
import type { RecurringTransaction } from '../types'
import { useBanks } from '../hooks/useBanks'
import { useCreditCards } from '../hooks/useCreditCards'
import { useCategories } from '../hooks/useCategories'

interface AddRecurringModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => Promise<void>
    initialData?: RecurringTransaction | null
}

export function AddRecurringModal({ isOpen, onClose, onSave, initialData }: AddRecurringModalProps) {
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [dayOfMonth, setDayOfMonth] = useState('')
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [categoryId, setCategoryId] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'bank' | 'credit_card'>('bank')
    const [selectedBankId, setSelectedBankId] = useState('')
    const [selectedCardId, setSelectedCardId] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const { showToast } = useToast()

    const { listQuery: { data: banks } } = useBanks()
    const { listQuery: { data: creditCards } } = useCreditCards()
    const { data: categories } = useCategories()

    useEffect(() => {
        if (initialData) {
            setDescription(initialData.description || '')
            setAmount(formatCurrencyInput(initialData.amount.toString()))
            setDayOfMonth(initialData.day_of_month.toString())
            setType(initialData.type)
            setCategoryId(initialData.category_id?.toString() || '')
            if (initialData.credit_card_id) {
                setPaymentMethod('credit_card')
                setSelectedCardId(initialData.credit_card_id.toString())
            } else if (initialData.bank_id) {
                setPaymentMethod('bank')
                setSelectedBankId(initialData.bank_id.toString())
            }
        } else {
            setDescription('')
            setAmount('')
            setDayOfMonth('')
            setType('expense')
            setCategoryId('')
            setPaymentMethod('bank')
            setSelectedBankId('')
            setSelectedCardId('')
        }
    }, [initialData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSaving) return

        if (!description || !amount || !dayOfMonth || !categoryId) {
            showToast('Preencha todos os campos obrigatórios', 'error')
            return
        }

        if (paymentMethod === 'bank' && !selectedBankId) {
            showToast('Selecione um banco', 'error')
            return
        }
        if (paymentMethod === 'credit_card' && !selectedCardId) {
            showToast('Selecione um cartão de crédito', 'error')
            return
        }

        try {
            setIsSaving(true)
            const payload: any = {
                description,
                amount: parseCurrency(amount),
                day_of_month: parseInt(dayOfMonth),
                type,
                category_id: parseInt(categoryId),
            }

            if (paymentMethod === 'bank') {
                payload.bank_id = parseInt(selectedBankId)
                payload.credit_card_id = null
            } else {
                payload.credit_card_id = parseInt(selectedCardId)
                payload.bank_id = null
            }

            await onSave(payload)
            onClose()
        } catch (error) {
            console.error(error)
            showToast('Erro ao salvar despesa fixa', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1C1C1E] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                        {initialData ? "Editar Despesa Fixa" : "Nova Despesa Fixa"}
                    </h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="flex bg-white/5 p-1 rounded-lg mb-4">
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-lg' : 'text-secondary-400 hover:text-white'
                                    }`}
                            >
                                Despesa
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-lg' : 'text-secondary-400 hover:text-white'
                                    }`}
                            >
                                Receita Fixa
                            </button>
                        </div>

                        <Input
                            label="Descrição"
                            placeholder="Ex: Aluguel, Netflix, Salário"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />

                        <Input
                            label="Valor"
                            placeholder="R$ 0,00"
                            value={amount}
                            onChange={e => setAmount(formatCurrencyInput(e.target.value))}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-300 mb-1">Categoria</label>
                                <select
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {categories?.filter(c => c.type === type).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Dia do Mês"
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Ex: 5"
                                value={dayOfMonth}
                                onChange={e => setDayOfMonth(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-300 mb-2">Forma de Pagamento</label>
                            <div className="flex gap-4 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === 'bank'}
                                        onChange={() => setPaymentMethod('bank')}
                                        className="text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-white">Conta Bancária</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={() => setPaymentMethod('credit_card')}
                                        className="text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-white">Cartão de Crédito</span>
                                </label>
                            </div>

                            {paymentMethod === 'bank' ? (
                                <select
                                    value={selectedBankId}
                                    onChange={e => setSelectedBankId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                    required
                                >
                                    <option value="">Selecione o Banco...</option>
                                    {banks?.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <select
                                    value={selectedCardId}
                                    onChange={e => setSelectedCardId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                    required
                                >
                                    <option value="">Selecione o Cartão...</option>
                                    {creditCards?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={isSaving}>
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
