import { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'
import { useTransactions } from '../hooks/useTransactions'

export default function Transactions() {
  const [month, setMonth] = useState(new Date().getMonth()+1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [form, setForm] = useState<{ amount?: number|string; type: 'income'|'expense'; category_id?: number|null; date: string; description?: string|null }>({ type: 'expense', date: new Date().toISOString().slice(0,10) })

  useEffect(()=>{ const token = localStorage.getItem('token'); setAuthToken(token||undefined) }, [])
  const { listQuery, addMutation } = useTransactions(month, year)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    addMutation.mutate({
      amount: Number(form.amount),
      type: form.type,
      category_id: form.category_id || null,
      date: form.date,
      description: form.description || null,
    })
  }

  const items = listQuery.data || []

  return (
    <div style={{padding:20}}>
      <h2>Transações</h2>
      <div style={{display:'flex', gap:8, margin:'10px 0'}}>
        <input type="number" value={month} min={1} max={12} onChange={e=>setMonth(Number(e.target.value))} />
        <input type="number" value={year} min={1970} max={2100} onChange={e=>setYear(Number(e.target.value))} />
      </div>

      <form onSubmit={add} style={{display:'grid', gap:8, maxWidth:600}}>
        <input type="number" step="0.01" placeholder="Valor" value={form.amount || ''} onChange={e=>setForm(f=>({ ...f, amount: e.target.value }))} required />
        <select value={form.type} onChange={e=>setForm(f=>({ ...f, type: e.target.value as any }))}>
          <option value="income">Receita</option>
          <option value="expense">Despesa</option>
        </select>
        <input type="date" value={form.date as string} onChange={e=>setForm(f=>({ ...f, date: e.target.value }))} />
        <input placeholder="ID da categoria (opcional)" value={form.category_id || ''} onChange={e=>setForm(f=>({ ...f, category_id: Number(e.target.value) }))} />
        <input placeholder="Descrição" value={form.description || ''} onChange={e=>setForm(f=>({ ...f, description: e.target.value }))} />
        <button type="submit" disabled={addMutation.isPending}>Adicionar</button>
      </form>

      {listQuery.isLoading && <div>Carregando...</div>}
      {(listQuery.error || addMutation.error) && <div style={{color:'red'}}>{(listQuery.error as any)?.message || (addMutation.error as any)?.message || 'Erro'}</div>}

      <ul style={{marginTop:20}}>
        {items.map(t => (
          <li key={t.id}>{t.date} | {t.type} | R$ {t.amount.toFixed(2)} | Cat: {t.category_id || '-'} | {t.description || ''}</li>
        ))}
      </ul>
    </div>
  )
}