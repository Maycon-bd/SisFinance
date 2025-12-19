import type { CreditCard } from '../../types'
import { formatCurrency } from '../../utils/currency'


interface CreditCardCardProps {
    card: CreditCard
    onDelete?: (id: number) => void
    onEdit?: (card: CreditCard) => void
}

export function CreditCardCard({ card, onDelete, onEdit }: CreditCardCardProps) {
    return (
        <div
            className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors relative group"
            style={{
                background: `linear-gradient(135deg, ${card.color || '#333'} 0%, rgba(0,0,0,0.8) 100%)`
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white">
                    💳
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(card); }}
                            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                            title="Editar"
                        >
                            ✏️
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                            title="Excluir"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-1 text-white">
                <h3 className="font-medium text-lg leading-tight">{card.name}</h3>
                <p className="text-sm opacity-80">Limite: {formatCurrency(card.limit)}</p>
            </div>

            <div className="mt-4 flex gap-4 text-xs text-white/70">
                <div>
                    <span className="block opacity-50">Fechamento</span>
                    <span className="font-medium">Dia {card.closing_day}</span>
                </div>
                <div>
                    <span className="block opacity-50">Vencimento</span>
                    <span className="font-medium">Dia {card.due_day}</span>
                </div>
            </div>
        </div>
    )
}
