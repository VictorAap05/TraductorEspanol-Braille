import { BrailleDictionary } from './BrailleDictionary';
import type { BrailleMatrix } from './BrailleDictionary';

/**
 * Representa el resultado de la traducción de un carácter individual.
 */
export interface TraduccionBraille {
  /** El carácter original en español. */
  caracterOriginal: string;
  /** La representación matricial de 6 puntos (cuadratín). */
  matriz: BrailleMatrix;
  /** Indica si este nodo es un prefijo (ej. prefijo de mayúscula o número). */
  esPrefijo: boolean;
}

/**
 * Servicio encargado de la lógica pura de traducción de texto en español
 * al sistema de lectoescritura Braille.
 */
export class BrailleTranslatorService {
  /**
   * Procesa una cadena de texto y devuelve un array de cuadratines Braille.
   * Maneja automáticamente la inserción de prefijos para números y mayúsculas.
   * @param texto - La cadena de texto en español a traducir.
   * @returns Un arreglo de objetos `TraduccionBraille` listos para ser renderizados.
   */
  static traducirTexto(texto: string): TraduccionBraille[] {
    const resultado: TraduccionBraille[] = [];
    let enModoNumero = false;

    for (let i = 0; i < texto.length; i++) {
      const char = texto[i];

      // Manejo de espacios (reinicia el modo número)
      if (char === ' ') {
        enModoNumero = false;
        resultado.push(this.crearNodo(char, BrailleDictionary[' ']));
        continue;
      }

      // Evaluar números (HU03)
      if (/[0-9]/.test(char)) {
        if (!enModoNumero) {
          resultado.push(this.crearNodo('PREFIJO_NUM', BrailleDictionary['PREFIJO_NUMERO'], true));
          enModoNumero = true;
        }
        // Los números usan la Serie 1 (1 = a, 2 = b, 0 = j)
        const letraEquivalente = char === '0' ? 'j' : String.fromCharCode(char.charCodeAt(0) + 48);
        resultado.push(this.crearNodo(char, BrailleDictionary[letraEquivalente]));
        continue;
      }

      // Si encontramos una letra, salimos del modo número
      enModoNumero = false;

      // Evaluar mayúsculas (HU04)
      if (/[A-ZÁÉÍÓÚÑÜ]/.test(char)) {
        resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
      }

      // Buscar el carácter en minúscula en el diccionario
      const charMinuscula = char.toLowerCase();
      const matrizBraille = BrailleDictionary[charMinuscula];

      if (matrizBraille) {
        resultado.push(this.crearNodo(char, matrizBraille));
      } else {
        // Manejo de error o carácter no soportado
        console.warn(`Carácter no soportado: ${char}`);
      }
    }

    return resultado;
  }

  private static crearNodo(char: string, matriz: BrailleMatrix, esPrefijo = false): TraduccionBraille {
    return { caracterOriginal: char, matriz, esPrefijo };
  }
}