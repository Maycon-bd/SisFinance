import { NavLink, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION RAIL - Material Design 3
   Fixed left sidebar with icon + label navigation
═══════════════════════════════════════════════════════════════════════════ */

interface NavItem {
    path: string;
    label: string;
    icon: ReactNode;
}

const navItems: NavItem[] = [
    {
        path: '/',
        label: 'Dashboard',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
        ),
    },
    {
        path: '/accounts',
        label: 'Contas',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
        ),
    },
    {
        path: '/transactions',
        label: 'Transações',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
            </svg>
        ),
    },
    {
        path: '/reports',
        label: 'Relatórios',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
        ),
    },
    {
        path: '/budgets',
        label: 'Orçamentos',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
            </svg>
        ),
    },
    {
        path: '/settings',
        label: 'Configurações',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
    },
];

export function NavigationRail() {
    const navigate = useNavigate();

    return (
        <nav className="m3-navigation-rail">
            {/* Logo / Menu Button Area - Clicável para Dashboard */}
            <div className="m3-navigation-rail__header">
                <div
                    className="m3-navigation-rail__logo"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                    title="Ir para Dashboard"
                >
                    <img src="/logo.png" alt="SysFinance" className="m3-navigation-rail__logo-img" style={{ width: 32, height: 32 }} />
                    <span className="m3-navigation-rail__logo-text">SysFinance</span>
                </div>
            </div>

            {/* FAB for quick action */}
            <button
                className="m3-navigation-rail__fab"
                onClick={() => navigate('/transactions')}
                title="Nova Transação"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
            </button>

            {/* Navigation Items */}
            <div className="m3-navigation-rail__items">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `m3-navigation-rail__item ${isActive ? 'm3-navigation-rail__item--active' : ''}`
                        }
                    >
                        <div className="m3-navigation-rail__indicator">
                            <span className="m3-navigation-rail__icon">{item.icon}</span>
                        </div>
                        <span className="m3-navigation-rail__label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
