import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TopicsProvider } from '@/context/TopicsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <TopicsProvider>
        <App />
        <Toaster position="bottom-right" />
      </TopicsProvider>
    </ThemeProvider>
  </StrictMode>,
)
