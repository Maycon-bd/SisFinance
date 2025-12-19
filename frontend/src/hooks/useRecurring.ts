import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { RecurringTransaction } from '../types'

export function useRecurring() {
    const queryClient = useQueryClient()

    const listQuery = useQuery({
        queryKey: ['recurring'],
        queryFn: async () => {
            const res = await api.get('/recurring/')
            return res.data as RecurringTransaction[]
        }
    })

    const addMutation = useMutation({
        mutationFn: async (newRecurring: Omit<RecurringTransaction, 'id' | 'user_id'>) => {
            const res = await api.post('/recurring/', newRecurring)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<RecurringTransaction> & { id: number }) => {
            const res = await api.put(`/recurring/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/recurring/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        }
    })

    return {
        recurring: listQuery, // alias for consistency with Accounts.tsx
        listQuery,
        addMutation,
        updateMutation,
        deleteMutation
    }
}
