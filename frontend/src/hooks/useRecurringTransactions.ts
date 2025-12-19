import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import type { RecurringTransaction } from '../types'

export function useRecurringTransactions() {
    return useQuery({
        queryKey: ['recurring'],
        queryFn: async () => {
            const res = await api.get('/dashboard/recurring')
            return res.data as RecurringTransaction[]
        },
    })
}
