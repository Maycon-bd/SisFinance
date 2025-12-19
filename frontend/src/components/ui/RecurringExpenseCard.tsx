import type { RecurringTransaction } from '../../types'
import { formatCurrency } from '../../utils/currency'

interface RecurringExpenseCardProps {
    recurring: RecurringTransaction
    onDelete?: (id: number) => void
    onEdit?: (recurring: RecurringTransaction) => void
}

export function RecurringExpenseCard({ recurring, onDelete, onEdit }: RecurringExpenseCardProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${recurring.type === 'expense' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    📄
                </div>
                <div>
                    <h4 className="font-medium text-white">{recurring.description || 'Sem descrição'}</h4>
                    <div className="flex items-center gap-2 text-xs text-secondary-400">
                        <span className="flex items-center gap-1">
                            📅 Dia {recurring.day_of_month}
                        </span>
                        {recurring.bank_id && <span>• Debito em conta</span>}
                        {recurring.credit_card_id && <span>• Cartão de Crédito</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className={`font-semibold ${recurring.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                    {recurring.type === 'expense' ? '-' : '+'}{formatCurrency(recurring.amount)}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(recurring)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-secondary-400 hover:text-white transition-colors"
                        >
                            ✏️
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(recurring.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                            title="Excluir"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
