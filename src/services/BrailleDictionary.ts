export type BrailleMatrix = [boolean, boolean, boolean, boolean, boolean, boolean];

const crearCuadratin = (puntosActivos: number[]): BrailleMatrix => {
  const matriz: BrailleMatrix = [false, false, false, false, false, false];
  puntosActivos.forEach(punto => {
    matriz[punto - 1] = true;
  });
  return matriz;
};

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
  // w no existía en braille original francés; su representación estándar en español:
  'w': crearCuadratin([2, 4, 5, 6]),
  'x': crearCuadratin([1, 3, 4, 6]),
  'y': crearCuadratin([1, 3, 4, 5, 6]),
  'z': crearCuadratin([1, 3, 5, 6]),

  // --- Vocales acentuadas ---
  'á': crearCuadratin([1, 2, 3, 5, 6]),
  'é': crearCuadratin([2, 3, 4, 6]),
  'í': crearCuadratin([3, 5]),
  'ó': crearCuadratin([3, 4, 6]),
  'ú': crearCuadratin([2, 3, 4, 5, 6]),
  'ü': crearCuadratin([1, 2, 5, 6]),

  // --- Letras especiales del español ---
  'ñ': crearCuadratin([1, 2, 4, 5, 6]),
  'ch': crearCuadratin([1, 6]),      // dígrafo tradicional español
  'll': crearCuadratin([1, 2, 3, 6]), // dígrafo tradicional español

  // --- Espacio ---
  ' ': crearCuadratin([]),

  // --- Prefijos ---
  'PREFIJO_NUMERO':    crearCuadratin([3, 4, 5, 6]),
  'PREFIJO_MAYUSCULA': crearCuadratin([4, 6]),
};
