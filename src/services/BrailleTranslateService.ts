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
   *    Los dígitos se buscan **directamente** en {@link BrailleDictionary} (claves `'0'`–`'9'`),
   *    eliminando la conversión implícita por `charCodeAt` que causaba que el `'0'`
   *    fallara (ASCII 48 + 48 = 96 = backtick, sin entrada en el diccionario).
   * 4. **Mayúsculas** — aplica la regla de prefijado según el contexto de la palabra:
   *    - **Palabra completa en mayúsculas** → doble prefijo `⠨⠨` solo al inicio de la palabra.
   *    - **Letra mayúscula aislada** → prefijo simple `⠨` antes de esa letra.
   *    Antes del fix, el código colocaba un prefijo simple antes de *cada* letra
   *    mayúscula individualmente, lo que producía prefijos múltiples en palabras como
   *    `FIS-EPN` en lugar del doble prefijo inicial requerido por el estándar Braille.
   * 5. **Caracteres no soportados** — se emite un nodo con matriz vacía y `noSoportado: true`.
   *
   * @param texto - La cadena de texto en español a traducir.
   * @returns Arreglo de objetos {@link TraduccionBraille} listos para ser renderizados.
   *
   * @example
   * // Palabra completamente en mayúsculas → doble prefijo al inicio
   * BrailleTranslatorService.traducirTexto('FIS');
   * // → [PREF_MAY, PREF_MAY, F, I, S]
   *
   * @example
   * // Letra mayúscula aislada → prefijo simple antes de esa letra
   * BrailleTranslatorService.traducirTexto('Hola');
   * // → [PREF_MAY, H, o, l, a]
   *
   * @example
   * // Número con cero → se busca '0' directamente en el diccionario
   * BrailleTranslatorService.traducirTexto('20');
   * // → [PREF_NUM, 2, 0]   (el 0 usa la celda de 'j': puntos 2-4-5)
   */
  static traducirTexto(texto: string): TraduccionBraille[] {
    const resultado: TraduccionBraille[] = [];
    let enModoNumero = false;
    let i = 0;

    while (i < texto.length) {
      const char = texto[i];

      // ── Espacios: reinician el modo número y se emiten como celda vacía ──
      if (char === ' ') {
        enModoNumero = false;
        resultado.push(this.crearNodo(char, BrailleDictionary[' ']));
        i++;
        continue;
      }

      // ── Dígrafos: ch / ll (también en mayúsculas como CH, LL) ──
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

      // ── Números: busca el dígito directamente en el diccionario ──
      // FIX: antes se usaba String.fromCharCode(charCode + 48) para convertir
      // el dígito a su letra equivalente (1→'a', 2→'b'… 9→'i', 0→'j'), pero
      // '0'.charCodeAt(0) = 48 y 48 + 48 = 96 = '`' (backtick), que no existe
      // en el diccionario, por lo que el cero se renderizaba como celda vacía.
      // Solución: los dígitos '0'–'9' están ahora declarados explícitamente en
      // BrailleDictionary y se acceden directamente con la clave del carácter.
      if (/[0-9]/.test(char)) {
        if (!enModoNumero) {
          resultado.push(this.crearNodo('PREFIJO_NUM', BrailleDictionary['PREFIJO_NUMERO'], true));
          enModoNumero = true;
        }
        resultado.push(this.crearNodo(char, BrailleDictionary[char]));
        i++;
        continue;
      }

      enModoNumero = false;

      // ── Mayúsculas: prefijo simple o doble según contexto de palabra ──
      // REGLA DE MAYUSCULAS:
      //   • Secuencia completa en mayúsculas (ej. "FIS-EPN") → doble prefijo solo al inicio.
      //     El guión NO interrumpe la secuencia: "FIS-EPN" es una unidad.
      //   • Primera letra en mayúscula (ej. "Hola") → prefijo simple antes de esa letra.
      //   • Mayúscula en medio de secuencia mixta → prefijo simple ante esa letra.
      if (/[A-ZÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÚ]/.test(char)) {
        
        const reLetraOGuion = /[A-Za-záéíóúñüàèìòùâêîôûäëïöúÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÚ-]/;

        // Encontrar inicio y fin de la secuencia (letras + guión como separador interno)
        let inicioSec = i;
        while (inicioSec > 0 && reLetraOGuion.test(texto[inicioSec - 1])) inicioSec--;
        let finSec = i;
        while (finSec < texto.length && reLetraOGuion.test(texto[finSec])) finSec++;

        // Solo letras de la secuencia (sin guión) para evaluar si toda está en mayúsculas
        const soloLetras = texto.slice(inicioSec, finSec).replace(/-/g, '');

        // Primera letra real de la secuencia (primera posición que no sea guión)
        let primeraPos = inicioSec;
        while (primeraPos < finSec && texto[primeraPos] === '-') primeraPos++;

        const esPrimeraLetra = i === primeraPos;
        const todaEnMayusculas = soloLetras.length > 1 && soloLetras === soloLetras.toUpperCase();

        if (esPrimeraLetra) {
          if (todaEnMayusculas) {
            // Toda la secuencia en mayúsculas → doble prefijo únicamente al inicio
            resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
            resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
          } else {
            // Primera letra en mayúscula → prefijo simple
            resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
          }
        } else if (!todaEnMayusculas) {
          // Mayúscula en secuencia mixta → prefijo simple ante esta letra
          resultado.push(this.crearNodo('PREFIJO_MAY', BrailleDictionary['PREFIJO_MAYUSCULA'], true));
        }
        // Si todaEnMayusculas && no es la primera letra → sin prefijo extra
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