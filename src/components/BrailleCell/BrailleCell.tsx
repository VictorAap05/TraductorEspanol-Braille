import React from 'react';
import type { BrailleMatrix } from '../../services/BrailleDictionary';

/**
 * Props del componente {@link BrailleCell}.
 */
interface BrailleCellProps {
  /** Tupla de 6 booleanos que define qué puntos del cuadratín están en relieve. */
  matriz: BrailleMatrix;
  /** Carácter original en tinta. Se muestra debajo del cuadratín como ayuda visual y para accesibilidad. */
  caracterOriginal?: string;
  /** Indica que el carácter no tiene representación en el diccionario Braille. Activa estilos de advertencia. */
  noSoportado?: boolean;
}

/**
 * Orden de lectura visual de los índices de la matriz para el renderizado en CSS Grid.
 *
 * El estándar Braille numera los puntos en columnas (izquierda 1-2-3, derecha 4-5-6),
 * pero `grid-auto-flow` por defecto llena filas. Este arreglo reordena los índices
 * para que la grilla muestre los puntos en la disposición física correcta:
 *
 * ```
 * Índice matriz → posición visual
 * [0]=pto1  [3]=pto4
 * [1]=pto2  [4]=pto5
 * [2]=pto3  [5]=pto6
 * ```
 */
const ORDEN_VISUAL = [0, 3, 1, 4, 2, 5];

/**
 * Componente visual que renderiza un cuadratín Braille individual.
 *
 * Utiliza CSS Grid (2 columnas × 3 filas) para organizar los 6 puntos del cuadratín.
 * Los puntos activos se muestran en negro y los inactivos en gris claro.
 * Si el carácter no tiene representación Braille, se aplican estilos de advertencia
 * y se informa al usuario mediante el atributo `title`.
 *
 * @param props - Propiedades del componente. Ver {@link BrailleCellProps}.
 * @returns Elemento JSX que representa el cuadratín con sus puntos y el carácter en tinta.
 */
export const BrailleCell: React.FC<BrailleCellProps> = ({ matriz, caracterOriginal, noSoportado }) => {
  return (
    <div
      className={`braille-cell-container${noSoportado ? ' braille-cell--unsupported' : ''}`}
      title={noSoportado ? `"${caracterOriginal}" no tiene representación Braille` : `Carácter: ${caracterOriginal || 'Prefijo'}`}
    >
      {/* Contenedor principal del cuadratín — organiza los 6 puntos en 2 columnas × 3 filas */}
      <div className="braille-grid">
        {ORDEN_VISUAL.map((matrizIndex, posicion) => (
          <div
            key={posicion}
            className={`braille-dot ${matriz[matrizIndex] ? 'active' : 'inactive'}`}
          />
        ))}
      </div>

      {/* Carácter en tinta debajo del cuadratín — ayuda visual y de accesibilidad */}
      <span className={`braille-char${noSoportado ? ' braille-char--unsupported' : ''}`}>
        {caracterOriginal}
      </span>
    </div>
  );
};
