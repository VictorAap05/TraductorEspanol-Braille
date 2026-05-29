import React from 'react';
import type { BrailleMatrix } from '../../services/BrailleDictionary';

interface BrailleCellProps {
  matriz: BrailleMatrix;
  caracterOriginal?: string;
  noSoportado?: boolean;
}

export const BrailleCell: React.FC<BrailleCellProps> = ({ matriz, caracterOriginal, noSoportado }) => {
  return (
    <div
      className={`braille-cell-container${noSoportado ? ' braille-cell--unsupported' : ''}`}
      title={noSoportado ? `"${caracterOriginal}" no tiene representación Braille` : `Carácter: ${caracterOriginal || 'Prefijo'}`}
    >
      <div className="braille-grid">
        {matriz.map((isActive, index) => (
          <div
            key={index}
            className={`braille-dot ${isActive ? 'active' : 'inactive'}`}
          />
        ))}
      </div>
      <span className={`braille-char${noSoportado ? ' braille-char--unsupported' : ''}`}>
        {caracterOriginal}
      </span>
    </div>
  );
};
