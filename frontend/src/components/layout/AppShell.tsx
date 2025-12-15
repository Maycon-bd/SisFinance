import type { ReactNode } from 'react';
import { NavigationRail } from './NavigationRail';

/* ═══════════════════════════════════════════════════════════════════════════
   APP SHELL - Material Design 3
   Main layout wrapper with Navigation Rail and content area
═══════════════════════════════════════════════════════════════════════════ */

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="m3-app-shell">
            <NavigationRail />
            <main className="m3-app-shell__content">
                {children}
            </main>
        </div>
    );
}
