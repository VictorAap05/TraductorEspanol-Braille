import React from 'react';
import type { BrailleMatrix } from '../../services/BrailleDictionary';
import './BrailleCell.css';

/**
 * Propiedades esperadas por el componente BrailleCell.
 */
interface BrailleCellProps {
  /** La tupla de 6 booleanos que define qué puntos están en relieve. */
  matriz: BrailleMatrix;
  /** El carácter original en texto (opcional, útil para accesibilidad y debugging). */
  caracterOriginal?: string;
}

/**
 * Componente visual que renderiza un cuadratín Braille individual.
 * Utiliza CSS Grid para organizar los 6 puntos en 2 columnas y 3 filas.
 * * @param props - Propiedades del componente (`matriz` y `caracterOriginal`).
 * @returns Elemento JSX que representa el rectángulo con los puntos.
 */
export const BrailleCell: React.FC<BrailleCellProps> = ({ matriz, caracterOriginal }) => {
  return (
    <div className="braille-cell-container" title={`Carácter: ${caracterOriginal || 'Prefijo'}`}>
      {/* El contenedor principal actúa como el rectángulo del cuadratín */}
      <div className="braille-grid">
        {matriz.map((isActive, index) => (
          <div
            key={index}
            className={`braille-dot ${isActive ? 'active' : 'inactive'}`}
          ></div>
        ))}
      </div>
      
      {/* Muestra el carácter debajo del cuadratín como ayuda visual */}
      <span className="braille-char">{caracterOriginal}</span>
    </div>
  );
};