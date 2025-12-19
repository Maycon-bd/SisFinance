import type { Bank } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/currency'

interface BankCardProps {
  bank: Bank
  onEdit: (bank: Bank) => void
  onDelete: (id: number) => void
}

export function BankCard({ bank, onEdit, onDelete }: BankCardProps) {
  const formattedBalance = formatCurrency(bank.current_balance)

  return (
    <Card className="bank-card">
      <div className="bank-card__header">
        <div
          className="bank-card__icon"
          style={{ background: bank.icon_color || '#6750A4' }}
        >
          🏦
        </div>
        <h3 className="bank-card__name">{bank.name}</h3>
      </div>

      <div className="bank-card__balance">
        <span className="bank-card__label">Saldo Atual</span>
        <span className="bank-card__amount">{formattedBalance}</span>
      </div>

      <div className="bank-card__actions">
        <Button variant="secondary" onClick={() => onEdit(bank)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(bank.id)}>
          Excluir
        </Button>
      </div>

      <style>{`
        .bank-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }
        .bank-card__header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bank-card__icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }
        .bank-card__name {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 500;
        }
        .bank-card__balance {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bank-card__label {
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
        }
        .bank-card__amount {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
        }
        .bank-card__actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .bank-card__actions button {
          flex: 1;
          padding: 8px;
          font-size: 0.875rem;
        }
      `}</style>
    </Card>
  )
}
