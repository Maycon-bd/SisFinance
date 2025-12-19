import { useState, useEffect } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { formatCurrencyInput, parseCurrency } from '../utils/currency'
import { useToast } from './Toast'
import type { CreditCard } from '../types'

interface AddCreditCardModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => Promise<void>
    initialData?: CreditCard | null
}

export function AddCreditCardModal({ isOpen, onClose, onSave, initialData }: AddCreditCardModalProps) {
    const [name, setName] = useState('')
    const [limit, setLimit] = useState('')
    const [closingDay, setClosingDay] = useState('')
    const [dueDay, setDueDay] = useState('')
    const [color, setColor] = useState('#333333')
    const [isSaving, setIsSaving] = useState(false)

    const { showToast } = useToast()

    useEffect(() => {
        if (initialData) {
            setName(initialData.name)
            setLimit(formatCurrencyInput(initialData.limit.toString()))
            setClosingDay(initialData.closing_day.toString())
            setDueDay(initialData.due_day.toString())
            setColor(initialData.color || '#333333')
        } else {
            setName('')
            setLimit('')
            setClosingDay('')
            setDueDay('')
            setColor('#333333')
        }
    }, [initialData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isSaving) return

        if (!name || !limit || !closingDay || !dueDay) {
            showToast('Preencha todos os campos obrigatórios', 'error')
            return
        }

        try {
            setIsSaving(true)
            await onSave({
                name,
                limit: parseCurrency(limit),
                closing_day: parseInt(closingDay),
                due_day: parseInt(dueDay),
                color
            })
            onClose()
        } catch (error) {
            console.error(error)
            showToast('Erro ao salvar cartão', 'error')
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
                        {initialData ? "Editar Cartão de Crédito" : "Novo Cartão de Crédito"}
                    </h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nome do Cartão"
                            placeholder="Ex: Nubank, XP Visa"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />

                        <Input
                            label="Limite"
                            placeholder="R$ 0,00"
                            value={limit}
                            onChange={e => setLimit(formatCurrencyInput(e.target.value))}
                            required
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Dia Fechamento"
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Ex: 5"
                                value={closingDay}
                                onChange={e => setClosingDay(e.target.value)}
                                required
                            />
                            <Input
                                label="Dia Vencimento"
                                type="number"
                                min="1"
                                max="31"
                                placeholder="Ex: 10"
                                value={dueDay}
                                onChange={e => setDueDay(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-300 mb-1">Cor do Cartão</label>
                            <div className="flex gap-2">
                                {['#000000', '#1a1a1a', '#820ad1', '#0051ba', '#e50914', '#f7931a', '#008000'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-primary-500 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    className="w-8 h-8 rounded-full bg-transparent cursor-pointer"
                                />
                            </div>
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
