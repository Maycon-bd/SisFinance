import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

import type { Vault } from '../types'

export function useVaults() {
    const qc = useQueryClient()

    const listQuery = useQuery({
        queryKey: ['vaults'],
        queryFn: async () => {
            const res = await api.get('/vaults/')
            return res.data as Vault[]
        },
    })

    const addMutation = useMutation({
        mutationFn: async (payload: { name: string; currency: string; initial_balance: number; bank_id: number }) => {
            const res = await api.post('/vaults/', payload)
            return res.data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['vaults'] })
            qc.invalidateQueries({ queryKey: ['banks'] }) // Bank balance = sum of vaults
            qc.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...payload }: { id: number; name?: string; balance?: number }) => {
            const res = await api.put(`/vaults/${id}`, payload)
            return res.data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['vaults'] })
            qc.invalidateQueries({ queryKey: ['banks'] }) // Bank balance might change
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/vaults/${id}`)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['vaults'] })
            qc.invalidateQueries({ queryKey: ['banks'] }) // Bank balance = sum of vaults
            qc.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    // Transfer removed - vaults are now inside banks like "caixinhas"
    // Bank balance = sum of all vault balances

    return { listQuery, addMutation, updateMutation, deleteMutation }
}
