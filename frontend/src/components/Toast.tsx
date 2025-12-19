import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info'
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.type}`}
                        onClick={() => removeToast(toast.id)}
                    >
                        <span className="toast__icon">
                            {toast.type === 'success' && '✓'}
                            {toast.type === 'error' && '✕'}
                            {toast.type === 'info' && 'ℹ'}
                        </span>
                        <span className="toast__message">{toast.message}</span>
                    </div>
                ))}
            </div>

            <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          pointer-events: none;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          cursor: pointer;
          pointer-events: auto;
          animation: slideIn 0.3s ease-out;
          min-width: 280px;
          max-width: 400px;
        }
        .toast--success {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }
        .toast--error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        .toast--info {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
        .toast__icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          font-size: 14px;
        }
        .toast__message {
          flex: 1;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </ToastContext.Provider>
    )
}
