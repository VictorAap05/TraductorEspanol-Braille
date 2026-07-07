# Traductor Español → Braille

Proyecto que convierte texto en español a una representación visual de Braille.

Características
- Traducción de texto en español a celdas Braille interactivas.
- Teclado Braille interactivo para entrada táctil/visual.
- Exportación a PDF desde la interfaz (usa `jspdf`).

Estructura del proyecto
- `src/` — Código fuente principal.
	- `components/` — Componentes React (p. ej. BrailleCell, BrailleKeyboard).
	- `hooks/` — Hooks reutilizables (`useBrailleTranslator`, `usePdfExport`).
	- `services/` — Lógica de traducción y diccionario (`BrailleDictionary`, `BrailleTranslateService`).

Requisitos
- Node.js (recomendado >= 16)
- npm o yarn

Instalación
1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
# o
yarn install
```

Comandos útiles
- `npm run dev` — Inicia el servidor de desarrollo (Vite).
- `npm run build` — Compila la aplicación para producción (`tsc -b && vite build`).
- `npm run preview` — Previsualiza la build de producción.
- `npm run lint` — Ejecuta ESLint.
- `npm run docs` — Genera documentación con TypeDoc.

Uso
1. Ejecuta `npm run dev`.
2. Abre `http://localhost:5173` en tu navegador.
3. Escribe o pega texto en español; la aplicación mostrará las celdas Braille y permitirá exportar a PDF.

Notas de desarrollo
- El hook `useBrailleTranslator` contiene la lógica de mapeo entre caracteres y Braille.
- `BrailleTranslateService` y `BrailleDictionary` centralizan las reglas y excepciones.
- `usePdfExport` usa `jspdf` para generar y descargar el PDF desde el navegador.

---
