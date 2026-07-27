import { useMemo } from 'react'

const COLORES = ['#7c5cff', '#2e9e5b', '#c99a2e', '#e74c3c', '#3498db', '#e6e9ef']

/**
 * Lluvia de confeti, sin librerias.
 *
 * Cada pieza es un <span> con posicion, color, tamano y retardo aleatorios.
 * La animacion la hace el navegador con CSS (transform + opacity), que se
 * acelera por GPU: 70 elementos no le hacen ni cosquillas.
 *
 * useMemo es importante aqui: sin el, cada render de React volveria a
 * sortear las posiciones y el confeti "saltaria".
 */
export default function Confeti({ piezas = 70 }) {
  const trozos = useMemo(
    () =>
      Array.from({ length: piezas }, (_, i) => ({
        id: i,
        izquierda: Math.random() * 100,
        retardo: Math.random() * 0.7,
        duracion: 2.2 + Math.random() * 1.6,
        ancho: 6 + Math.random() * 6,
        color: COLORES[i % COLORES.length],
      })),
    [piezas],
  )

  return (
    <div className="confeti" aria-hidden="true">
      {trozos.map((t) => (
        <span
          key={t.id}
          style={{
            left: `${t.izquierda}%`,
            width: `${t.ancho}px`,
            height: `${t.ancho * 1.6}px`,
            background: t.color,
            animationDelay: `${t.retardo}s`,
            animationDuration: `${t.duracion}s`,
          }}
        />
      ))}
    </div>
  )
}
