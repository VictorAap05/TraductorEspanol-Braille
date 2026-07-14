# Diseño Arquitectónico

## 1. Introducción y Alcance

**Objetivo:** Describir la arquitectura de alto nivel del sistema Traductor Español-Braille, estableciendo las responsabilidades de cada capa del cliente y los principios de diseño aplicados durante su desarrollo.

**Alcance:** El diseño cubre la totalidad de la aplicación cliente: la traducción de texto en español a Braille y su inversa (Braille a español mediante teclado en pantalla), la representación visual del cuadratín Braille, y la generación de señalética exportable en PDF, incluyendo el modo espejado para impresión en relieve. El sistema opera íntegramente en el navegador, sin backend ni persistencia de datos.

## 2. Diseño Arquitectónico de Alto Nivel, Arquitectura basada en componentes

El sistema implementa una arquitectura basada en capas desacopladas dentro del entorno del cliente, garantizando el cumplimiento del Principio de Responsabilidad Única y facilitando el mantenimiento y testeo modular del software.

### 2.1. Descripción de las Capas

* *Capa de Componentes (React):* Se encarga exclusivamente de la experiencia de usuario y el renderizado visual de la interfaz. Está compuesta por módulos especializados en la captura de entradas de texto en tinta, la captura de entradas Braille mediante un teclado en pantalla (para la dirección Braille → Español), la iteración gráfica de las celdas del cuadratín (matriz de 2x3) y la preparación de vistas optimizadas para la exportación de señalética a formato PDF.
* *Capa de Adaptación (Custom Hooks):* Representada por los hooks useBrailleTranslator y usePdfExport. useBrailleTranslator actúa como mediador arquitectónico; encapsula el estado reactivo de la interfaz web (incluyendo la dirección de traducción activa) y gestiona las llamadas hacia la lógica del negocio, abstrayendo a los componentes de los detalles algorítmicos. usePdfExport encapsula la generación del documento PDF mediante jsPDF, incluyendo la variante espejada para impresión en relieve.
* *Capa de Lógica de Negocio (TypeScript):* Compuesta por clases y servicios de lógica pura en TypeScript, totalmente agnósticos de la interfaz gráfica.
    * BrailleTranslatorService: Contiene las reglas algorítmicas para procesar las series primitivas, secundarias y terceras, así como las banderas de control para la inserción de prefijos numéricos y de mayúsculas.
    * BrailleDictionary: Estructura de datos inmutable que almacena los mapas de equivalencias estáticas del sistema Braille Español.
 
<img width="5330" height="2903" alt="Diagrama_Componentes_Traductor" src="https://github.com/user-attachments/assets/8f58e9c0-018e-4c35-93e3-b6479bac2f6a" />
