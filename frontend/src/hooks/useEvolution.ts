import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

interface EvolutionItem {
    month: string
    income: number
    expense: number
}

export function useEvolution(months: number = 6) {
    return useQuery({
        queryKey: ['evolution', months],
        queryFn: async () => {
            const res = await api.get('/dashboard/evolution', { params: { months } })
            return res.data as EvolutionItem[]
        },
    })
}
