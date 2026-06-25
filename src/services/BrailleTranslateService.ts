import { BrailleDictionary } from "./BrailleDictionary";
import type { BrailleMatrix } from "./BrailleDictionary";

/**
 * Representa el resultado de la traducción de un carácter individual al sistema Braille.
 */
export interface TraduccionBraille {
  /** El carácter original en español. */
  caracterOriginal: string;
  /** La representación matricial de 6 puntos (cuadratín). */
  matriz: BrailleMatrix;
  /** Indica si este nodo es un prefijo de control (ej. prefijo de mayúscula o número). */
  esPrefijo: boolean;
  /** `true` si el carácter no tiene representación en el {@link BrailleDictionary}. */
  noSoportado?: boolean;
}

/**
 * Serializa una BrailleMatrix a una clave de string para búsqueda inversa.
 * Ej: [true,false,true,false,false,false] - "101000"
 */
const matrizAClave = (matriz: BrailleMatrix): string =>
  matriz.map(b => (b ? "1" : "0")).join("");

/**
 * Mapa inverso: clave de puntos - carácter español.
 * Se construye en tiempo de módulo a partir de BrailleDictionary,
 * excluyendo prefijos y dígitos (para evitar ambigüedad con letras).
 */
const buildInverseMap = (): Map<string, string> => {
  const map = new Map<string, string>();

  // Orden de prioridad: letras primero, luego dígitos, luego signos
  // Excluimos prefijos internos
  const excluir = new Set(["PREFIJO_NUMERO", "PREFIJO_MAYUSCULA"]);

  // Primero las letras y signos (sin dígitos para evitar colisión a-1)
  for (const [char, matriz] of Object.entries(BrailleDictionary)) {
    if (excluir.has(char)) continue;
    if (/^[0-9]$/.test(char)) continue; // los dígitos se manejan con contexto numérico
    const clave = matrizAClave(matriz);
    if (!map.has(clave)) {
      map.set(clave, char);
    }
  }

  return map;
};

const INVERSE_MAP = buildInverseMap();

/**
 * Convierte una BrailleMatrix a su carácter español equivalente.
 * Devuelve null si no hay coincidencia.
 */
const matrizAChar = (
  matriz: BrailleMatrix,
  enModoNumero: boolean
): string | null => {
  const clave = matrizAClave(matriz);

  // Celda vacía - espacio
  if (clave === "000000") return " ";

  // Prefijo número
  if (clave === matrizAClave(BrailleDictionary["PREFIJO_NUMERO"])) return "PREFIJO_NUMERO";

  // Prefijo mayúscula
  if (clave === matrizAClave(BrailleDictionary["PREFIJO_MAYUSCULA"])) return "PREFIJO_MAYUSCULA";

  if (enModoNumero) {
    // En modo número las celdas mapean a dígitos
    const digitMap: Record<string, string> = {
      [matrizAClave(BrailleDictionary["1"])]: "1",
      [matrizAClave(BrailleDictionary["2"])]: "2",
      [matrizAClave(BrailleDictionary["3"])]: "3",
      [matrizAClave(BrailleDictionary["4"])]: "4",
      [matrizAClave(BrailleDictionary["5"])]: "5",
      [matrizAClave(BrailleDictionary["6"])]: "6",
      [matrizAClave(BrailleDictionary["7"])]: "7",
      [matrizAClave(BrailleDictionary["8"])]: "8",
      [matrizAClave(BrailleDictionary["9"])]: "9",
      [matrizAClave(BrailleDictionary["0"])]: "0",
    };
    if (digitMap[clave] !== undefined) return digitMap[clave];
  }

  return INVERSE_MAP.get(clave) ?? null;
};

