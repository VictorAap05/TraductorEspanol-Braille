import { useState, useMemo } from 'react';
import { BrailleTranslatorService, type TraduccionBraille } from '../services/BrailleTranslateService';

export type Direccion = 'espanol-braille' | 'braille-espanol';

/**
 * Hook de adaptación bidireccional para el traductor Braille.
 * - Modo 'espanol-braille': usuario escribe texto, ve celdas Braille.
 * - Modo 'braille-espanol': usuario hace clic en letras del teclado Braille,
 *   el panel izquierdo muestra las celdas Braille acumuladas y el panel
 *   derecho muestra el texto resultante en español.
 */
export const useBrailleTranslator = () => {
  /** Dirección de traducción activa. Controla qué panel es entrada y cuál es salida. */
  const [direccion, setDireccion] = useState<Direccion>('espanol-braille');

  // ── Estado: Modo Español - Braille ───────────────────────────────────────

  /** Texto en español ingresado por el usuario en el `<textarea>`. */
  const [textoEspanol, setTextoEspanol] = useState<string>('');

  /**
   * Resultado de traducir {@link textoEspanol} a Braille.
   * Se recalcula automáticamente cada vez que cambia el texto de entrada.
   * Devuelve un arreglo vacío si el texto está vacío.
   */
  const traduccionEspanolBraille = useMemo<TraduccionBraille[]>(() => {
    if (!textoEspanol) return [];
    return BrailleTranslatorService.traducirTexto(textoEspanol);
  }, [textoEspanol]);

  // ── Estado: Modo Braille - Español ───────────────────────────────────────

  /**
   * Texto acumulado mediante el teclado Braille en pantalla.
   * Cada pulsación de tecla añade, elimina o limpia caracteres de este string.
   * Es al mismo tiempo la "entrada braille" y la "traducción en español"
   * (las letras se ingresan ya convertidas desde el teclado).
   */
  const [textoBraille, setTextoBraille] = useState<string>('');

  /**
   * Celdas Braille generadas a partir del texto acumulado en el teclado.
   * Se usa para mostrar la representación Braille en el panel izquierdo
   * mientras el usuario escribe, replicando la experiencia del modo opuesto.
   * Se recalcula automáticamente cada vez que cambia {@link textoBraille}.
   */
  const celdasBrailleEntrada = useMemo<TraduccionBraille[]>(() => {
    if (!textoBraille) return [];
    return BrailleTranslatorService.traducirTexto(textoBraille);
  }, [textoBraille]);

  /**
   * Texto en español resultante del teclado Braille.
   * Es idéntico a {@link textoBraille} ya que el teclado produce directamente
   * caracteres en español (no se necesita traducción adicional).
   */
  const textoTraducidoEspanol = textoBraille;

  // ── Acciones del teclado Braille ─────────────────────────────────────────

  /**
   * Agrega un carácter al texto acumulado desde el teclado Braille.
   * Invocado por {@link BrailleKeyboard} al presionar una tecla de letra, vocal, dígito o símbolo.
   *
   * @param letra - Carácter a agregar (ya con mayúscula aplicada si corresponde).
   */
  const agregarLetra = (letra: string) => {
    setTextoBraille(prev => prev + letra);
  };

  /**
   * Agrega un espacio al texto acumulado.
   * Invocado por la barra de espacio del {@link BrailleKeyboard}.
   */
  const agregarEspacio = () => {
    setTextoBraille(prev => prev + ' ');
  };

  /**
   * Elimina el último carácter del texto acumulado.
   * Usa el spread de string para manejar correctamente caracteres multibyte
   * (ej: `á`, `ñ`, `ü`), evitando cortar secuencias UTF-16 a la mitad.
   */
  const eliminarUltimaCelda = () => {
    setTextoBraille(prev => [...prev].slice(0, -1).join(''));
  };

  /**
   * Limpia completamente el texto acumulado desde el teclado Braille.
   * Equivalente a presionar la tecla ✕ del {@link BrailleKeyboard}.
   */
  const limpiarBraille = () => {
    setTextoBraille('');
  };

  /**
   * Alterna la dirección de traducción entre `'espanol-braille'` y `'braille-espanol'`.
   * Reinicia ambos estados de texto para evitar datos residuales al cambiar de modo.
   */
  const cambiarDireccion = () => {
    setDireccion(prev =>
      prev === 'espanol-braille' ? 'braille-espanol' : 'espanol-braille'
    );
    setTextoEspanol('');
    setTextoBraille('');
  };

  return {
    /** Dirección de traducción actualmente activa. */
    direccion,
    /** Función para alternar entre los dos modos de traducción. */
    cambiarDireccion,

    // Español - Braille
    /** Texto en español actualmente en el área de entrada. */
    textoEspanol,
    /** Setter del texto en español; conectado directamente al `onChange` del `<textarea>`. */
    setTextoEspanol,
    /** Arreglo de nodos Braille resultado de traducir {@link textoEspanol}. */
    traduccionEspanolBraille,

    // Braille - Español
    /** Texto acumulado mediante el teclado Braille. */
    textoBraille,
    /** Celdas Braille generadas desde {@link textoBraille} para mostrar en el panel izquierdo. */
    celdasBrailleEntrada,
    /** Texto en español resultante de la entrada por teclado Braille. */
    textoTraducidoEspanol,
    /** Agrega una letra/dígito/símbolo al texto acumulado. */
    agregarLetra,
    /** Inserta un espacio en el texto acumulado. */
    agregarEspacio,
    /** Elimina el último carácter del texto acumulado (soporta UTF-16). */
    eliminarUltimaCelda,
    /** Borra todo el texto acumulado. */
    limpiarBraille,
  };
};
