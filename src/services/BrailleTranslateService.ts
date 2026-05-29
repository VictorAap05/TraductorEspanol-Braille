import { BrailleDictionary } from './BrailleDictionary';
import type { BrailleMatrix } from './BrailleDictionary';

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
  /** `true` si el carácter no tiene representación en el {@link BrailleDictionary}. Activa marcado visual de advertencia. */
  noSoportado?: boolean;
}

/**
 * Servicio encargado de la lógica pura de traducción de texto en español
 * al sistema de lectoescritura Braille Español.
 *
 * Es totalmente agnóstico de la interfaz gráfica y no depende de ningún
 * estado reactivo, cumpliendo el Principio de Responsabilidad Única.
 */
export class BrailleTranslatorService {

  /**
   * Procesa una cadena de texto en español y devuelve un arreglo de cuadratines Braille.
   *
   * Aplica las siguientes reglas en orden de prioridad:
   * 1. **Espacios** — se traducen directamente y reinician el modo número.
   * 2. **Dígrafos** (`ch`, `ll`) — se detectan como unidad y consumen dos caracteres.
   * 3. **Números** — se antepone el prefijo de número al inicio de cada secuencia numérica.
   * 4. **Mayúsculas** — se antepone el indicador de mayúscula antes de cada letra en mayúscula.
   * 5. **Caracteres no soportados** — se emite un nodo con matriz vacía y `noSoportado: true`.
   *
   * @param texto - La cadena de texto en español a traducir.
   * @returns Arreglo de objetos {@link TraduccionBraille} listos para ser renderizados.
   */
  static traducirTexto(texto: string): TraduccionBraille[] {
    const resultado: TraduccionBraille[] = [];
    let enModoNumero = false;
    let i = 0;

    while (i < texto.length) {
      const char = texto[i];

      // Espacios (reinicia modo número)
      if (char === ' ') {
        enModoNumero = false;
        resultado.push(this.crearNodo(char, BrailleDictionary[' ']));
        i++;
        continue;
      }

      // Dígrafos: ch, ll (minúsculas y mayúsculas)
      const doble = texto.slice(i, i + 2).toLowerCase();
      if ((doble === 'ch' || doble === 'll') && BrailleDictionary[doble]) {
        enModoNumero = false;
        const esMayus = /[A-ZÁÉÍÓÚÑÜ]/.test(char);
        if (esMayus) {
          resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
        }
        resultado.push(this.crearNodo(texto.slice(i, i + 2), BrailleDictionary[doble]));
        i += 2;
        continue;
      }

      // Números
      if (/[0-9]/.test(char)) {
        if (!enModoNumero) {
          resultado.push(this.crearNodo('PREFIJO_NUM', BrailleDictionary['PREFIJO_NUMERO'], true));
          enModoNumero = true;
        }
        // Los números reutilizan la Serie 1: 1=a, 2=b, ..., 9=i, 0=j
        const letraEquivalente = char === '0' ? 'j' : String.fromCharCode(char.charCodeAt(0) + 48);
        resultado.push(this.crearNodo(char, BrailleDictionary[letraEquivalente]));
        i++;
        continue;
      }

      enModoNumero = false;

      // Mayúsculas
      if (/[A-ZÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÚ]/.test(char)) {
        resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
      }

      const charMin = char.toLowerCase();
      const matrizBraille = BrailleDictionary[charMin];

      if (matrizBraille) {
        resultado.push(this.crearNodo(char, matrizBraille));
      } else {
        // Carácter no soportado: se muestra con matriz vacía y marcado visualmente
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
   * Crea un nodo de traducción individual.
   *
   * @param char      - Carácter original o identificador del prefijo.
   * @param matriz    - Matriz booleana de 6 puntos correspondiente al carácter.
   * @param esPrefijo - `true` si el nodo representa un prefijo de control. Por defecto `false`.
   * @returns Un objeto {@link TraduccionBraille} listo para ser añadido al resultado.
   */
  private static crearNodo(char: string, matriz: BrailleMatrix, esPrefijo = false): TraduccionBraille {
    return { caracterOriginal: char, matriz, esPrefijo };
  }
}