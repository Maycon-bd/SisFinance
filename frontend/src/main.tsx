import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppRouter from './AppRouter.tsx'
import { queryClient } from './queryClient'
import { ToastProvider } from './components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
