import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export function useTransactions(month: number, year: number) {
  const qc = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['transactions', month, year],
    queryFn: async () => {
      const res = await api.get('/transactions', { params: { month, year } })
      return res.data as Array<{ id: number; amount: number; type: 'income'|'expense'; category_id?: number; date: string; description?: string }>
    },
  })

  const addMutation = useMutation({
    mutationFn: async (payload: { amount: number; type: 'income'|'expense'; category_id?: number|null; date: string; description?: string|null }) => {
      const res = await api.post('/transactions/', payload)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions', month, year] })
      qc.invalidateQueries({ queryKey: ['dashboard', month, year] })
    }
  })

  return { listQuery, addMutation }
}