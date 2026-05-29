# Manual de Usuario - Traductor Español a Braille

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Interfaz de Usuario](#interfaz-de-usuario)
3. [Cómo Usar el Traductor](#cómo-usar-el-traductor)
4. [Características Principales](#características-principales)
5. [Reglas del Sistema Braille Español](#reglas-del-sistema-braille-español)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Exportar a PDF](#exportar-a-pdf)
8. [Preguntas Frecuentes](#preguntas-frecuentes)
9. [Resolución de Problemas](#resolución-de-problemas)

---

## Introducción

Traductor Español - Braille es una aplicación web interactiva que convierte texto en español a su equivalente en el sistema de lectoescritura Braille. 

Este sistema permite:
- Traducir cualquier texto en español a Braille en tiempo real
- Visualizar las celdas Braille de forma clara y detallada
- Exportar la traducción a un archivo PDF
- Comprender las reglas de escritura Braille española

### ¿Qué es el Braille?

El Braille es un sistema de lectoescritura táctil utilizado por personas ciegas o con discapacidad visual. Cada carácter se representa mediante una **celda Braille** de 6 puntos organizados en 2 columnas y 3 filas:

```
Columna 1  Columna 2
Punto 1  |  Punto 4
Punto 2  |  Punto 5
Punto 3  |  Punto 6
```

Los puntos pueden estar en relieve (elevados) o hundidos para formar diferentes combinaciones que representan letras, números, signos de puntuación, etc.

---

## Interfaz de Usuario

La aplicación posee una interfaz clara y funcional diseñada para facilitar la traducción de texto al sistema Braille.

![Interfaz Principal Completa](screenshot/Interfaz%20Principal%20Completa.jpg)

### Componentes Principales

1. Título Principal
   - "Traductor Español - Braille"
   - Se muestra en la parte superior de la interfaz

2. Sección de Entrada
   - Un cuadro de texto extenso donde se ingresa el contenido a traducir
   - Incluye indicación de tipos de contenido soportados
   - Acepta cualquier texto en español

3. Área de Visualización
   - Muestra las celdas Braille traducidas
   - Se actualiza en tiempo real mientras se escribe
   - Cada celda contiene 6 puntos que se muestran en negro (activos) o gris (inactivos)
   - Debajo de cada celda aparece el carácter original en tinta para referencia

4. Botón de Exportación
   - "Exportar traducción a PDF"
   - Aparece únicamente cuando hay contenido traducido
   - Genera un documento PDF descargable

5. Fondo Animado
   - Elementos visuales decorativos que mejoran la experiencia del usuario
   - Proporciona una interfaz atractiva sin interferir con la funcionalidad

---

## Cómo Usar el Traductor

### Paso 1: Ingrese el Texto

Haga clic en el área de texto e ingrese el contenido que desea traducir:

```
"Hola mundo"
"Número: 2024"
"¡Hola, estoy aprendiendo Braille!"
```

![Area de Entrada de Texto](screenshot/Area%20de%20Entrada%20de%20Texto.jpg)

### Paso 2: Observe la Traducción

La traducción a Braille aparecerá inmediatamente debajo, mostrando:
- Las celdas Braille con sus 6 puntos
- El carácter original debajo de cada celda
- Los prefijos especiales para números y mayúsculas

![Traducción en Tiempo Real](screenshot/Traducción%20en%20Tiempo%20Real.jpg)

### Paso 3: Interprete las Celdas

- Puntos negros: Puntos que están en relieve (activos)
- Puntos grises: Puntos que no están en relieve (inactivos)
- Si una celda está completamente gris: espacio en blanco

![Celdas Braille Detalladas](screenshot/Celdas%20Braille%20Detalladas.jpg)

---

## Características Principales

### 1. Traducción en Tiempo Real
- La traducción se actualiza automáticamente mientras se escribe
- No requiere presionar botones adicionales
- Ofrece respuesta rápida y reactiva

### 2. Soporte Completo del Español
- Letras minúsculas (a-z)
- Letras mayúsculas (A-Z)
- Números (0-9)
- Vocales acentuadas (á, é, í, ó, ú)
- Letra ñ
- Signos de puntuación (. , ; : ! ? " ' -)
- Espacios en blanco

### 3. Reglas Automáticas

El sistema aplica automáticamente las reglas del Braille español:

#### Prefijo de Mayúsculas
- Letra única en mayúsculas: Se añade un prefijo simple
- Palabra completa en mayúsculas: Se añade un prefijo doble al inicio

#### Prefijo de Números
- Los números se anteponen con un prefijo especial
- Solo se añade al inicio de cada secuencia numérica
- Los espacios reinician el contador

### 4. Indicadores Visuales


- Prefijos: Se etiquetan como "PREF" para identificación

---

## Reglas del Sistema Braille Español

### Estructura de una Celda Braille

Cada símbolo Braille (cuadratín) contiene 6 puntos distribuidos de la siguiente manera:

```
Punto 1  Punto 4
Punto 2  Punto 5
Punto 3  Punto 6
```

### Serie de Letras

Las letras se organizan en series según los puntos activos:

#### Serie 1 (Puntos 1-2-4-5)
```
a = Punto 1
b = Puntos 1,2
c = Puntos 1,4
d = Puntos 1,4,5
e = Puntos 1,5
f = Puntos 1,2,4
...
```

### Números

Los números comparten representación con las letras de la Serie 1, pero se anteceden de un prefijo de número:

```
1 = Prefijo + a
2 = Prefijo + b
3 = Prefijo + c
...
0 = Prefijo + j
```

### Mayúsculas

Las letras mayúsculas se anteceden de un prefijo de mayúscula:

```
A = Prefijo mayúscula + a
B = Prefijo mayúscula + b
...
```

Caso especial: Si una palabra completa está en mayúsculas, se utiliza un doble prefijo de mayúscula solo al inicio:

```
PALABRA = Doble prefijo + p,a,l,a,b,r,a
Palabra = Prefijo + p, a, l, a, b, r, a
```

---

## Ejemplos de Uso

### Ejemplo 1: Texto Simple

Entrada:
```
Hola
```

Salida Braille:
```
[PREF] [H] [o] [l] [a]
```

El carácter "H" se encuentra en mayúscula, por lo que aparece el prefijo de mayúscula.
![Ejemplo 1](screenshot/Ejemplo%201.jpg)

---

### Ejemplo 2: Números

Entrada:
```
El año es 2026
```

Salida Braille:
```
[E] [l] [espacio] [a] [ñ] [o] [espacio] [e] [s] [espacio] [PREF] [2] [0] [2] [6]
```

Los números reciben un prefijo al inicio de la secuencia numérica.

![Ejemplo 2](screenshot/Ejemplo%202.jpg)

---

### Ejemplo 3: Palabra Completa en Mayúsculas

Entrada:
```
BUENOS DIAS
```

Salida Braille:
```
[DOBLE PREF] [B] [U] [E] [N] [O] [S] [espacio] [D] [I] [A] [S]
```

Únicamente el primer prefijo es doble; los caracteres restantes no llevan prefijo adicional.

![Palabra Completamente en Mayúsculas](screenshot/Palabra%20Completamente%20en%20Mayúsculas.jpg)

---

### Ejemplo 4: Signos de Puntuación

Entrada:
```
¡Hola!
```

Salida Braille:
```
[!] [PREF] [H] [o] [l] [a] [!]
```

Los signos de puntuación se colocan en sus posiciones correspondientes.
![Ejemplo 4](screenshot/Ejemplo%204.jpg)

---

### Ejemplo 5: Vocales Acentuadas y Letra Ñ

Entrada:
```
Mañana será
```

Salida Braille:
```
[PREF] [M] [a] [ñ] [a] [n] [a] [espacio] [s] [e] [r] [á]
```

El sistema maneja correctamente todas las vocales acentuadas y la letra ñ.

![Vocales Acentuadas y Letra Ñ](screenshot/Vocales%20Acentuadas%20y%20Letra%20Ñ.jpg)

---

## Exportar a PDF

### Paso 1: Genere la Traducción

Ingrese el texto que desea traducir en el área de entrada.

### Paso 2: Haga clic en el Botón de Exportación

Cuando haya contenido traducido, verá un botón que dice:
```
"Exportar traducción a PDF"
```

Haga clic en él.

![Botón de Exportación Visible](screenshot/Botón%20de%20Exportación%20Visible.jpg)

### Paso 3: Descargue el PDF

El navegador descargará automáticamente un archivo PDF con:

- Título: "Traductor Español - Braille"
- Texto original: El texto ingresado
- Celdas Braille: Todas las celdas traducidas con:
  - Los 6 puntos de cada celda (puntos negros = activos)
  - El carácter original en tinta debajo
- Formato A4: Diseño profesional en tamaño de página estándar
- Márgenes: Espaciado adecuado para lectura
- Colores: Diferenciación visual clara entre puntos activos e inactivos

![PDF Generado (Preview)](screenshot/PDF%20Generado%20(Preview).jpg)

### Características del PDF

- Formato A4 en orientación vertical
- Celdas bien definidas con bordes claros
- Texto original legible debajo de cada celda
- Optimizado para impresión
- Descargable directamente desde el navegador

---

## Preguntas Frecuentes

### ¿Puedo traducir caracteres acentuados?

Sí, el sistema soporta todas las vocales acentuadas españolas (á, é, í, ó, ú) y la letra ñ.

---

### ¿Qué pasa si escribo caracteres que no están en el diccionario?

Los caracteres no soportados se muestran con un fondo especial para indicar que no tienen representación en Braille. Se renderizarán como celdas vacías.

---

### ¿Cómo funcionan los números?

Los números se representan con las letras a-i (para 1-9) y j (para 0), antecedidos por un prefijo de número. El prefijo solo se añade al inicio de cada secuencia numérica.

---

### ¿Puedo copiar el texto del Braille?

El Braille se visualiza como elementos gráficos (celdas), no como texto seleccionable. Use la función de exportación a PDF para guardar o imprimir.

---

### ¿El navegador guarda el historial de traducciones?

No, el historial se borra al recargar la página. Si necesita guardar una traducción, exporte a PDF.

---

### ¿Funciona sin conexión a internet?

Una vez que la página se carga, funciona completamente sin internet. Sin embargo, se requiere conexión a internet para la descarga inicial.

---

### ¿Puedo traducir textos muy largos?

Sí, no hay límite de caracteres. Sin embargo, textos muy largos pueden generar PDFs de varias páginas.

---

### ¿Cómo exporto a PDF sin visualización previa?

Haga clic directamente en el botón "Exportar traducción a PDF". El navegador descargará el PDF automáticamente.

---
