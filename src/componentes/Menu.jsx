import { useEffect, useState } from 'react'
import { SERIES } from '../datos/series.js'
import { TODOS, coleccionesDisponibles } from '../logica/colecciones.js'
import {
  UN_RETO_POR_DIA,
  bloqueadaHoy,
  formatearEspera,
  msHastaMedianoche,
} from '../logica/progreso.js'

const COLOR_POR_DEFECTO = '#7c5cff'

/**
 * Pantalla de inicio: elegir con que personajes jugar.
 *
 * Las tematicas se generan a partir del dataset, no estan escritas aqui:
 * anade personajes de una serie nueva y su tarjeta aparece sola.
 *
 * Las colecciones ya jugadas hoy salen bloqueadas con una cuenta atras
 * hasta las 00:00.
 */
export default function Menu({ personajes, progreso, onElegir }) {
  const colecciones = coleccionesDisponibles(personajes)
  const espera = useCuentaAtras()

  const generalHecha = bloqueadaHoy(progreso, TODOS)

  return (
    <div className="menu">
      <Tarjeta
        titulo="Todos los personajes"
        destacada
        bloqueada={generalHecha}
        espera={espera}
        color={COLOR_POR_DEFECTO}
        onElegir={() => onElegir(TODOS)}
      />

      <h2 className="menu-titulo">O juega con una temática</h2>

      <div className="rejilla">
        {colecciones.map((coleccion) => (
          <Tarjeta
            key={coleccion.id}
            titulo={coleccion.nombre}
            subtitulo={`${coleccion.total} personajes`}
            bloqueada={bloqueadaHoy(progreso, coleccion.id)}
            espera={espera}
            color={SERIES[coleccion.id]?.color ?? COLOR_POR_DEFECTO}
            onElegir={() => onElegir(coleccion.id)}
          />
        ))}
      </div>

      <p className="menu-nota">
        {UN_RETO_POR_DIA
          ? 'Un reto por temática y día. A las 00:00 se renuevan todos.'
          : '⚙ Modo pruebas: puedes repetir los retos sin límite.'}
      </p>
    </div>
  )
}

function Tarjeta({ titulo, subtitulo, destacada, bloqueada, espera, color, onElegir }) {
  const clases = ['tarjeta']
  if (destacada) clases.push('destacada')
  if (bloqueada) clases.push('bloqueada')

  return (
    <button
      className={clases.join(' ')}
      disabled={bloqueada}
      onClick={onElegir}
      style={
        bloqueada
          ? undefined
          : {
              background: `linear-gradient(135deg, ${color}33, var(--panel2))`,
              borderColor: `${color}66`,
            }
      }
    >
      <strong>{titulo}</strong>
      {bloqueada ? (
        <span className="bloqueo">Hecha · vuelve en {espera}</span>
      ) : (
        subtitulo && <span>{subtitulo}</span>
      )}
    </button>
  )
}

/**
 * Tiempo restante hasta medianoche, ya formateado.
 * Se refresca cada 20 s: con precision de minutos no hace falta mas, y
 * asi no despertamos al navegador cada segundo sin motivo.
 */
function useCuentaAtras() {
  const [texto, setTexto] = useState(() => formatearEspera(msHastaMedianoche()))

  useEffect(() => {
    const id = setInterval(() => {
      setTexto(formatearEspera(msHastaMedianoche()))
    }, 20000)
    return () => clearInterval(id)
  }, [])

  return texto
}
