import { BrailleDictionary } from './BrailleDictionary';
import type { BrailleMatrix } from './BrailleDictionary';

export interface TraduccionBraille {
  caracterOriginal: string;
  matriz: BrailleMatrix;
  esPrefijo: boolean;
  /** true si el carácter no tiene representación en el diccionario */
  noSoportado?: boolean;
}

export class BrailleTranslatorService {
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

  private static crearNodo(char: string, matriz: BrailleMatrix, esPrefijo = false): TraduccionBraille {
    return { caracterOriginal: char, matriz, esPrefijo };
  }
}
