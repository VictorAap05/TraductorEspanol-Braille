# Análisis de Cambios - Traductor Español ↔ Braille

**Equipo 2**

Este documento consolida los cambios realizados sobre el proyecto a lo largo de las iteraciones de desarrollo y pruebas, comparando el estado actual contra la primera iteración: qué cambió en los requisitos (Historias de Usuario), qué se encontró en las pruebas manuales, qué se corrigió y qué queda pendiente por mejorar.

---

## 1. Cambios en los Requisitos (Historias de Usuario)

### 1.1. Alcance de la Épica

| | Primera iteración | Estado actual |
| :--- | :--- | :--- |
| **Épica** | Transcribir textos de español a braille incluyendo números, abecedario, vocales acentuadas, y signos básicos. | Transcribir textos de español a braille **y viceversa**, incluyendo números, abecedario, vocales acentuadas, signos básicos, **y su exportación en PDF (normal y espejado para impresión en relieve)**. |

El alcance original solo contemplaba la traducción unidireccional (español → braille). Tras validar esa base, el alcance se amplió para incluir la traducción inversa y la exportación en dos variantes de PDF, lo cual llevó a la creación de nuevos requisitos.

### 1.2. Requisitos que se mantuvieron sin cambios

Las historias HU01 a HU04 (transcripción del abecedario, vocales acentuadas y ñ, números con signo de número, y detección de mayúsculas) se mantienen igual en su redacción y criterios de aceptación. Su comportamiento fue el que se validó y ajustó durante las iteraciones de prueba manual (ver sección 2).

### 1.3. Requisito modificado: HU05

| | Primera iteración | Estado actual |
| :--- | :--- | :--- |
| **Criterio de éxito** | El sistema debe dibujar un rectángulo por caracter, con puntos activos **rellenos en negro** y los inactivos **en gris claro**. | El sistema debe dibujar un rectángulo por caracter, con puntos activos **en color teal/cian** y los inactivos **en gris oscuro**, sobre una **tarjeta de fondo oscuro**. |

Este cambio no es funcional sino de diseño visual (se migró la interfaz a un esquema de tema oscuro). El criterio de aceptación se actualizó para reflejar la paleta de colores realmente implementada.

### 1.4. Requisitos nuevos: HU06 y HU07

Estas dos historias no existían en la primera iteración y se agregaron para cubrir la ampliación de alcance de la épica:

* **HU06 - Exportación en modo espejado:** permite exportar la señalética en orden horizontal invertido y con las columnas de puntos (1-2-3 / 4-5-6) intercambiadas, para poder perforar el papel desde el reverso y que el relieve quede correcto al voltear la hoja.
* **HU07 - Traducción inversa (Braille → Español):** permite invertir la dirección de traducción mediante un botón de intercambio y componer texto usando un teclado Braille en pantalla, mostrando en tiempo real el texto en español equivalente.

### 1.5. Impacto en el diseño arquitectónico

La arquitectura de capas (Componentes / Adaptación / Lógica de Negocio) **se mantiene igual** frente a la primera iteración; no se agregaron capas ni se modificó el patrón general. Lo que cambió fue el contenido interno de esas capas para soportar HU06 y HU07:

* **Capa de Adaptación (Hooks):** `useBrailleTranslator` se amplió para encapsular también la dirección de traducción activa (español→braille / braille→español), y `usePdfExport` se extendió para incluir la variante espejada de exportación (`exportarPdfEspejado`).
* **Capa de Componentes:** se incorporó un módulo de captura de entradas Braille (teclado en pantalla) para soportar la dirección inversa.
* **Capa de Lógica de Negocio:** `BrailleTranslatorService` y `BrailleDictionary` se actualizaron para dar soporte a la traducción inversa y a las correcciones descritas en la sección 2.

En resumen: es una actualización del "back" de la aplicación cliente (lógica de traducción, hooks y componentes), no un rediseño de la arquitectura.

---

## 2. Análisis de Casos de Prueba Manuales

Se ejecutaron cuatro iteraciones de pruebas manuales sobre el traductor, cada una motivada por los defectos detectados en la iteración anterior.

### Iteración 1 - Resultado: No cumple

**Casos probados:** `sandia`, `FIS-EPN`, `20,15`, `46.37`, `25-11-2025`, `26-11-2025`.

**Defecto encontrado:** la disposición visual de los puntos de la celda Braille no correspondía al estándar físico (columnas 1-2-3 / 4-5-6), porque `grid-auto-flow` de CSS Grid llena por defecto en orden de filas.

**Corrección aplicada:** se introdujo un arreglo `ORDEN_VISUAL = [0, 3, 1, 4, 2, 5]` para remapear el índice de la matriz lógica a la posición visual correcta en el grid.

### Iteración 2 - Resultado: No cumple

**Casos probados:** `Buenas tardes!`, `nov 2025`, `Niño`, `FIS-EPN`, `20,15`, `46.37`, `25-11-2025`, `sandía`, `26-11-2025`.

**Defectos encontrados:**
1. La coma (`,`) y el punto (`.`) dentro de una secuencia numérica reiniciaban el modo número, generando un prefijo de número adicional e incorrecto (visible en `20,15` y `46.37`).
2. En palabras completas en mayúsculas con guion (ej. `FIS-EPN`), no se aplicaba correctamente el doble prefijo de mayúscula al inicio de la palabra.

**Correcciones aplicadas:**
1. Se agregó una condición para que, estando en modo número activo, los caracteres `.` y `,` se traduzcan directamente sin reiniciar ni repetir el prefijo numérico.
2. Se reemplazó la detección de mayúsculas caracter por caracter por una expresión regular de límites de palabra que incluye el guion, evitando que se rompa la secuencia en palabras compuestas o siglas.

### Iteración 3 - Resultado: Sin problemas

Se repitieron los mismos casos de las iteraciones anteriores (incluyendo el cero y la secuencia completa en mayúsculas) para confirmar la corrección. Todas las validaciones de números, caracteres especiales y prefijos de mayúscula pasaron exitosamente.

### Iteración 4 - Resultado: Sin problemas

Con la incorporación de HU06 y HU07, se probaron manualmente las dos funcionalidades nuevas:

* **Traducción Braille → Español:** se cambió la dirección con el botón de intercambio y se ingresó "donde es la fiesta" con el teclado Braille en pantalla. El panel izquierdo acumuló correctamente las celdas y el panel derecho mostró el texto en español equivalente en tiempo real.
* **Exportación en modo espejado:** se tradujo "Traducción" y se exportó con el botón "Exportar para relieve (espejado)". El PDF generado invirtió correctamente el orden horizontal y las columnas de puntos de cada celda, y usó el título distintivo "Señalética Braille - Para Imprimir".

### 2.1. Resumen de defectos por iteración

| Iteración | Defecto | Causa raíz | Estado |
| :---: | :--- | :--- | :---: |
| 1 | Disposición visual de puntos incorrecta | `grid-auto-flow` llenaba por filas en vez de columnas | Corregido |
| 2 | `,` y `.` reiniciaban el modo número | Falta de excepción para signos decimales/de miles dentro de una secuencia numérica | Corregido |
| 2 | Palabras en mayúsculas con guion no recibían doble prefijo | Detección de mayúsculas caracter por caracter, sin reconocer límites de palabra compuesta | Corregido |
| 3 | — | Validación de regresión sobre los casos 1 y 2 | Sin problemas |
| 4 | — | Validación de HU06 (espejado) y HU07 (Braille → Español) | Sin problemas |
