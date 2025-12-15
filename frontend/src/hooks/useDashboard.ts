import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useDashboard(month: number, year: number) {
  return useQuery({
    queryKey: ['dashboard', month, year],
    queryFn: async () => {
      const res = await api.get('/dashboard/summary', { params: { month, year } })
      return res.data as {
        month: number
        year: number
        total_income: number
        total_expense: number
        net: number
        by_category: Record<string, number>
      }
    },
  })
}