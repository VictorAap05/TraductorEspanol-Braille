## 2. Diseño Arquitectónico de Alto Nivel, Arquitectura basada en componentes

El sistema implementa una arquitectura basada en capas desacopladas dentro del entorno del cliente, garantizando el cumplimiento del Principio de Responsabilidad Única y facilitando el mantenimiento y testeo modular del software.

### 2.1. Descripción de las Capas

* *Capa de Componentes (React):* Se encarga exclusivamente de la experiencia de usuario y el renderizado visual de la interfaz. Está compuesta por módulos especializados en la captura de entradas de texto en tinta, la iteración gráfica de las celdas del cuadratín (matriz de 2x3) y la preparación de vistas optimizadas para la exportación de señalética a formato PDF.
* *Capa de Adaptación (Custom Hooks):* Representada por el hook useBrailleTranslator. Actúa como mediador arquitectónico; encapsula el estado reactivo de la interfaz web y gestiona las llamadas asíncronas o reactivas hacia la lógica del negocio, abstrayendo a los componentes de los detalles algorítmicos.
* *Capa de Lógica de Negocio (TypeScript):* Compuesta por clases y servicios de lógica pura en TypeScript, totalmente agnósticos de la interfaz gráfica.
    * BrailleTranslatorService: Contiene las reglas algorítmicas para procesar las series primitivas, secundarias y terceras, así como las banderas de control para la inserción de prefijos numéricos y de mayúsculas.
    * BrailleDictionary: Estructura de datos inmutable que almacena los mapas de equivalencias estáticas del sistema Braille Español.
 
<img width="5330" height="2903" alt="Diagrama_Componentes_Traductor" src="https://github.com/user-attachments/assets/8f58e9c0-018e-4c35-93e3-b6479bac2f6a" />
