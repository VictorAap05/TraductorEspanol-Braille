/**
 * Representa los 6 puntos del cuadratín o símbolo generador[cite: 31].
 * Se estructura como una tupla de 6 posiciones booleanas correspondientes a cada punto espacial: `[P1, P2, P3, P4, P5, P6]`.
 * - `true`: Punto en relieve (negro).
 * - `false`: Punto inactivo (gris).
 */
export type BrailleMatrix = [boolean, boolean, boolean, boolean, boolean, boolean];

/**
 * Función auxiliar interna para construir una matriz booleana del cuadratín 
 * a partir de los números de los puntos activos.
 * * @param puntosActivos - Arreglo con la identificación de los puntos (del 1 al 6) que deben estar en relieve[cite: 32].
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
 * Contiene la representación en matriz de las series primitivas (abecedario), 
 * vocales acentuadas, y prefijos especiales para números y mayúsculas[cite: 30].
 */
export const BrailleDictionary: Record<string, BrailleMatrix> = {
  // --- Serie 1 (a-j) ---
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

  // --- Vocales acentuadas y caracteres especiales ---
  'á': crearCuadratin([1, 2, 3, 5, 6]),
  'ñ': crearCuadratin([1, 2, 4, 5, 6]),
  ' ': crearCuadratin([]), // Espacio en blanco

  // --- Banderas / Prefijos ---
  'PREFIJO_NUMERO': crearCuadratin([3, 4, 5, 6]),
  'PREFIJO_MAYUSCULA': crearCuadratin([4, 6])
};