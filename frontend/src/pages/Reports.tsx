import { useEffect, useState } from 'react'
import { api, setAuthToken } from '../services/api'

export default function Reports() {
  const [month, setMonth] = useState(new Date().getMonth()+1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(()=>{ const token = localStorage.getItem('token'); setAuthToken(token||undefined) }, [])

  const base = (api.defaults.baseURL || '')
  const qs = `?month=${month}&year=${year}`

  return (
    <div style={{padding:20}}>
      <h2>Relatórios</h2>
      <div style={{display:'flex', gap:8, margin:'10px 0'}}>
        <input type="number" value={month} min={1} max={12} onChange={e=>setMonth(Number(e.target.value))} />
        <input type="number" value={year} min={1970} max={2100} onChange={e=>setYear(Number(e.target.value))} />
      </div>
      <div style={{display:'flex', gap:12}}>
        <a href={`${base}/reports/export/csv${qs}`} target="_blank" rel="noreferrer">Exportar CSV</a>
        <a href={`${base}/reports/export/pdf${qs}`} target="_blank" rel="noreferrer">Exportar PDF</a>
      </div>
    </div>
  )
}