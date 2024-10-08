import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LocalStorageProvider } from './lib/localStorageProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocalStorageProvider>
    <App />
    </LocalStorageProvider>
  </StrictMode>,
)
