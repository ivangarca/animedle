import { SERIES } from '../datos/series.js'
import { TODOS, coleccionesDisponibles } from '../logica/colecciones.js'

const COLOR_POR_DEFECTO = '#7c5cff'

/**
 * Pantalla de inicio: elegir con que personajes jugar.
 *
 * Las tematicas se generan a partir del dataset, no estan escritas aqui:
 * anade personajes de una serie nueva y su tarjeta aparece sola.
 */
export default function Menu({ personajes, onElegir }) {
  const colecciones = coleccionesDisponibles(personajes)

  return (
    <div className="menu">
      <button className="tarjeta destacada" onClick={() => onElegir(TODOS)}>
        <strong>Todos los personajes</strong>
        <span>
          {personajes.length} personajes · {colecciones.length} series
        </span>
      </button>

      <h2 className="menu-titulo">O juega con una temática</h2>

      <div className="rejilla">
        {colecciones.map((coleccion) => {
          const color = SERIES[coleccion.id]?.color ?? COLOR_POR_DEFECTO
          return (
            <button
              key={coleccion.id}
              className="tarjeta"
              style={{
                background: `linear-gradient(135deg, ${color}33, var(--panel2))`,
                borderColor: `${color}66`,
              }}
              onClick={() => onElegir(coleccion.id)}
            >
              <strong>{coleccion.nombre}</strong>
              <span>{coleccion.total} personajes</span>
            </button>
          )
        })}
      </div>

      <p className="menu-nota">
        Cada temática tiene su propio personaje del día.
      </p>
    </div>
  )
}
