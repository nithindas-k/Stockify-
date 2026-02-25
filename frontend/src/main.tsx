import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Sonner toasts — positioned top-center, matching the app theme */}
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'hsl(240 10% 6%)',
          border: '1px solid hsl(0 0% 11%)',
          color: 'hsl(0 0% 100%)',
          fontFamily: 'inherit',
        },
        classNames: {
          success: 'border-emerald-500/30 !text-emerald-400',
          error: 'border-red-500/30 !text-red-400',
          warning: 'border-amber-500/30 !text-amber-400',
          info: 'border-primary/30 !text-primary',
          closeButton: 'bg-background !border-border text-foreground hover:bg-card hover:text-primary transition-all shadow-md',
        },
      }}
      richColors
      expand={false}
      closeButton
    />
  </StrictMode>,
)
