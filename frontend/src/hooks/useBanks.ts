import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

import type { Bank } from '../types'

export function useBanks() {
    const qc = useQueryClient()

    const listQuery = useQuery({
        queryKey: ['banks'],
        queryFn: async () => {
            const res = await api.get('/banks/')
            return res.data as Bank[]
        },
    })

    const addMutation = useMutation({
        mutationFn: async (payload: { name: string; initial_balance: number; icon_color?: string }) => {
            const res = await api.post('/banks/', payload)
            return res.data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['banks'] })
            qc.invalidateQueries({ queryKey: ['dashboard'] }) // Update dashboard totals
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...payload }: { id: number; name?: string; icon_color?: string }) => {
            const res = await api.put(`/banks/${id}`, payload)
            return res.data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['banks'] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/banks/${id}`)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['banks'] })
            qc.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    return { listQuery, addMutation, updateMutation, deleteMutation }
}
