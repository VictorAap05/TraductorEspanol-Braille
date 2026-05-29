import { useBrailleTranslator } from './hooks/useBrailleTranslator';
import { usePdfExport } from './hooks/usePdfExport';
import { BrailleCell } from './components/BrailleCell/BrailleCell';
import { ParticleBackground } from './components/ParticleBackground/ParticleBackground';
import './styles.css';

/**
 * Componente raíz de la aplicación.
 * Orquesta los hooks de la Capa de Adaptación y delega el renderizado
 * a los componentes especializados.
 */
function App() {
  const { textoOriginal, setTextoOriginal, traduccion } = useBrailleTranslator();
  const { exportarPdf, exportando } = usePdfExport();

  return (
    <>
      {/* Fondo animado — fixed, detrás de todo */}
      <ParticleBackground />

      {/* Contenido principal — encima del canvas */}
      <div className="app-wrapper">
        <h1 className="app-title">
          Traductor Español - Braille
        </h1>

        {/* Captura de entrada de texto */}
        <div className="input-section">
          <label htmlFor="text-input" className="input-label">
            Ingrese el texto a señalizar:
          </label>
          <textarea
            id="text-input"
            className="input-textarea"
            value={textoOriginal}
            onChange={(e) => setTextoOriginal(e.target.value)}
            placeholder="Escribe aquí números, mayúsculas o vocales acentuadas..."
          />
        </div>

        {/* Contenedor de renderizado iterativo */}
        <div className="braille-output-container">
          {traduccion.length === 0 && (
            <p className="braille-output-empty">
              La vista previa de la señalética aparecerá aquí...
            </p>
          )}
          {traduccion.map((nodo, index) => (
            <BrailleCell
              key={index}
              matriz={nodo.matriz}
              caracterOriginal={nodo.esPrefijo ? 'PREF' : nodo.caracterOriginal}
            />
          ))}
        </div>

        {/* Botón de exportación — solo visible cuando hay contenido */}
        {traduccion.length > 0 && (
          <div className="export-section">
            <button
              className="export-btn"
              onClick={() => exportarPdf(textoOriginal, traduccion)}
              disabled={exportando}
            >
              {exportando ? 'Generando PDF...' : 'Exportar traducción a PDF'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
