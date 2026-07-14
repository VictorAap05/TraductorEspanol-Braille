# Casos de Prueba: Traductor Español ↔ Braille

**Equipo 2**


---

## 1. Primera Iteración de Pruebas

En esta primera fase se probaron diferentes cadenas de texto, incluyendo palabras en minúsculas, siglas, números decimales y fechas.

**Casos ingresados:**
* `sandia` 
* `FIS-EPN` 
* `20,15` 
* `46.37` 
* `25-11-2025` 
* `26-11-2025` 

**Resultado de la prueba:** No cumple. Se detectaron problemas en la representación visual de los puntos del sistema Braille.

<img width="885" height="498" alt="image" src="https://github.com/user-attachments/assets/b31c67ac-e2e4-46a1-a222-120fdaa7f0ae" />

<img width="885" height="498" alt="image" src="https://github.com/user-attachments/assets/41fa9536-eed6-4618-98ee-c3f565aab71d" />


### Análisis y Solución 
Se identificó un problema con el orden de lectura visual de los índices de la matriz para el renderizado en CSS Grid. 
* El estándar Braille numera los puntos en columnas (izquierda 1-2-3, derecha 4-5-6), pero `grid-auto-flow` por defecto llena las filas.
* Para solucionar esto, se implementó un arreglo que reordena los índices, asegurando que la grilla muestre los puntos en la disposición física correcta.

**Fragmento de código implementado:**
```javascript
/**
 * Índice matriz → posición visual
 * [0]=pto1  [3]=pto4
 * [1]=pto2  [4]=pto5
 * [2]=pto3  [5]=pto6
 */
const ORDEN_VISUAL = [0, 3, 1, 4, 2, 5];

{ORDEN_VISUAL.map((matrizIndex, posicion) => (
  <div
    key={posicion}
    className={`braille-dot ${matriz[matrizIndex] ? 'active' : 'inactive'}`}
  />
))}
```

## 2. Segunda Iteración de Pruebas

Tras aplicar la primera corrección visual, se procedió a realizar una nueva ronda de pruebas con textos variados.

**Casos ingresados:**
* `Buenas tardes!`
⠨ ⠃ ⠥ ⠑ ⠝ ⠁ ⠎ ⠀ ⠞ ⠁ ⠗ ⠙ ⠑ ⠎ ⠖
<img width="634" height="442" alt="image" src="https://github.com/user-attachments/assets/1f4fbddb-640e-42dc-a656-2c9fcd0b7fc6" />

* `nov 2025`
⠝ ⠕ ⠧ ⠀ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="638" height="393" alt="image" src="https://github.com/user-attachments/assets/31813fb9-f705-4f1a-a10b-c9c69d688e59" />


* `Niño`
⠨ ⠝ ⠊ ⠻ ⠕
<img width="595" height="568" alt="image" src="https://github.com/user-attachments/assets/12aa047f-22d0-44ee-8d10-83e874d7236d" />

* `FIS-EPN`
⠨ ⠨ ⠋ ⠊ ⠎ ⠤ ⠑ ⠏ ⠝
<img width="641" height="434" alt="image" src="https://github.com/user-attachments/assets/c303018e-2181-4b3f-a63f-bc9821821154" />

* `20,15`
⠼ ⠃ ⠹ ⠂ ⠼ ⠁ ⠑
<img width="588" height="455" alt="image" src="https://github.com/user-attachments/assets/1f9b524e-cf9f-4cb0-8957-da5c24e6d348" />

* `46.37`
⠼ ⠙ ⠋ ⠄ ⠼ ⠉ ⠛
<img width="580" height="444" alt="image" src="https://github.com/user-attachments/assets/d4d3f9c9-e092-4a1e-9cfa-4e999cc02b46" />

* `25-11-2025`
⠼ ⠃ ⠑ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="626" height="417" alt="image" src="https://github.com/user-attachments/assets/c211d2b7-cf68-4534-9efe-0613ec185542" />

* `sandía`
⠎ ⠁ ⠝ ⠙ ⠌ ⠁
<img width="638" height="556" alt="image" src="https://github.com/user-attachments/assets/0ad31e1f-132f-4574-b7a5-e32e1b7a1ca1" />

* `26-11-2025`
⠼ ⠃ ⠋ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="648" height="436" alt="image" src="https://github.com/user-attachments/assets/755a3b32-6c69-4a44-b6ac-a1bb6575c859" />


**Resultado de la prueba:** No cumple. Se detectaron dos fallos principales:
1. En las númeraciones la (`,` y `.`) volvian a generar el prefijo de número.
2. Cuando una palabra completa estaba en mayúsculas (ej. `FIS-EPN`), no se aplicaba correctamente el doble prefijo de mayúscula al inicio.

### Análisis y Solución

* **Corrección de la coma y punto:** Se soluciono con el siguiente bloque de código:

```javascript
// ── Signos decimales o miles (. ,) dentro de secuencia numérica (no reinician el modo número) ──
      if (enModoNumero && (char === "." || char === ",")) {
        const matrizPunto = BrailleDictionary[char];
        if (matrizPunto) {
          resultado.push(this.crearNodo(char, matrizPunto));
        }
        i++;
        continue;
      }
```

* **Corrección de palabras en mayúsculas:** El sistema anterior detectaba las mayúsculas carácter por carácter. Se solucionó implementando una expresión regular (regex) de detección de límites de palabra (de `[A-Za-z...]` a `[A-Za-z...-]`), incluyendo el guion para evitar que se rompa la secuencia al encontrarlo en palabras compuestas o siglas.

