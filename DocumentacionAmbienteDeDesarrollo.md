# Documentación del Ambiente de Desarrollo y Flujo de Trabajo

## 1. Herramientas Seleccionadas (Ambiente de Desarrollo)

Para garantizar la eficiencia en el empaquetado, la tipificación estricta y la velocidad de ejecución en el lado del cliente, se ha seleccionado el siguiente ecosistema tecnológico para el entorno local:

* **Entorno de Ejecución:** Node.js (Versión v24.14.1) como base para la gestión de dependencias y scripts de automatización.
* **Administrador de Paquetes:** `npm` para la instalación y control de versiones de las librerías del proyecto.
* **Framework Frontend:** React estructurado bajo una arquitectura basada en componentes y renderizado reactivo en memoria.
* **Herramienta de Construcción:** Vite para el levantamiento inmediato del servidor de desarrollo local y la compilación optimizada de archivos estáticos.
* **Lenguaje de Programación:** TypeScript para añadir tipado estático fuerte al proyecto, definiendo interfaces estrictas para las matrices del sistema Braille y previniendo errores en tiempo de compilación.
* **Entorno de Pruebas (Testing):** Vitest para la ejecución de pruebas unitarias sobre los servicios aislados de lógica de negocio.
* **Generación de Documentación Técnica:** Typedoc para la compilación automatizada de comentarios estructurados en el código fuente (equivalente a JavaDoc).

---

## 2. Estrategia de Ramificación (Flujo de Trabajo)

Atendiendo a la restricción de **no desarrollar directamente sobre la rama `main`**, el equipo ha adoptado e implementado el modelo **GitHub Flow**. Este es un flujo de trabajo ágil, ligero y centrado en ramas de corta duración que asegura la estabilidad del código en producción.

### 2.1. Estructura y Propósito de las Ramas

1. **Rama `main` (Rama de Producción):** * Es la rama principal y contiene únicamente el código en su versión estable, compilable y lista para entrega. 
2. **Rama `documentacion` (Rama de Gestión de documentación):**
   * Destinada exclusivamente a alojar los archivos de documentación, como diagramas, manuales, casos de prueba.
3. **Ramas de Características (`feature/`):**
   * Ramas temporales creadas para el desarrollo de funcionalidades específicas, corrección de errores o pruebas. Se nombran utilizando kebab-case descriptivo. Ejemplo:
     * `feature/exportar-pdf`

### 2.2. Flujo de Trabajo (Ciclo de Vida del Código)

Para garantizar la integridad del software, cada integrante debe seguir obligatoriamente este procedimiento:

1. **Sincronización Inicial:** Antes de comenzar cualquier tarea, se debe actualizar la copia local con respecto al repositorio remoto:
   ```bash
   git checkout main
   git pull origin main
