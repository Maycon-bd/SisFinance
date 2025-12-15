import { type ReactNode, useState } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="app-layout">
            <button
                className="menu-toggle"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir menu"
            >
                ☰
            </button>

            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}
