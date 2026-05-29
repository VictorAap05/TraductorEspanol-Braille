/**
 * Representa los 6 puntos del cuadratín o símbolo generador.
 * Se estructura como una tupla de 6 posiciones booleanas correspondientes a cada punto espacial: `[P1, P2, P3, P4, P5, P6]`.
 * - `true`: Punto en relieve (negro).
 * - `false`: Punto inactivo (gris).
 */
export type BrailleMatrix = [boolean, boolean, boolean, boolean, boolean, boolean];

/**
 * Función auxiliar interna para construir una matriz booleana del cuadratín
 * a partir de los números de los puntos activos.
 *
 * @param puntosActivos - Arreglo con la identificación de los puntos (del 1 al 6) que deben estar en relieve.
 * @returns La matriz booleana correspondiente de tipo `BrailleMatrix`.
 */
const crearCuadratin = (puntosActivos: number[]): BrailleMatrix => {
  const matriz: BrailleMatrix = [false, false, false, false, false, false];
  puntosActivos.forEach(punto => {
    matriz[punto - 1] = true; // Ajuste de índice (punto 1 es índice 0)
  });
  return matriz;
};

/**
 * Mapa de equivalencias estáticas del sistema Braille Español.
 *
 * Contiene la representación en matriz de:
 * - Las tres series del abecedario (a–z).
 * - Vocales acentuadas (á, é, í, ó, ú, ü) y letras especiales del español (ñ, ch, ll).
 * - Signos de puntuación y operadores matemáticos básicos.
 * - Prefijos de control para números y mayúsculas.
 *
 * Es una estructura de datos inmutable consumida por {@link BrailleTranslatorService}
 * para resolver la equivalencia de cada carácter durante la traducción.
 */
export const BrailleDictionary: Record<string, BrailleMatrix> = {
  // --- Serie 1 (a-j): puntos 1-2-4-5 ---
  'a': crearCuadratin([1]),
  'b': crearCuadratin([1, 2]),
  'c': crearCuadratin([1, 4]),
  'd': crearCuadratin([1, 4, 5]),
  'e': crearCuadratin([1, 5]),
  'f': crearCuadratin([1, 2, 4]),
  'g': crearCuadratin([1, 2, 4, 5]),
  'h': crearCuadratin([1, 2, 5]),
  'i': crearCuadratin([2, 4]),
  'j': crearCuadratin([2, 4, 5]),

  // --- Serie 2 (k-t): Se añade el punto 3 ---
  'k': crearCuadratin([1, 3]),
  'l': crearCuadratin([1, 2, 3]),
  'm': crearCuadratin([1, 3, 4]),
  'n': crearCuadratin([1, 3, 4, 5]),
  'o': crearCuadratin([1, 3, 5]),
  'p': crearCuadratin([1, 2, 3, 4]),
  'q': crearCuadratin([1, 2, 3, 4, 5]),
  'r': crearCuadratin([1, 2, 3, 5]),
  's': crearCuadratin([2, 3, 4]),
  't': crearCuadratin([2, 3, 4, 5]),

  // --- Serie 3 (u-z + ñ): Se añade el punto 6 ---
  'u': crearCuadratin([1, 3, 6]),
  'v': crearCuadratin([1, 2, 3, 6]),
  'w': crearCuadratin([2, 4, 5, 6]),
  'x': crearCuadratin([1, 3, 4, 6]),
  'y': crearCuadratin([1, 3, 4, 5, 6]),
  'z': crearCuadratin([1, 3, 5, 6]),

  // --- Vocales acentuadas ---
  'á': crearCuadratin([1, 2, 3, 5, 6]),
  'é': crearCuadratin([2, 3, 4, 6]),
  'í': crearCuadratin([3, 4]),
  'ó': crearCuadratin([3, 4, 6]),
  'ú': crearCuadratin([2, 3, 4, 5, 6]),
  'ü': crearCuadratin([1, 2, 5, 6]),

  // --- Letras especiales del español ---
  'ñ': crearCuadratin([1, 2, 4, 5, 6]),
  'ch': crearCuadratin([1, 6]),       // dígrafo tradicional español
  'll': crearCuadratin([1, 2, 3, 6]), // dígrafo tradicional español

  // --- Signos de puntuación ---
  '.':  crearCuadratin([3]),
  ',':  crearCuadratin([2]),
  ';':  crearCuadratin([2, 3]),
  ':':  crearCuadratin([2, 5]),
  '-':  crearCuadratin([3, 6]),
  '"':  crearCuadratin([2, 3, 6]),
  '¡':  crearCuadratin([2, 3, 5]),
  '!':  crearCuadratin([2, 3, 5]),
  '¿':  crearCuadratin([2, 6]),
  '?':  crearCuadratin([2, 6]),
  '(':  crearCuadratin([1, 2, 6]),
  ')':  crearCuadratin([3, 4, 5]),
  '+':  crearCuadratin([2, 3, 5]),
  '×':  crearCuadratin([2, 3, 6]),
  '=':  crearCuadratin([2, 3, 5, 6]),
  '÷':  crearCuadratin([2, 5, 6]),

  // --- Espacio ---
  ' ': crearCuadratin([]),

  // --- Prefijos ---
  'PREFIJO_NUMERO':    crearCuadratin([3, 4, 5, 6]),
  'PREFIJO_MAYUSCULA': crearCuadratin([4, 6]),
};