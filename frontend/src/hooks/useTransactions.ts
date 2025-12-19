import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'
import type { Transaction } from '../types'

interface TransactionPayload {
  amount: number
  type: 'income' | 'expense'
  category_id?: number | null
  bank_id?: number | null
  vault_id?: number | null
  credit_card_id?: number | null
  installments?: number | null
  date: string
  description?: string | null
}

export function useTransactions(month: number, year: number) {
  const qc = useQueryClient()

  const listQuery = useQuery({
    queryKey: ['transactions', month, year],
    queryFn: async () => {
      const res = await api.get('/transactions', { params: { month, year } })
      return res.data as Transaction[]
    },
  })

  const addMutation = useMutation({
    mutationFn: async (payload: TransactionPayload) => {
      const res = await api.post('/transactions/', payload)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions', month, year] })
      qc.invalidateQueries({ queryKey: ['dashboard', month, year] })
      qc.invalidateQueries({ queryKey: ['banks'] })
      qc.invalidateQueries({ queryKey: ['vaults'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions', month, year] })
      qc.invalidateQueries({ queryKey: ['dashboard', month, year] })
      qc.invalidateQueries({ queryKey: ['banks'] })
      qc.invalidateQueries({ queryKey: ['vaults'] })
    }
  })

  return { listQuery, addMutation, deleteMutation }
}