/**
 * @file BrailleKeyboard.tsx
 * @description Teclado Braille en pantalla con layout QWERTY para el modo Braille → Español.
 *
 * Permite al usuario ingresar letras, vocales acentuadas, dígitos y símbolos
 * haciendo clic en teclas visuales que muestran el cuadratín Braille correspondiente.
 *
 * Soporta dos modos de entrada:
 * - **Letras** (`'letras'`): abecedario QWERTY en español + vocales especiales.
 * - **Números/Símbolos** (`'numeros'`): dígitos 0–9 y signos de puntuación y operadores.
 *
 * Características especiales:
 * - Tecla **MAYUS**: alterna mayúsculas para la siguiente letra ingresada.
 *   Muestra el cuadratín del `PREFIJO_MAYUSCULA` y se resalta en azul cuando está activa.
 * - Tecla **&123**: cambia al modo numérico.
 *   Muestra el cuadratín del `PREFIJO_NUMERO`; los dígitos se resaltan en dorado.
 * - Tecla **⌫**: elimina el último carácter ingresado.
 * - Barra de **espacio**: inserta un espacio.
 * - Tecla **✕**: limpia toda la entrada acumulada.
 *
 * @module BrailleKeyboard
 */

import React, { useState } from 'react';
import { BrailleDictionary } from '../../services/BrailleDictionary';
import type { BrailleMatrix } from '../../services/BrailleDictionary';

/**
 * Props del componente {@link BrailleKeyboard}.
 */
interface BrailleKeyboardProps {
  /** Callback invocado al presionar una tecla de letra, vocal, dígito o símbolo. */
  onAgregarLetra: (letra: string) => void;
  /** Callback invocado al presionar la barra de espacio. */
  onAgregarEspacio: () => void;
  /** Callback invocado al presionar la tecla de borrar (⌫). Elimina el último carácter. */
  onEliminarUltima: () => void;
  /** Callback invocado al presionar la tecla de limpiar (✕). Borra toda la entrada. */
  onLimpiar: () => void;
  /** Texto acumulado actualmente. Se usa para deshabilitar ⌫ y ✕ cuando está vacío. */
  textoBraille: string;
}

/**
 * Orden de renderizado de los índices de la {@link BrailleMatrix} para el mini cuadratín.
 *
 * CSS Grid llena columnas por filas; este arreglo reordena los índices para que
 * los puntos aparezcan en la disposición física estándar Braille:
 * ```
 * P1(0)  P4(3)
 * P2(1)  P5(4)
 * P3(2)  P6(5)
 * ```
 */
const ORDEN_VISUAL = [0, 3, 1, 4, 2, 5];

/**
 * Sub-componente interno que renderiza el mini cuadratín Braille dentro de cada tecla.
 *
 * Si no se recibe una matriz válida, muestra un espacio vacío con las mismas dimensiones
 * para mantener la alineación visual (usado en la tecla ABC al volver de números).
 *
 * @param matriz - Tupla de 6 booleanos; `undefined` produce un cuadratín vacío.
 */
const MiniCuadratin: React.FC<{ matriz: BrailleMatrix | undefined }> = ({ matriz }) => {
  if (!matriz) return <div className="kbd-grid kbd-grid--empty" />;
  return (
    <div className="kbd-grid">
      {ORDEN_VISUAL.map((matrizIndex, pos) => (
        <div
          key={pos}
          className={`kbd-dot ${matriz[matrizIndex] ? 'kbd-dot--active' : 'kbd-dot--inactive'}`}
        />
      ))}
    </div>
  );
};

/**
 * Modo de entrada activo del teclado.
 * - `'letras'`  → muestra el layout QWERTY con vocales españolas.
 * - `'numeros'` → muestra dígitos y símbolos de puntuación/operadores.
 */
type ModoTeclado = 'letras' | 'numeros';

// ── Layouts de teclas ────────────────────────────────────────────────────────

/** Fila superior del layout QWERTY. */
const FILA_Q   = ['q','w','e','r','t','y','u','i','o','p'];

/** Fila central del layout QWERTY. */
const FILA_A   = ['a','s','d','f','g','h','j','k','l','ñ'];

/** Fila inferior del layout QWERTY (sin las teclas de acción). */
const FILA_Z   = ['z','x','c','v','b','n','m'];

/** Fila de vocales acentuadas y especiales del español. */
const FILA_ESP = ['á','é','í','ó','ú','ü'];

/** Dígitos 1–0 en modo numérico. Usan el `PREFIJO_NUMERO` en Braille. */
const FILA_SIM1 = ['1','2','3','4','5','6','7','8','9','0'];

/** Operadores matemáticos y signos de puntuación comunes. */
const FILA_SIM2 = ['+','-','×','÷','=','.',',',';',':','"'];

