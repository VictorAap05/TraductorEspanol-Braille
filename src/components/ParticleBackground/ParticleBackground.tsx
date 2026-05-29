import { useEffect, useRef } from 'react';

/**
 * Representa el estado y las propiedades físicas de una partícula individual
 * en la animación de fondo.
 */
interface Particle {
  /** Posición actual en el eje X dentro del canvas. */
  x: number;
  /** Posición actual en el eje Y dentro del canvas. */
  y: number;
  /** Velocidad de movimiento en el eje X (píxeles por frame). */
  vx: number;
  /** Velocidad de movimiento en el eje Y (píxeles por frame). */
  vy: number;
  /** Radio (tamaño) de la partícula en píxeles. */
  radius: number;
  /** Opacidad actual de la partícula (valor decimal entre 0 y 1). */
  opacity: number;
  /** * Dirección del cambio de opacidad (efecto destello).
   * `1` para incrementar (fade-in), `-1` para disminuir (fade-out).
   */
  opacityDir: number;
}

/** * Número total de partículas que se renderizarán simultáneamente en el lienzo.
 */
const PARTICLE_COUNT = 60;

/** * Paleta de colores en formato Hexadecimal utilizada para pintar las partículas de forma aleatoria.
 */
const COLORS = ['#125565', '#30515f', '#9ac9d0', '#6aadb8', '#ffffff'];

/**
 * Fábrica (Factory function) para generar una nueva partícula con propiedades físicas 
 * y de renderizado inicializadas aleatoriamente.
 *
 * @param width - El ancho actual del canvas para delimitar el límite de la posición X.
 * @param height - El alto actual del canvas para delimitar el límite de la posición Y.
 * @returns Un objeto que implementa la interfaz {@link Particle}.
 */
function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.2,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
  };
}

/**
 * Componente React que renderiza un fondo animado de partículas flotantes utilizando HTML5 Canvas.
 *
 * ### Características:
 * - **Responsivo:** Se adapta automáticamente al tamaño de la ventana (`window.innerWidth` y `window.innerHeight`).
 * - **Interconectado:** Dibuja líneas de conexión dinámicas y translúcidas entre partículas que se aproximan a menos de 120px.
 * - **Efecto de profundidad:** Aplica fluctuaciones de opacidad (destellos) individuales por partícula.
 * - **No intrusivo:** Se posiciona de forma fija (`fixed`) cubriendo todo el viewport con `pointer-events: none` para no bloquear clics en la UI.
 *
 * @example
 * ```tsx
 * import { ParticleBackground } from './ParticleBackground';
 *
 * function App() {
 * return (
 * <div className="app-container">
 * <ParticleBackground />
 * <main>Contenido de la aplicación...</main>
 * </div>
 * );
 * }
 * ```
 * * @returns Un elemento JSX con el nodo `<canvas>` configurado para ocupar el fondo.
 */
export function ParticleBackground() {
  /** Referencia mutable apuntando al elemento canvas del DOM. */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /** Identificador de la animación devuelto por `requestAnimationFrame` para su posterior limpieza. */
    let animId: number;
    /** Arreglo que almacena el estado de todas las partículas activas. */
    let particles: Particle[] = [];

    /**
     * Ajusta el tamaño físico del canvas al viewport del navegador
     * y reinicializa el arreglo de partículas.
     */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    /**
     * Bucle principal de renderizado (Render Loop).
     * Se encarga de limpiar el lienzo, calcular distancias para dibujar las líneas interconectoras,
     * actualizar la posición/opacidad de las partículas y gestionar los rebotes en los límites de la pantalla.
     */
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Líneas de conexión entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(18, 85, 101, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dibujar cada partícula
      particles.forEach((p, idx) => {
        const color = COLORS[idx % COLORS.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          color === '#ffffff'
            ? `rgba(255,255,255,${p.opacity * 0.6})`
            : `${color}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Mover
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.7 || p.opacity < 0.1) p.opacityDir *= -1;

        // Rebotar en bordes
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    // Inicialización y registro de escuchas de eventos
    resize();
    draw();
    window.addEventListener('resize', resize);

    // Ciclo de desmonte (Clean-up) del efecto de React
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}