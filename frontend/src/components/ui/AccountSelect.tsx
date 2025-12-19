import { useBanks } from '../../hooks/useBanks'
import { useVaults } from '../../hooks/useVaults'

interface AccountSelectProps {
    value: { type: 'bank' | 'vault'; id: number } | null
    onChange: (value: { type: 'bank' | 'vault'; id: number } | null) => void
    label?: string
    required?: boolean
}

export function AccountSelect({ value, onChange, label = 'Conta', required = false }: AccountSelectProps) {
    const { listQuery: banksQuery } = useBanks()
    const { listQuery: vaultsQuery } = useVaults()

    const banks = banksQuery.data || []
    const vaults = vaultsQuery.data || []

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value
        if (!val) {
            onChange(null)
            return
        }
        const [type, idStr] = val.split(':')
        onChange({ type: type as 'bank' | 'vault', id: Number(idStr) })
    }

    const currentValue = value ? `${value.type}:${value.id}` : ''

    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <select
                className="m3-select"
                value={currentValue}
                onChange={handleChange}
                required={required}
            >
                <option value="">Selecione a conta</option>
                {banks.length > 0 && (
                    <optgroup label="🏦 Bancos">
                        {banks.map(b => (
                            <option key={`bank-${b.id}`} value={`bank:${b.id}`}>
                                {b.name} (R$ {Number(b.current_balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                            </option>
                        ))}
                    </optgroup>
                )}
                {vaults.length > 0 && (
                    <optgroup label="🔐 Cofres">
                        {vaults.map(v => (
                            <option key={`vault-${v.id}`} value={`vault:${v.id}`}>
                                {v.name} ({v.currency} {Number(v.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                            </option>
                        ))}
                    </optgroup>
                )}
            </select>
        </div>
    )
}
