import { BrailleCell } from './components/BrailleCell/BrailleCell'; // Ajusta la ruta si es necesario
import './App.css';

function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        Traductor Español - Braille
      </h1>
      
      {/* Contenedor flexible para alinear los cuadratines de prueba */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Prueba 1: Letra 'a' (Punto 1 activo) */}
        <BrailleCell 
          matriz={[true, false, false, false, false, false]} 
          caracterOriginal="a" 
        />

        {/* Prueba 2: Letra 'b' (Puntos 1 y 2 activos) */}
        <BrailleCell 
          matriz={[true, true, false, false, false, false]} 
          caracterOriginal="b" 
        />

        {/* Prueba 3: Prefijo de mayúscula (Puntos 4 y 6 activos) */}
        <BrailleCell 
          matriz={[false, false, false, true, false, true]} 
          caracterOriginal="MAYÚS" 
        />

      </div>
    </div>
  );
}

export default App;