export class BrailleTranslatorService {
  /**
   * Español - Braille
   */
  static traducirTexto(texto: string): TraduccionBraille[] {
    const resultado: TraduccionBraille[] = [];
    let enModoNumero = false;
    let i = 0;

    while (i < texto.length) {
      const char = texto[i];

      if (char === " ") {
        enModoNumero = false;
        resultado.push(this.crearNodo(char, BrailleDictionary[" "]));
        i++;
        continue;
      }

      if (enModoNumero && (char === "." || char === ",")) {
        const matrizPunto = BrailleDictionary[char];
        if (matrizPunto) resultado.push(this.crearNodo(char, matrizPunto));
        i++;
        continue;
      }

      if (/[0-9]/.test(char)) {
        if (!enModoNumero) {
          resultado.push(
            this.crearNodo("PREFIJO_NUM", BrailleDictionary["PREFIJO_NUMERO"], true)
          );
          enModoNumero = true;
        }
        resultado.push(this.crearNodo(char, BrailleDictionary[char]));
        i++;
        continue;
      }

      enModoNumero = false;

      if (/[A-ZÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÚ]/.test(char)) {
        const reLetraOGuion =
          /[A-Za-záéíóúñüàèìòùâêîôûäëïöúÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÚ-]/;

        let inicioSec = i;
        while (inicioSec > 0 && reLetraOGuion.test(texto[inicioSec - 1]))
          inicioSec--;
        let finSec = i;
        while (finSec < texto.length && reLetraOGuion.test(texto[finSec]))
          finSec++;

        const soloLetras = texto.slice(inicioSec, finSec).replace(/-/g, "");
        let primeraPos = inicioSec;
        while (primeraPos < finSec && texto[primeraPos] === "-") primeraPos++;

        const esPrimeraLetra = i === primeraPos;
        const todaEnMayusculas =
          soloLetras.length > 1 && soloLetras === soloLetras.toUpperCase();

        if (esPrimeraLetra) {
          if (todaEnMayusculas) {
            resultado.push(
              this.crearNodo("PREFIJO_MAY", BrailleDictionary["PREFIJO_MAYUSCULA"], true)
            );
            resultado.push(
              this.crearNodo("PREFIJO_MAY", BrailleDictionary["PREFIJO_MAYUSCULA"], true)
            );
          } else {
            resultado.push(
              this.crearNodo("PREFIJO_MAY", BrailleDictionary["PREFIJO_MAYUSCULA"], true)
            );
          }
        } else if (!todaEnMayusculas) {
          resultado.push(
            this.crearNodo("PREFIJO_MAY", BrailleDictionary["PREFIJO_MAYUSCULA"], true)
          );
        }
      }

      const charMin = char.toLowerCase();
      const matrizBraille = BrailleDictionary[charMin];

      if (matrizBraille) {
        resultado.push(this.crearNodo(char, matrizBraille));
      } else {
        resultado.push({
          caracterOriginal: char,
          matriz: [false, false, false, false, false, false],
          esPrefijo: false,
          noSoportado: true,
        });
      }

      i++;
    }

    return resultado;
  }

  /**
   * Braille - Español
   * Recibe un array de BrailleMatrix (las celdas ingresadas por el usuario)
   * y devuelve el texto en español.
   */
  static traducirBrailleAEspanol(matrices: BrailleMatrix[]): string {
    let resultado = "";
    let enModoNumero = false;
    let contadorPrefMayuscula = 0;
    let i = 0;

    while (i < matrices.length) {
      const char = matrizAChar(matrices[i], enModoNumero);

      if (char === "PREFIJO_NUMERO") {
        enModoNumero = true;
        contadorPrefMayuscula = 0;
        i++;
        continue;
      }

      if (char === "PREFIJO_MAYUSCULA") {
        contadorPrefMayuscula++;
        enModoNumero = false;
        i++;
        continue;
      }

      if (char === " " || char === null) {
        enModoNumero = false;
        contadorPrefMayuscula = 0;
        resultado += char === " " ? " " : "?";
        i++;
        continue;
      }

      // Aplicar mayúsculas según el número de prefijos acumulados
      if (contadorPrefMayuscula >= 2) {
        // doble prefijo: toda la secuencia en mayúsculas hasta el siguiente espacio
        let j = i;
        while (j < matrices.length) {
          const c = matrizAChar(matrices[j], false);
          if (c === " " || c === null || c === "PREFIJO_NUMERO" || c === "PREFIJO_MAYUSCULA") break;
          resultado += c.toUpperCase();
          j++;
        }
        i = j;
        contadorPrefMayuscula = 0;
        continue;
      } else if (contadorPrefMayuscula === 1) {
        resultado += char.toUpperCase();
        contadorPrefMayuscula = 0;
      } else {
        resultado += char;
      }

      if (char !== "." && char !== ",") {
        // Los signos . y , en modo número no salen del modo
        if (!/[0-9]/.test(char)) enModoNumero = false;
      }

      i++;
    }

    return resultado;
  }

  private static crearNodo(
    char: string,
    matriz: BrailleMatrix,
    esPrefijo = false
  ): TraduccionBraille {
    return { caracterOriginal: char, matriz, esPrefijo };
  }
}