/** Signos de exclamación, interrogación y paréntesis del español. */
const FILA_SIM3 = ['¡','!','¿','?','(',')'];

/**
 * Matriz del prefijo de número, extraída del {@link BrailleDictionary}.
 * Se muestra en la tecla `&123` para identificar visualmente que activa el modo numérico.
 */
const MATRIZ_PREFIJO_NUM = BrailleDictionary['PREFIJO_NUMERO'];

/**
 * Matriz del prefijo de mayúscula, extraída del {@link BrailleDictionary}.
 * Se muestra en ambas teclas `mayus` para identificar visualmente su función.
 */
const MATRIZ_PREFIJO_MAY = BrailleDictionary['PREFIJO_MAYUSCULA'];

/**
 * Componente de teclado Braille en pantalla con layout QWERTY.
 *
 * Gestiona su propio estado interno de modo (`letras`/`numeros`) y de mayúsculas,
 * delegando al padre únicamente la gestión del texto acumulado mediante callbacks.
 *
 * @param props - Propiedades del teclado. Ver {@link BrailleKeyboardProps}.
 * @returns Elemento JSX con el teclado completo y todos sus modos.
 */
export const BrailleKeyboard: React.FC<BrailleKeyboardProps> = ({
  onAgregarLetra,
  onAgregarEspacio,
  onEliminarUltima,
  onLimpiar,
  textoBraille,
}) => {
  /** `true` cuando la próxima letra ingresada debe convertirse a mayúscula. */
  const [mayusculas, setMayusculas] = useState(false);

  /** Modo de entrada activo del teclado. */
  const [modo, setModo] = useState<ModoTeclado>('letras');

  /**
   * Maneja la pulsación de una tecla de letra.
   * Aplica mayúscula si está activa y la desactiva automáticamente después.
   *
   * @param letra - Letra en minúscula a ingresar.
   */
  const handleLetra = (letra: string) => {
    onAgregarLetra(mayusculas ? letra.toUpperCase() : letra);
    setMayusculas(false);
  };

  /**
   * Resuelve la {@link BrailleMatrix} de un carácter para mostrarla en la tecla.
   * Intenta primero con la versión en minúscula; si no existe, prueba con el carácter original
   * (útil para símbolos como `+`, `.`, etc.).
   *
   * @param char - Carácter cuya matriz se desea obtener.
   * @returns La matriz Braille del carácter, o `undefined` si no existe en el diccionario.
   */
  const getMatriz = (char: string): BrailleMatrix | undefined =>
    BrailleDictionary[char.toLowerCase()] ?? BrailleDictionary[char];

  /** `true` cuando no hay texto acumulado; deshabilita las teclas ⌫ y ✕. */
  const vacio = textoBraille.length === 0;

  return (
    <div className="kbd-wrapper">

      {/* ── MODO LETRAS ─────────────────────────────────────────────────────── */}
      {modo === 'letras' && (
        <>
          {/* Fila Q — primera fila de letras QWERTY + tecla de borrar */}
          <div className="kbd-row">
            {FILA_Q.map((l) => (
              <button key={l} className={`kbd-key${mayusculas ? ' kbd-key--caps-on' : ''}`}
                onClick={() => handleLetra(l)}>
                <MiniCuadratin matriz={getMatriz(l)} />
                <span className="kbd-key-label">{mayusculas ? l.toUpperCase() : l}</span>
              </button>
            ))}
            <button className="kbd-key kbd-key--action kbd-key--backspace"
              onClick={onEliminarUltima} disabled={vacio} aria-label="Borrar último carácter">⌫</button>
          </div>

          {/* Fila A — segunda fila de letras QWERTY (ligeramente desplazada) */}
          <div className="kbd-row kbd-row--offset-a">
            {FILA_A.map((l) => (
              <button key={l} className={`kbd-key${mayusculas ? ' kbd-key--caps-on' : ''}`}
                onClick={() => handleLetra(l)}>
                <MiniCuadratin matriz={getMatriz(l)} />
                <span className="kbd-key-label">{mayusculas ? l.toUpperCase() : l}</span>
              </button>
            ))}
          </div>

          {/* Fila Z — tercera fila con teclas MAYUS a ambos lados */}
          <div className="kbd-row">
            {/* MAYUS izquierda: muestra el cuadratín del PREFIJO_MAYUSCULA */}
            <button
              className={`kbd-key kbd-key--shift${mayusculas ? ' kbd-key--shift-on' : ''}`}
              onClick={() => setMayusculas(v => !v)}
              aria-label={mayusculas ? 'Desactivar mayúsculas' : 'Activar mayúsculas'}
              aria-pressed={mayusculas}
            >
              <MiniCuadratin matriz={MATRIZ_PREFIJO_MAY} />
              <span className="kbd-key-label kbd-key-label--small">mayus</span>
            </button>
            {FILA_Z.map((l) => (
              <button key={l} className={`kbd-key${mayusculas ? ' kbd-key--caps-on' : ''}`}
                onClick={() => handleLetra(l)}>
                <MiniCuadratin matriz={getMatriz(l)} />
                <span className="kbd-key-label">{mayusculas ? l.toUpperCase() : l}</span>
              </button>
            ))}
            {/* MAYUS derecha: duplicado para simetría visual con el layout real */}
            <button
              className={`kbd-key kbd-key--shift${mayusculas ? ' kbd-key--shift-on' : ''}`}
              onClick={() => setMayusculas(v => !v)}
              aria-label={mayusculas ? 'Desactivar mayúsculas' : 'Activar mayúsculas'}
              aria-pressed={mayusculas}
            >
              <MiniCuadratin matriz={MATRIZ_PREFIJO_MAY} />
              <span className="kbd-key-label kbd-key-label--small">mayus</span>
            </button>
          </div>

          {/* Fila de vocales acentuadas y especiales del español */}
          <div className="kbd-row">
            {FILA_ESP.map((l) => (
              <button key={l} className={`kbd-key${mayusculas ? ' kbd-key--caps-on' : ''}`}
                onClick={() => handleLetra(l)}>
                <MiniCuadratin matriz={getMatriz(l)} />
                <span className="kbd-key-label">{mayusculas ? l.toUpperCase() : l}</span>
              </button>
            ))}
          </div>

          {/* Barra inferior: &123 | espacio | limpiar */}
          <div className="kbd-row kbd-row--bottom">
            {/* &123: cambia a modo numérico; muestra cuadratín del PREFIJO_NUMERO */}
            <button className="kbd-key kbd-key--sym" onClick={() => setModo('numeros')}
              aria-label="Cambiar a modo numérico">
              <MiniCuadratin matriz={MATRIZ_PREFIJO_NUM} />
              <span className="kbd-key-label kbd-key-label--small">&amp;123</span>
            </button>
            <button className="kbd-key kbd-key--space" onClick={onAgregarEspacio}
              aria-label="Insertar espacio">
              espacio
            </button>
            <button className="kbd-key kbd-key--action kbd-key--clear"
              onClick={onLimpiar} disabled={vacio} aria-label="Limpiar todo">✕</button>
          </div>
        </>
      )}

      {/* ── MODO NÚMEROS / SÍMBOLOS ─────────────────────────────────────────── */}
      {modo === 'numeros' && (
        <>
          {/* Fila de dígitos 1–0: resaltados en dorado (usan PREFIJO_NUMERO en Braille) */}
          <div className="kbd-row">
            {FILA_SIM1.map((s) => (
              <button key={s} className="kbd-key kbd-key--num-on" onClick={() => onAgregarLetra(s)}>
                <MiniCuadratin matriz={getMatriz(s)} />
                <span className="kbd-key-label">{s}</span>
              </button>
            ))}
            <button className="kbd-key kbd-key--action kbd-key--backspace"
              onClick={onEliminarUltima} disabled={vacio} aria-label="Borrar último carácter">⌫</button>
          </div>

          {/* Fila de operadores y puntuación (no usan prefijo de número) */}
          <div className="kbd-row">
            {FILA_SIM2.map((s) => (
              <button key={s} className="kbd-key" onClick={() => onAgregarLetra(s)}>
                <MiniCuadratin matriz={getMatriz(s)} />
                <span className="kbd-key-label">{s}</span>
              </button>
            ))}
          </div>

          {/* Fila de signos de exclamación, interrogación y paréntesis */}
          <div className="kbd-row">
            {FILA_SIM3.map((s) => (
              <button key={s} className="kbd-key" onClick={() => onAgregarLetra(s)}>
                <MiniCuadratin matriz={getMatriz(s)} />
                <span className="kbd-key-label">{s}</span>
              </button>
            ))}
          </div>

          {/* Barra inferior: ABC | espacio | limpiar */}
          <div className="kbd-row kbd-row--bottom">
            {/* ABC: vuelve al modo de letras */}
            <button className="kbd-key kbd-key--sym" onClick={() => setModo('letras')}
              aria-label="Volver al modo de letras">
              <MiniCuadratin matriz={undefined} />
              <span className="kbd-key-label kbd-key-label--small">ABC</span>
            </button>
            <button className="kbd-key kbd-key--space" onClick={onAgregarEspacio}
              aria-label="Insertar espacio">
              espacio
            </button>
            <button className="kbd-key kbd-key--action kbd-key--clear"
              onClick={onLimpiar} disabled={vacio} aria-label="Limpiar todo">✕</button>
          </div>
        </>
      )}
    </div>
  );
};