## 3. Tercera Iteración de Pruebas

Una vez aplicadas las correcciones sobre la traducción del cero y los prefijos de mayúscula, se repitieron los mismos casos de prueba para validar el sistema.

**Casos ingresados:**
* `Buenas tardes!`
⠨ ⠃ ⠥ ⠑ ⠝ ⠁ ⠎ ⠀ ⠞ ⠁ ⠗ ⠙ ⠑ ⠎ ⠖
<img width="623" height="418" alt="image" src="https://github.com/user-attachments/assets/6c257787-2bb4-4feb-be79-0d3c3db4fc0c" />

* `nov 2025`
⠝ ⠕ ⠧  ⠼ ⠃ ⠚ ⠃ ⠑
<img width="967" height="653" alt="WhatsApp Image 2026-05-29 at 8 56 37 AM" src="https://github.com/user-attachments/assets/4cd0817f-be30-4f3e-83d8-534ea39d44f0" />

* `Niño`
⠨ ⠝ ⠊ ⠻ ⠕
<img width="599" height="576" alt="image" src="https://github.com/user-attachments/assets/1f194ffc-7abf-47ea-8da3-cba2104af993" />

* `FIS-EPN`
⠨ ⠨ ⠋ ⠊ ⠎ ⠤ ⠑ ⠏ ⠝
<img width="605" height="373" alt="image" src="https://github.com/user-attachments/assets/fc6eee22-ffeb-4ee6-b4fc-9dcd0828a102" />

* `20,15`
⠼ ⠃ ⠚ ⠂ ⠁ ⠑
<img width="632" height="615" alt="WhatsApp Image 2026-05-29 at 8 57 40 AM" src="https://github.com/user-attachments/assets/ec882423-8fdb-4dc6-87f3-e29f6f57f1a2" />


* `46.37`
⠼ ⠙ ⠋ ⠄ ⠉ ⠛
<img width="622" height="596" alt="WhatsApp Image 2026-05-29 at 8 58 25 AM" src="https://github.com/user-attachments/assets/f981985b-e77c-47c7-8818-82906085289b" />

* `25-11-2025`
⠼ ⠃ ⠑ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠚ ⠃ ⠑
<img width="934" height="628" alt="WhatsApp Image 2026-05-29 at 8 59 14 AM" src="https://github.com/user-attachments/assets/c0e9c5e1-3592-4a16-b4b2-5ae8ef431fed" />

* `sandía`
⠎ ⠁ ⠝ ⠙ ⠌ ⠁
<img width="629" height="541" alt="image" src="https://github.com/user-attachments/assets/c6ecbe7a-261f-4213-81ee-e5d5cc2fcead" />

* `26-11-2025`
⠼ ⠃ ⠋ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠚ ⠃ ⠑
<img width="910" height="641" alt="WhatsApp Image 2026-05-29 at 8 59 35 AM" src="https://github.com/user-attachments/assets/d3ea2042-521e-4352-a77b-7604d36cae93" />



**Resultado de la prueba:** Sin problemas. Todas las validaciones de números, caracteres especiales y prefijos pasaron exitosamente.

## 4. Cuarta Iteración de Pruebas

Con la incorporación de la traducción bidireccional (Braille → Español) y la exportación en modo espejado para impresión en relieve (HU06 y HU07), se realizaron pruebas manuales sobre ambas funcionalidades nuevas.

### Traducción Braille → Español

Caso de prueba anteior, con la nueva versión, traducido de braille a español y viceversa.
* `sandía`
⠎ ⠁ ⠝ ⠙ ⠌ ⠁

<img width="1285" height="861" alt="Captura de pantalla 2026-07-14 140757" src="https://github.com/user-attachments/assets/253b63ff-2961-4645-843c-378e5279bd69" />
<img width="1262" height="517" alt="Captura de pantalla 2026-07-14 140644" src="https://github.com/user-attachments/assets/7ed57654-0dac-4e50-ae1d-b7382e3af695" />



**Caso ingresado:** Cambio de dirección con el botón de intercambio, e ingreso de "donde es la fiesta" mediante el teclado Braille en pantalla.

<img width="300" alt="Botón para Intercambiar de Traducción" src="screenshot/Boton%20para%20Intercambiar%20de%20Traducción.jpg" />
<img width="400" alt="Teclado en Pantalla" src="screenshot/Teclado%20en%20Pantalla.jpg" />
<img width="500" alt="Ejemplo Braille a Español" src="screenshot/Ejemplo%20Braille%20a%20Español.jpg" />

**Resultado de la prueba:** Sin problemas. El panel izquierdo acumuló correctamente las celdas Braille ingresadas por teclado, y el panel derecho mostró el texto en español equivalente ("donde es la fiesta") en tiempo real.

### Exportación en Modo Espejado (Relieve)

**Caso ingresado:** Traducción de "Traducción" a Braille, exportada con el botón "Exportar para relieve (espejado)".

<img width="500" alt="Impresión en Espejo" src="screenshot/Impresión%20en%20Espejo.jpg" />

**Resultado de la prueba:** Sin problemas. El PDF generado invirtió correctamente el orden horizontal de las celdas y las columnas de puntos de cada una, y se tituló "Señalética Braille - Para Imprimir" para diferenciarlo del PDF normal.

