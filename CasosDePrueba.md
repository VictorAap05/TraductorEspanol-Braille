# Casos de Prueba: Traductor Español - Braille 

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
const ORDEN_VISUAL = [0, 3, 1, 4, 2, 5]; // [cite: 48, 49, 50, 51, 52, 55]

{ORDEN_VISUAL.map((matrizIndex, posicion) => ( // 
  <div
    key={posicion} //
    className={`braille-dot ${matriz[matrizIndex] ? [cite_start]'active' : 'inactive'}`} // 
 /> //
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
1. El número cero (`0`) no aparecía correctamente traducido.
2. Cuando una palabra completa estaba en mayúsculas (ej. `FIS-EPN`), no se aplicaba correctamente el doble prefijo de mayúscula al inicio.

### Análisis y Solución

* **Corrección del número cero:** El error ocurría porque el sistema estaba utilizando la codificación del sistema anglosajón para el cero (`[2, 4, 5]`). Se corrigió actualizando la matriz al estándar del Braille español: `'0': crearCuadratin([1, 4, 5, 6])`.
* **Corrección de palabras en mayúsculas:** El sistema anterior detectaba las mayúsculas carácter por carácter. Se solucionó implementando una expresión regular (regex) de detección de límites de palabra (de `[A-Za-z...]` a `[A-Za-z...-]`), incluyendo el guion para evitar que se rompa la secuencia al encontrarlo en palabras compuestas o siglas.
))} //

## 3. Tercera Iteración de Pruebas

Una vez aplicadas las correcciones sobre la traducción del cero y los prefijos de mayúscula, se repitieron los mismos casos de prueba para validar el sistema.

**Casos ingresados:**
* `Buenas tardes!`
⠨ ⠃ ⠥ ⠑ ⠝ ⠁ ⠎ ⠀ ⠞ ⠁ ⠗ ⠙ ⠑ ⠎ ⠖
<img width="623" height="418" alt="image" src="https://github.com/user-attachments/assets/6c257787-2bb4-4feb-be79-0d3c3db4fc0c" />

* `nov 2025`
⠝ ⠕ ⠧ ⠀ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="599" height="370" alt="image" src="https://github.com/user-attachments/assets/f7783b8d-5545-4ef6-ac41-df8730373ad4" />

* `Niño`
⠨ ⠝ ⠊ ⠻ ⠕
<img width="599" height="576" alt="image" src="https://github.com/user-attachments/assets/1f194ffc-7abf-47ea-8da3-cba2104af993" />

* `FIS-EPN`
⠨ ⠨ ⠋ ⠊ ⠎ ⠤ ⠑ ⠏ ⠝
<img width="605" height="373" alt="image" src="https://github.com/user-attachments/assets/fc6eee22-ffeb-4ee6-b4fc-9dcd0828a102" />

* `20,15`
⠼ ⠃ ⠹ ⠂ ⠼ ⠁ ⠑
<img width="616" height="462" alt="image" src="https://github.com/user-attachments/assets/c1c48325-af1b-4c9c-85ad-1c1298ff11d7" />

* `46.37`
⠼ ⠙ ⠋ ⠄ ⠼ ⠉ ⠛
<img width="626" height="469" alt="image" src="https://github.com/user-attachments/assets/390a79d0-6ed3-4832-8da2-94390509c5aa" />

* `25-11-2025`
⠼ ⠃ ⠑ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="628" height="427" alt="image" src="https://github.com/user-attachments/assets/b52c8a74-22a7-4f3c-9a25-33df9ea3200c" />

* `sandía`
⠎ ⠁ ⠝ ⠙ ⠌ ⠁
<img width="629" height="541" alt="image" src="https://github.com/user-attachments/assets/c6ecbe7a-261f-4213-81ee-e5d5cc2fcead" />

* `26-11-2025`
⠼ ⠃ ⠋ ⠤ ⠼ ⠁ ⠁ ⠤ ⠼ ⠃ ⠹ ⠃ ⠑
<img width="636" height="429" alt="image" src="https://github.com/user-attachments/assets/964565b4-d4ee-4e94-b4e3-88321c681be5" />


**Resultado de la prueba:** Sin problemas. Todas las validaciones de números, caracteres especiales y prefijos pasaron exitosamente.

