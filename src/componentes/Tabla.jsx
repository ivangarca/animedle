import { COLUMNAS } from '../logica/juego.js'
import { estiloDeSerie } from '../datos/series.js'

/**
 * Tabla de intentos. El intento mas reciente arriba, que es lo que el
 * usuario esta mirando.
 */
export default function Tabla({ intentos }) {
  if (!intentos.length) return null

  return (
    <div className="tabla">
      <div className="fila cabecera">
        <div className="celda">Personaje</div>
        {COLUMNAS.map((c) => (
          <div className="celda" key={c.clave}>
            {c.etiqueta}
          </div>
        ))}
      </div>

      {[...intentos].reverse().map((intento) => (
        <div
          className={`fila ${intento.acertado ? 'acertada' : ''}`}
          key={intento.personaje.n}
        >
          <div className="celda nombre" style={estiloDeSerie(intento.personaje.serie)}>
            {intento.personaje.n}
          </div>
          {intento.celdas.map((celda) => (
            <div className={`celda ${celda.estado}`} key={celda.clave}>
              {celda.texto}
              {celda.flecha && <span className="flecha">{celda.flecha}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
