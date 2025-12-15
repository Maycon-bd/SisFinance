import { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'
import { useDashboard } from '../hooks/useDashboard'

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth()+1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(()=>{ const token = localStorage.getItem('token'); setAuthToken(token||undefined) }, [])
  const { data, error, isLoading } = useDashboard(month, year)

  return (
    <div style={{padding:20}}>
      <h2>Visão Geral Mensal</h2>
      <div style={{display:'flex', gap:8, margin:'10px 0'}}>
        <input type="number" value={month} min={1} max={12} onChange={e=>setMonth(Number(e.target.value))} />
        <input type="number" value={year} min={1970} max={2100} onChange={e=>setYear(Number(e.target.value))} />
      </div>
      {isLoading && <div>Carregando...</div>}
      {error && <div style={{color:'red'}}>{(error as any)?.message || 'Erro ao carregar resumo'}</div>}
      {data && (
        <div style={{display:'grid', gap:8}}>
          <div>Receitas: <b>R$ {data.total_income.toFixed(2)}</b></div>
          <div>Despesas: <b>R$ {data.total_expense.toFixed(2)}</b></div>
          <div>Saldo: <b>R$ {data.net.toFixed(2)}</b></div>
          <div>
            <h3>Por categoria</h3>
            <ul>
              {Object.entries(data.by_category).map(([name, val])=> (
                <li key={name}>{name}: R$ {val.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}