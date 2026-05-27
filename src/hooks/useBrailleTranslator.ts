import { useState, useMemo } from 'react';
import { BrailleTranslatorService, type TraduccionBraille } from '../services/BrailleTranslateService';

/**
 * Hook personalizado que actúa como Capa de Adaptación entre la interfaz de usuario
 * y la lógica de negocio del traductor Braille.
 * Encapsula el estado del texto y calcula de forma reactiva la matriz resultante.
 * @returns Un objeto con el texto original, la función para actualizarlo y el arreglo de traducción.
 */
export const useBrailleTranslator = () => {
  // Estado reactivo que almacena lo que el usuario escribe en la interfaz
  const [textoOriginal, setTextoOriginal] = useState<string>('');

  // useMemo intercepta el cambio de texto y ejecuta la lógica de negocio pura.
  // Solo se recalcula cuando 'textoOriginal' cambia, optimizando el rendimiento.
  const traduccion = useMemo<TraduccionBraille[]>(() => {
    // Si el input está vacío, devolvemos un arreglo vacío
    if (!textoOriginal.trim() && textoOriginal.length === 0) {
      return [];
    }
    
    // Llamada reactiva hacia la capa de lógica de negocio (TypeScript puro)
    return BrailleTranslatorService.traducirTexto(textoOriginal);
  }, [textoOriginal]);

  return {
    textoOriginal,
    setTextoOriginal,
    traduccion,
  };
};