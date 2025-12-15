import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function NavBar() {
  return (
    <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transações</Link>
      <Link to="/reports">Relatórios</Link>
      <Link to="/budgets">Orçamentos</Link>
      <Link to="/settings">Configurações</Link>
    </nav>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute> <><NavBar /><Dashboard /></></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute> <><NavBar /><Transactions /></></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute> <><NavBar /><Reports /></></PrivateRoute>} />
        <Route path="/budgets" element={<PrivateRoute> <><NavBar /><Budgets /></></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute> <><NavBar /><Settings /></></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}