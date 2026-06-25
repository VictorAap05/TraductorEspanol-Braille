/**
 * @file App.tsx
 * @description Componente raíz de la aplicación **Traductor Español ↔ Braille**.
 *
 * Actúa como capa de composición: conecta el hook de estado bidireccional
 * ({@link useBrailleTranslator}) y el hook de exportación ({@link usePdfExport})
 * con los componentes visuales ({@link BrailleCell}, {@link BrailleKeyboard}).
 *
 * ## Estructura de la interfaz
 *
 * ```
 * <app-wrapper>
 *   <h1>               ← Título de la aplicación
 *   <translator-card>  ← Tarjeta principal del traductor (estilo Google Translate)
 *     <translator-header>   ← Selector de idioma + botón de intercambio
 *     <translator-panels>   ← Panel izquierdo (entrada) | divisor | Panel derecho (salida)
 *   <export-section>   ← Botón "Exportar a PDF" (visible solo con contenido)
 *   <keyboard-section> ← Teclado Braille en pantalla (solo en modo Braille → Español)
 * ```
 *
 * ## Modos de traducción
 *
 * - **Español → Braille** (`modoEspanolBraille = true`):
 *   Panel izquierdo muestra un `<textarea>` editable.
 *   Panel derecho muestra las {@link BrailleCell} generadas reactivamente.
 *
 * - **Braille → Español** (`modoEspanolBraille = false`):
 *   Panel izquierdo muestra las celdas Braille acumuladas desde el teclado.
 *   Panel derecho muestra el texto en español resultante.
 *   El {@link BrailleKeyboard} se renderiza debajo de la tarjeta.
 *
 * @module App
 */

import { useBrailleTranslator } from './hooks/useBrailleTranslator';
import { usePdfExport } from './hooks/usePdfExport';
import { BrailleCell } from './components/BrailleCell/BrailleCell';
import { BrailleKeyboard } from './components/BrailleCell/BrailleKeyboard';
import './styles.css';

/**
 * Componente raíz de la aplicación.
 *
 * No recibe props; todo su estado proviene de los hooks internos.
 * Es el único punto donde se instancian {@link useBrailleTranslator} y {@link usePdfExport}.
 *
 * @returns El árbol JSX completo de la aplicación.
 */
function App() {
  const {
    direccion,
    cambiarDireccion,
    textoEspanol,
    setTextoEspanol,
    traduccionEspanolBraille,
    textoBraille,
    celdasBrailleEntrada,
    textoTraducidoEspanol,
    agregarLetra,
    agregarEspacio,
    eliminarUltimaCelda,
    limpiarBraille,
  } = useBrailleTranslator();

  const { exportarPdf, exportando } = usePdfExport();
  const modoEspanolBraille = direccion === 'espanol-braille';

  return (
    <div className="app-wrapper">
      <h1 className="app-title">Traductor Español ↔ Braille</h1>

      {/* ── Tarjeta del traductor ── */}
      <div className="translator-card">

        {/* Cabecera de idiomas */}
        <div className="translator-header">
          <div className={`lang-tab ${modoEspanolBraille ? 'lang-tab--active' : ''}`}>
            <span className="lang-tab-icon">🇪🇸</span>
            Español
          </div>

          <button className="swap-btn" onClick={cambiarDireccion}
            title="Intercambiar dirección" aria-label="Intercambiar dirección de traducción">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3L4 7l4 4"/><path d="M4 7h16"/>
              <path d="M16 21l4-4-4-4"/><path d="M20 17H4"/>
            </svg>
          </button>

          <div className={`lang-tab ${!modoEspanolBraille ? 'lang-tab--active' : ''}`}>
            <span className="lang-tab-icon">⠿</span>
            Braille
          </div>
        </div>

        {/* Paneles */}
        <div className="translator-panels">

          {/* Panel izquierdo: ENTRADA */}
          <div className="translator-panel translator-panel--input">
            <div className="panel-lang-label">
              {modoEspanolBraille ? '🇪🇸 Español' : '⠿ Braille'}
            </div>

            {modoEspanolBraille ? (
              <textarea
                className="panel-textarea"
                value={textoEspanol}
                onChange={(e) => setTextoEspanol(e.target.value)}
                placeholder="Escribe aquí el texto en español..."
                autoFocus
              />
            ) : (
              /* Panel izquierdo Braille-Español: muestra celdas Braille acumuladas */
              <div className="braille-output-container">
                {celdasBrailleEntrada.length === 0 ? (
                  <p className="braille-output-empty">
                    Las celdas Braille aparecerán aquí...
                  </p>
                ) : (
                  celdasBrailleEntrada.map((nodo, index) => (
                    <BrailleCell
                      key={index}
                      matriz={nodo.matriz}
                      caracterOriginal={nodo.esPrefijo ? 'PREF' : nodo.caracterOriginal}
                      noSoportado={nodo.noSoportado}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Divisor */}
          <div className="translator-divider" />

          {/* Panel derecho: SALIDA */}
          <div className="translator-panel translator-panel--output">
            <div className="panel-lang-label">
              {modoEspanolBraille ? '⠿ Braille' : '🇪🇸 Español'}
            </div>

            {modoEspanolBraille ? (
              <div className="braille-output-container">
                {traduccionEspanolBraille.length === 0 ? (
                  <p className="braille-output-empty">
                    La traducción en Braille aparecerá aquí...
                  </p>
                ) : (
                  traduccionEspanolBraille.map((nodo, index) => (
                    <BrailleCell
                      key={index}
                      matriz={nodo.matriz}
                      caracterOriginal={nodo.esPrefijo ? 'PREF' : nodo.caracterOriginal}
                      noSoportado={nodo.noSoportado}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="espanol-output-container">
                {textoTraducidoEspanol ? (
                  <p className="espanol-output-text">{textoTraducidoEspanol}</p>
                ) : (
                  <p className="braille-output-empty">
                    El texto en español aparecerá aquí...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exportar PDF — solo Español-Braille */}
      {modoEspanolBraille && traduccionEspanolBraille.length > 0 && (
        <div className="export-section">
          <button className="export-btn"
            onClick={() => exportarPdf(textoEspanol, traduccionEspanolBraille)}
            disabled={exportando}>
            {exportando ? 'Generando PDF...' : 'Exportar traducción a PDF'}
          </button>
        </div>
      )}

      {/* ── Teclado Braille — Braille-Español ── */}
      {!modoEspanolBraille && (
        <div className="keyboard-section">
          <BrailleKeyboard
            onAgregarLetra={agregarLetra}
            onAgregarEspacio={agregarEspacio}
            onEliminarUltima={eliminarUltimaCelda}
            onLimpiar={limpiarBraille}
            textoBraille={textoBraille}
          />
        </div>
      )}

      {/* ── Botón exportar — Braille-Español ── */}
      {!modoEspanolBraille && celdasBrailleEntrada.length > 0 && (
        <div className="export-section">
          <button className="export-btn"
            onClick={() => exportarPdf(textoTraducidoEspanol, celdasBrailleEntrada)}
            disabled={exportando}>
            {exportando ? 'Generando PDF...' : 'Exportar traducción a PDF'}
          </button>
        </div>
      )}

      
    </div>
  );
}

export default App;
