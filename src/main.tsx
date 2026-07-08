/**
 * @file main.tsx
 * @description Punto de entrada de la aplicación **Traductor Español ↔ Braille**.
 *
 * Monta el componente raíz {@link App} en el nodo DOM con id `root`
 * (definido en `index.html`), envuelto en `<StrictMode>` para detectar
 * en desarrollo efectos secundarios y APIs obsoletas de React.
 *
 * Los estilos globales de la aplicación se importan desde `src/styles.css`
 * (vía `App.tsx`), por lo que este archivo no necesita importarlos directamente.
 *
 * @module main
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Los estilos globales están en src/styles.css (importado desde App.tsx)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
