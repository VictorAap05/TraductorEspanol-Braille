import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Los estilos globales están en src/styles.css (importado desde App.tsx)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
