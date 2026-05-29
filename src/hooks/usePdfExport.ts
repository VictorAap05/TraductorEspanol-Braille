import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import type { TraduccionBraille } from "../services/BrailleTranslateService";

// ── Constantes de layout ────────────────────────────────────────────────────

/** Ancho de la página A4 en milímetros (orientación portrait). */
const PAGE_W = 210;

/** Alto de la página A4 en milímetros (orientación portrait). */
const PAGE_H = 297;

/** Margen general de la página en milímetros, aplicado a los cuatro lados. */
const MARGIN = 15;

/** Ancho útil de contenido, descontando los márgenes laterales. */
const USABLE_W = PAGE_W - MARGIN * 2;

// ── Constantes de celda braille ─────────────────────────────────────────────

/** Radio de cada punto braille en milímetros. */
const DOT_R = 1.8;

/** Distancia entre centros de puntos adyacentes en milímetros. */
const DOT_GAP = 4.5;

/** Padding interno del recuadro de la celda en milímetros. */
const CELL_PAD = 3.5;

/**
 * Ancho total del recuadro de una celda braille en milímetros.
 * Calculado como: `CELL_PAD * 2 + DOT_R * 2 + DOT_GAP` (~15.1 mm).
 */
const CELL_W = CELL_PAD * 2 + DOT_R * 2 + DOT_GAP;

/**
 * Alto total del recuadro de una celda braille en milímetros.
 * Calculado como: `CELL_PAD * 2 + DOT_R * 2 + DOT_GAP * 2` (~19.6 mm).
 */
const CELL_H = CELL_PAD * 2 + DOT_R * 2 + DOT_GAP * 2;

/** Separación horizontal entre celdas braille consecutivas en milímetros. */
const CELL_GAP = 4;

/** Altura reservada debajo de cada celda para mostrar el carácter en tinta. */
const CHAR_H = 5;

/**
 * Altura total de una fila de celdas braille en milímetros.
 * Incluye el recuadro, el carácter inferior y un margen de separación entre filas.
 */
const ROW_H = CELL_H + CHAR_H + 4;

// ── Constantes de color (RGB) ───────────────────────────────────────────────

/** Color del título principal del documento. Equivale a `#30515f`. */
const COLOR_TITULO = [48, 81, 95] as const;

/** Color del texto en tinta (texto original del usuario). */
const COLOR_TEXTO = [30, 30, 30] as const;

/** Color de fondo del recuadro de cada celda braille. */
const COLOR_CELDA_BG = [255, 255, 255] as const;

/** Color del borde del recuadro de cada celda braille. */
const COLOR_CELDA_BOR = [180, 180, 180] as const;

/** Color de un punto braille activo (elevado). */
const COLOR_DOT_ON = [20, 20, 20] as const;

/** Color de un punto braille inactivo (hundido). */
const COLOR_DOT_OFF = [210, 210, 210] as const;

/** Color del carácter en tinta mostrado debajo de cada celda. */
const COLOR_CHAR = [80, 80, 80] as const;

/** Color de fondo general de la página. Equivale a `#dbedeb`. */
const COLOR_FONDO = [219, 237, 235] as const;

/** Color secundario usado para etiquetas y pie de página. */
const COLOR_PIE = [160, 160, 160] as const;

/**
 * Dibuja una celda braille completa en el documento PDF en las coordenadas indicadas.
 *
 * Renderiza el recuadro de la celda, los seis puntos braille (activos e inactivos)
 * y el carácter en tinta correspondiente debajo del recuadro.
 *
 * La distribución de puntos sigue el estándar braille español:
 * - Columna izquierda (de arriba a abajo): puntos 1, 2, 3 → índices 0, 1, 2.
 * - Columna derecha  (de arriba a abajo): puntos 4, 5, 6 → índices 3, 4, 5.
 *
 * @param pdf      - Instancia activa del documento jsPDF sobre la que se dibuja.
 * @param x        - Coordenada horizontal de la esquina superior izquierda del recuadro (mm).
 * @param y        - Coordenada vertical de la esquina superior izquierda del recuadro (mm).
 * @param matriz   - Arreglo de 6 booleanos donde `true` indica punto activo.
 * @param caracter - Carácter en tinta a mostrar debajo de la celda. Si es `"PREF"` no se muestra.
 */
function dibujarCelda(
  pdf: jsPDF,
  x: number,
  y: number,
  matriz: boolean[],
  caracter: string,
): void {
  // Fondo y borde del recuadro
  pdf.setFillColor(...COLOR_CELDA_BG);
  pdf.setDrawColor(...COLOR_CELDA_BOR);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, CELL_W, CELL_H, 1.5, 1.5, "FD");

  // Coordenadas del centro de cada columna y fila de puntos
  const cols = [
    x + CELL_PAD + DOT_R, // columna izquierda (puntos 1, 2, 3)
    x + CELL_PAD + DOT_R + DOT_GAP, // columna derecha   (puntos 4, 5, 6)
  ];
  const rows = [
    y + CELL_PAD + DOT_R, // fila superior
    y + CELL_PAD + DOT_R + DOT_GAP, // fila media
    y + CELL_PAD + DOT_R + DOT_GAP * 2, // fila inferior
  ];

  // Mapeo índice → posición (col, fila)
  // 0→(0,0), 1→(0,1), 2→(0,2), 3→(1,0), 4→(1,1), 5→(1,2)
  const posiciones = [
    [cols[0], rows[0]],
    [cols[0], rows[1]],
    [cols[0], rows[2]],
    [cols[1], rows[0]],
    [cols[1], rows[1]],
    [cols[1], rows[2]],
  ];

  posiciones.forEach(([cx, cy], i) => {
    const color = matriz[i] ? COLOR_DOT_ON : COLOR_DOT_OFF;
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.circle(cx, cy, DOT_R, "F");
  });

  // Carácter en tinta debajo del recuadro (se omite para prefijos)
  if (caracter && caracter !== "PREF") {
    pdf.setFontSize(7);
    pdf.setTextColor(...COLOR_CHAR);
    pdf.text(caracter, x + CELL_W / 2, y + CELL_H + 3.5, { align: "center" });
  }
}

