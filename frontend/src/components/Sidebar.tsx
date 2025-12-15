import { Link, useLocation } from 'react-router-dom'

const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transações', icon: '💳' },
    { path: '/reports', label: 'Relatórios', icon: '📈' },
    { path: '/budgets', label: 'Orçamentos', icon: '🎯' },
    { path: '/settings', label: 'Configurações', icon: '⚙️' },
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation()

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h1 className="sidebar-logo">💰 SysFinance</h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-logout"
                    onClick={() => {
                        localStorage.removeItem('token')
                        window.location.href = '/login'
                    }}
                >
                    🚪 Sair
                </button>
            </div>
        </aside>
    )
}
