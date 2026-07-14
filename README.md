# Traductor Español ↔ Braille

Proyecto que convierte texto en español a una representación visual de Braille, y viceversa.

Características
- Traducción de texto en español a celdas Braille interactivas.
- Traducción inversa (Braille → Español) mediante un teclado Braille interactivo en pantalla.
- Exportación a PDF desde la interfaz (usa `jspdf`), incluyendo un modo espejado pensado para perforar la hoja desde el reverso y obtener el relieve correcto al voltearla.

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
4. Usa el botón de intercambio para cambiar a modo Braille → Español, e ingresa el contenido con el teclado Braille en pantalla.
5. Para imprimir en relieve, usa el botón "Exportar para relieve (espejado)" en vez de la exportación normal.

Notas de desarrollo
- El hook `useBrailleTranslator` contiene la lógica de mapeo entre caracteres y Braille, y gestiona la dirección de traducción activa (`espanol-braille` / `braille-espanol`).
- `BrailleTranslateService` y `BrailleDictionary` centralizan las reglas y excepciones.
- `usePdfExport` usa `jspdf` para generar y descargar el PDF desde el navegador; `exportarPdfEspejado` reutiliza la misma lógica invirtiendo el orden de las celdas y las columnas de puntos de cada una.

---