/**
 * Hook personalizado de la **Capa de Adaptación** que encapsula la lógica
 * de exportación a PDF del traductor braille.
 *
 * Genera el documento PDF programáticamente mediante `jsPDF`, sin capturar
 * el DOM, respetando el Principio de Responsabilidad Única: este hook solo
 * se ocupa de la construcción y descarga del archivo.
 *
 * El documento generado incluye:
 * - Encabezado con título y texto original en tinta.
 * - Celdas braille dibujadas vectorialmente con soporte de múltiples filas y páginas.
 * - Pie de página con fecha de generación y numeración.
 *
 * @example
 * ```tsx
 * const { exportarPdf, exportando } = usePdfExport();
 *
 * <button onClick={() => exportarPdf(textoOriginal, traduccion)} disabled={exportando}>
 *   Exportar PDF
 * </button>
 * ```
 *
 * @returns Un objeto con:
 * - `exportarPdf` — función que construye y descarga el PDF.
 * - `exportando`  — `true` mientras el PDF se está generando; útil para deshabilitar el botón.
 */
export const usePdfExport = () => {
  const [exportando, setExportando] = useState(false);

  /**
   * Construye y descarga el documento PDF con la señalética braille.
   *
   * @param textoOriginal - Texto en español ingresado por el usuario.
   * @param traduccion    - Arreglo de nodos braille producido por {@link BrailleTranslatorService}.
   */
  const exportarPdf = useCallback(
    (textoOriginal: string, traduccion: TraduccionBraille[]): void => {
      if (!traduccion.length) return;
      setExportando(true);

      try {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // ── Fondo general ────────────────────────────────────────────────────
        pdf.setFillColor(...COLOR_FONDO);
        pdf.rect(0, 0, PAGE_W, PAGE_H, "F");

        // ── Encabezado ───────────────────────────────────────────────────────
        let cursorY = MARGIN + 2;

        pdf.setFontSize(20);
        pdf.setTextColor(...COLOR_TITULO);
        pdf.setFont("helvetica", "bold");
        pdf.text("Señalética Braille", PAGE_W / 2, cursorY, {
          align: "center",
        });
        cursorY += 7;

        // Línea separadora bajo el título
        pdf.setDrawColor(...COLOR_TITULO);
        pdf.setLineWidth(0.5);
        pdf.line(MARGIN, cursorY, PAGE_W - MARGIN, cursorY);
        cursorY += 5;

        // Etiqueta y texto en tinta
        pdf.setFontSize(9);
        pdf.setTextColor(...COLOR_PIE);
        pdf.setFont("helvetica", "normal");
        pdf.text("Texto en tinta:", MARGIN, cursorY);
        cursorY += 5;

        pdf.setFontSize(16);
        pdf.setTextColor(...COLOR_TEXTO);
        pdf.setFont("helvetica", "bold");
        const lineas = pdf.splitTextToSize(textoOriginal, USABLE_W);
        pdf.text(lineas, MARGIN, cursorY);
        cursorY += lineas.length * 7 + 6;

        // Línea separadora antes del braille
        pdf.setDrawColor(...COLOR_CELDA_BOR);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN, cursorY, PAGE_W - MARGIN, cursorY);
        cursorY += 6;

        // Etiqueta braille
        pdf.setFontSize(9);
        pdf.setTextColor(...COLOR_PIE);
        pdf.setFont("helvetica", "normal");
        pdf.text("Texto en Braille:", MARGIN, cursorY);
        cursorY += 5;

        // ── Celdas Braille ───────────────────────────────────────────────────
        const celdasPorFila = Math.floor(
          (USABLE_W + CELL_GAP) / (CELL_W + CELL_GAP),
        );

        let x = MARGIN;
        let filaStart = cursorY;

        traduccion.forEach((nodo, idx) => {
          // Salto de fila al superar el ancho útil
          if (idx > 0 && idx % celdasPorFila === 0) {
            filaStart += ROW_H + 2;
            x = MARGIN;

            // Salto de página al superar el alto útil
            if (filaStart + ROW_H > PAGE_H - MARGIN - 10) {
              pdf.addPage();
              pdf.setFillColor(...COLOR_FONDO);
              pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
              filaStart = MARGIN;
              x = MARGIN;
            }
          }

          const caracter = nodo.esPrefijo ? "PREF" : nodo.caracterOriginal;
          dibujarCelda(pdf, x, filaStart, nodo.matriz, caracter);
          x += CELL_W + CELL_GAP;
        });

        // ── Pie de página ────────────────────────────────────────────────────
        const totalPages = pdf.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          pdf.setPage(p);
          pdf.setFontSize(7);
          pdf.setTextColor(...COLOR_PIE);
          pdf.setFont("helvetica", "normal");
          pdf.text(
            `Generado el ${new Date().toLocaleDateString("es-EC", { dateStyle: "long" })}   |   Página ${p} de ${totalPages}`,
            PAGE_W / 2,
            PAGE_H - 6,
            { align: "center" },
          );
        }

        // ── Descarga ─────────────────────────────────────────────────────────
        const nombre = `braille_${textoOriginal.slice(0, 20).replace(/\s+/g, "_") || "señaletica"}.pdf`;
        pdf.save(nombre);
      } finally {
        setExportando(false);
      }
    },
    [],
  );

  return { exportarPdf, exportando };
};
