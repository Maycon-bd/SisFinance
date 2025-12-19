import { useState, useEffect } from 'react'
import { useBanks } from '../hooks/useBanks'
import { useVaults } from '../hooks/useVaults'
import { BankCard } from '../components/ui/BankCard'
import { VaultCard } from '../components/ui/VaultCard'
import { AddAccountModal } from '../components/AddAccountModal'
import { Button } from '../components/ui/Button'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrency } from '../utils/currency'
import { setAuthToken } from '../services/api'
import { useToast } from '../components/Toast'
import { useCreditCards } from '../hooks/useCreditCards'
import { useRecurring } from '../hooks/useRecurring'
import { CreditCardCard } from '../components/ui/CreditCardCard'
import { RecurringExpenseCard } from '../components/ui/RecurringExpenseCard'
import { AddCreditCardModal } from '../components/AddCreditCardModal'
import { AddRecurringModal } from '../components/AddRecurringModal'
import type { CreditCard, RecurringTransaction } from '../types'

export default function Accounts() {
    const { listQuery: banksQuery, addMutation: addBank, updateMutation: updateBank, deleteMutation: deleteBank } = useBanks()
    const { listQuery: vaultsQuery, addMutation: addVault, updateMutation: updateVault, deleteMutation: deleteVault } = useVaults()
    const { creditCards: cardsQuery, addMutation: addCard, updateMutation: updateCard, deleteMutation: deleteCard } = useCreditCards()
    const { recurring: recurringQuery, addMutation: addRecurring, updateMutation: updateRecurring, deleteMutation: deleteRecurring } = useRecurring()
    const { showToast } = useToast()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setAuthToken(token)
        }
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false)
    // Modal Types: bank, vault, credit_card, recurring
    const [modalType, setModalType] = useState<'bank' | 'vault' | 'credit_card' | 'recurring'>('bank')
    const [editData, setEditData] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Specific modals state
    const [isCardModalOpen, setIsCardModalOpen] = useState(false)
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false)
    const [editCardData, setEditCardData] = useState<CreditCard | null>(null)
    const [editRecurringData, setEditRecurringData] = useState<RecurringTransaction | null>(null)

    const banks = banksQuery.data || []
    const vaults = vaultsQuery.data || []
    const creditCards = cardsQuery.data || []
    const recurring = recurringQuery.data || []

    // Bank balance now comes from backend (sum of vaults)
    // Patrimônio = Total em Bancos (que já inclui os cofres)
    const totalInBanks = banks.reduce((acc, b) => acc + Number(b.current_balance), 0)

    const handleEditBank = (bank: any) => {
        setModalType('bank')
        setEditData(bank)
        setIsModalOpen(true)
    }

    const handleEditVault = (vault: any) => {
        setModalType('vault')
        setEditData(vault)
        setIsModalOpen(true)
    }

    const handleCreate = (type: 'bank' | 'vault') => {
        setModalType(type)
        setEditData(null)
        setIsModalOpen(true)
    }

    const handleSave = async (data: any) => {
        if (isSaving) return // Prevent duplicate submissions

        setIsSaving(true)
        try {
            if (modalType === 'bank') {
                if (data.id) {
                    await updateBank.mutateAsync(data)
                    showToast('Banco atualizado com sucesso!', 'success')
                } else {
                    await addBank.mutateAsync(data)
                    showToast('Banco criado com sucesso!', 'success')
                }
            } else {
                if (data.id) {
                    await updateVault.mutateAsync(data)
                    showToast('Cofre atualizado com sucesso!', 'success')
                } else {
                    await addVault.mutateAsync(data)
                    showToast('Cofre criado com sucesso!', 'success')
                }
            }
            // Refetch banks to update balances
            banksQuery.refetch()
            setIsModalOpen(false)
        } catch (err: any) {
            showToast(err?.response?.data?.detail || 'Erro ao salvar', 'error')
            throw err
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteVault = async (id: number) => {
        try {
            await deleteVault.mutateAsync(id)
            showToast('Cofre excluído com sucesso!', 'success')
            // Refetch banks to update balances
            banksQuery.refetch()
        } catch (err: any) {
            showToast(err?.response?.data?.detail || 'Erro ao excluir', 'error')
        }
    }

    const handleDeleteBank = async (id: number) => {
        try {
            await deleteBank.mutateAsync(id)
            showToast('Banco excluído com sucesso!', 'success')
        } catch (err: any) {
            showToast(err?.response?.data?.detail || 'Erro ao excluir', 'error')
        }
    }

    // --- Credit Card Handlers ---
    const handleEditCard = (card: CreditCard) => {
        setEditCardData(card)
        setIsCardModalOpen(true)
    }

    const handleDeleteCard = async (id: number) => {
        if (!window.confirm('Tem certeza?')) return
        try {
            await deleteCard.mutateAsync(id)
            showToast('Cartão excluído com sucesso!', 'success')
        } catch (err: any) {
            showToast(err?.response?.data?.detail || 'Erro ao excluir', 'error')
        }
    }

    const handleSaveCard = async (data: any) => {
        if (editCardData) {
            await updateCard.mutateAsync({ id: editCardData.id, ...data })
            showToast('Cartão atualizado com sucesso!', 'success')
        } else {
            await addCard.mutateAsync(data)
            showToast('Cartão criado com sucesso!', 'success')
        }
        setIsCardModalOpen(false)
    }

    // --- Recurring Handlers ---
    const handleEditRecurring = (rec: RecurringTransaction) => {
        setEditRecurringData(rec)
        setIsRecurringModalOpen(true)
    }

    const handleDeleteRecurring = async (id: number) => {
        if (!window.confirm('Tem certeza?')) return
        try {
            await deleteRecurring.mutateAsync(id)
            showToast('Despesa fixa excluída com sucesso!', 'success')
        } catch (err: any) {
            showToast(err?.response?.data?.detail || 'Erro ao excluir', 'error')
        }
    }

    const handleSaveRecurring = async (data: any) => {
        if (editRecurringData) {
            await updateRecurring.mutateAsync({ id: editRecurringData.id, ...data })
            showToast('Despesa fixa atualizada com sucesso!', 'success')
        } else {
            await addRecurring.mutateAsync(data)
            showToast('Despesa fixa criada com sucesso!', 'success')
        }
        setIsRecurringModalOpen(false)
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-header__title-section">
                    <h1 className="page-header__title">Minhas Contas</h1>
                    <p className="page-header__subtitle">Gerencie seus bancos e cofres (caixinhas)</p>
                </div>
            </header>

            {/* Overview - Saldo total dos bancos (soma dos cofres) */}
            <div className="grid-2">
                <MetricCard
                    title="Total em Bancos"
                    value={formatCurrency(totalInBanks)}
                    accent="neutral"
                    icon="🏦"
                />
                <MetricCard
                    title="Patrimônio Total"
                    value={formatCurrency(totalInBanks)}
                    accent="green"
                    icon="💰"
                />
            </div>

            {/* Banks Section */}
            <section>
                <div className="section-header">
                    <h2 className="section-title">Bancos</h2>
                    <Button onClick={() => handleCreate('bank')}>+ Novo Banco</Button>
                </div>

                {banksQuery.isLoading ? (
                    <div className="loading">Carregando bancos...</div>
                ) : banks.length > 0 ? (
                    <div className="grid-3">
                        {banks.map(bank => (
                            <BankCard
                                key={bank.id}
                                bank={bank}
                                onEdit={handleEditBank}
                                onDelete={handleDeleteBank}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">🏦</div>
                        <div className="empty-state__text">Nenhum banco cadastrado</div>
                        <p className="empty-state__hint">Crie um banco para começar a adicionar cofres (caixinhas)</p>
                    </div>
                )}
            </section>

            {/* Vaults Section */}
            <section>
                <div className="section-header">
                    <h2 className="section-title">Cofres (Caixinhas)</h2>
                    <Button onClick={() => handleCreate('vault')} disabled={banks.length === 0}>+ Novo Cofre</Button>
                </div>

                {banks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📦</div>
                        <div className="empty-state__text">Crie um banco primeiro</div>
                        <p className="empty-state__hint">Cofres precisam estar vinculados a um banco</p>
                    </div>
                ) : vaultsQuery.isLoading ? (
                    <div className="loading">Carregando cofres...</div>
                ) : vaults.length > 0 ? (
                    <div className="grid-3">
                        {vaults.map(vault => (
                            <VaultCard
                                key={vault.id}
                                vault={vault}
                                linkedBank={banks.find(b => b.id === vault.bank_id)}
                                onEdit={handleEditVault}
                                onDelete={handleDeleteVault}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📦</div>
                        <div className="empty-state__text">Nenhum cofre cadastrado</div>
                        <p className="empty-state__hint">Cofres funcionam como caixinhas dentro do banco</p>
                    </div>
                )}
            </section>

            {/* Credit Cards Section */}
            <section>
                <div className="section-header">
                    <h2 className="section-title">Cartões de Crédito</h2>
                    <Button onClick={() => { setEditCardData(null); setIsCardModalOpen(true); }}>+ Novo Cartão</Button>
                </div>

                {cardsQuery.isLoading ? (
                    <div className="loading">Carregando cartões...</div>
                ) : creditCards.length > 0 ? (
                    <div className="grid-3">
                        {creditCards.map(card => (
                            <CreditCardCard
                                key={card.id}
                                card={card}
                                onEdit={handleEditCard}
                                onDelete={handleDeleteCard}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">💳</div>
                        <div className="empty-state__text">Nenhum cartão cadastrado</div>
                    </div>
                )}
            </section>

            {/* Recurring Transactions Section */}
            <section>
                <div className="section-header">
                    <h2 className="section-title">Despesas Fixas</h2>
                    <Button onClick={() => { setEditRecurringData(null); setIsRecurringModalOpen(true); }}>+ Nova Despesa</Button>
                </div>

                {recurringQuery.isLoading ? (
                    <div className="loading">Carregando despesas fixas...</div>
                ) : recurring.length > 0 ? (
                    <div className="space-y-2">
                        {recurring.map(rec => (
                            <RecurringExpenseCard
                                key={rec.id}
                                recurring={rec}
                                onEdit={handleEditRecurring}
                                onDelete={handleDeleteRecurring}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state__icon">📅</div>
                        <div className="empty-state__text">Nenhuma despesa fixa cadastrada</div>
                    </div>
                )}
            </section>

            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType as 'bank' | 'vault'}
                editData={editData}
                banks={banks}
                onSave={handleSave}
            />

            <AddCreditCardModal
                isOpen={isCardModalOpen}
                onClose={() => setIsCardModalOpen(false)}
                onSave={handleSaveCard}
                initialData={editCardData}
            />

            <AddRecurringModal
                isOpen={isRecurringModalOpen}
                onClose={() => setIsRecurringModalOpen(false)}
                onSave={handleSaveRecurring}
                initialData={editRecurringData}
            />

            <style>{`
            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-4);
                margin-top: var(--spacing-6);
            }
            .section-title {
                font-size: var(--md-sys-typescale-title-large-font-size);
                color: var(--md-sys-color-on-surface);
            }
            .empty-state__hint {
                font-size: 0.875rem;
                color: var(--md-sys-color-on-surface-variant);
                margin-top: 8px;
            }
        `}</style>
        </div>
    )
}
