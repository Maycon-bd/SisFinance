import type { Vault, Bank } from '../../types'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/currency'

interface VaultCardProps {
  vault: Vault
  linkedBank?: Bank
  onEdit: (vault: Vault) => void
  onDelete: (id: number) => void
}

export function VaultCard({ vault, linkedBank, onEdit, onDelete }: VaultCardProps) {
  // Format currency - handle different currencies
  const formattedBalance = vault.currency === 'BRL'
    ? formatCurrency(vault.balance)
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: vault.currency }).format(vault.balance)

  return (
    <Card className="vault-card">
      <div className="vault-card__header">
        <div className="vault-card__icon">📦</div>
        <div className="vault-card__title-group">
          <h3 className="vault-card__name">{vault.name}</h3>
          {linkedBank && (
            <span className="vault-card__badge" style={{ borderColor: linkedBank.icon_color || '#6750A4' }}>
              🏦 {linkedBank.name}
            </span>
          )}
        </div>
      </div>

      <div className="vault-card__balance">
        <span className="vault-card__label">Saldo</span>
        <span className="vault-card__amount">{formattedBalance}</span>
      </div>

      <div className="vault-card__actions">
        <Button variant="secondary" onClick={() => onEdit(vault)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(vault.id)}>
          Excluir
        </Button>
      </div>

      <style>{`
        .vault-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }
        .vault-card__header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .vault-card__icon {
          width: 40px;
          height: 40px;
          background: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .vault-card__title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .vault-card__name {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 500;
        }
        .vault-card__badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          border: 1px solid;
          border-radius: 100px;
          color: var(--md-sys-color-on-surface-variant);
          max-width: fit-content;
        }
        .vault-card__balance {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .vault-card__label {
          font-size: 0.875rem;
          color: var(--md-sys-color-on-surface-variant);
        }
        .vault-card__amount {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--md-sys-color-on-surface);
        }
        .vault-card__actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          flex-wrap: wrap;
        }
        .vault-card__actions button {
          flex: 1;
          padding: 8px;
          font-size: 0.875rem;
          white-space: nowrap;
        }
      `}</style>
    </Card>
  )
}
