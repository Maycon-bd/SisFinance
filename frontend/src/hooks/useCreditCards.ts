import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { CreditCard } from '../types'

export function useCreditCards() {
    const queryClient = useQueryClient()

    const listQuery = useQuery({
        queryKey: ['creditCards'],
        queryFn: async () => {
            const res = await api.get('/credit-cards/')
            return res.data as CreditCard[]
        }
    })

    const addMutation = useMutation({
        mutationFn: async (newCard: Omit<CreditCard, 'id' | 'user_id' | 'created_at'>) => {
            const res = await api.post('/credit-cards/', newCard)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creditCards'] })
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<CreditCard> & { id: number }) => {
            const res = await api.put(`/credit-cards/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creditCards'] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/credit-cards/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['creditCards'] })
        }
    })

    return {
        creditCards: listQuery, // alias for backwards compatibility
        listQuery,
        addMutation,
        updateMutation,
        deleteMutation
    }
}
