import { useBrailleTranslator } from './hooks/useBrailleTranslator';
import { BrailleCell } from './components/BrailleCell/BrailleCell';
import './App.css';

function App() {
  // Extraemos el estado y la traducción directamente de nuestro Custom Hook
  const { textoOriginal, setTextoOriginal, traduccion } = useBrailleTranslator();

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Traductor Español - Braille
      </h1>

      {/* Capa de Componentes: Captura de entrada de texto */}
      <div style={{ marginBottom: '30px' }}>
        <label htmlFor="text-input" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Ingrese el texto a señalizar:
        </label>
        <textarea
          id="text-input"
          value={textoOriginal}
          onChange={(e) => setTextoOriginal(e.target.value)}
          placeholder="Escribe aquí números, mayúsculas o vocales acentuadas..."
          style={{
            width: '100%',
            height: '100px',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            resize: 'vertical'
          }}
        />
      </div>
      
      {/* Contenedor de renderizado iterativo */}
      <div 
        className="braille-output-container"
        style={{
          display: 'flex', 
          gap: '16px', 
          flexWrap: 'wrap', 
          padding: '24px', 
          backgroundColor: '#f4f4f9', 
          borderRadius: '8px',
          minHeight: '150px',
          border: '2px dashed #ccc',
          alignItems: 'flex-start'
        }}
      >
        {/* Mensaje de estado vacío */}
        {traduccion.length === 0 && (
          <p style={{ color: '#888', margin: 'auto', fontStyle: 'italic' }}>
            La vista previa de la señalética aparecerá aquí...
          </p>
        )}
        
        {/* Iteración gráfica de los cuadratines traducidos */}
        {traduccion.map((nodo, index) => (
          <BrailleCell 
            key={index} 
            matriz={nodo.matriz} 
            caracterOriginal={nodo.esPrefijo ? 'PREF' : nodo.caracterOriginal} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;