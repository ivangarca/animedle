import Retrato from './Retrato.jsx'
import { estiloDeSerie } from '../datos/series.js'

/**
 * Tabla de intentos. El intento mas reciente arriba, que es lo que el
 * usuario esta mirando.
 *
 * Las columnas llegan como prop porque cambian segun la coleccion: en una
 * tematica se añaden los campos propios de esa serie. Por eso la rejilla
 * se calcula aqui y no esta fija en el CSS.
 */
export default function Tabla({ intentos, columnas }) {
  if (!intentos.length) return null

  const rejilla = {
    gridTemplateColumns: `1.6fr repeat(${columnas.length}, minmax(88px, 1fr))`,
    minWidth: 200 + columnas.length * 110,
  }

  return (
    <div className="tabla">
      <div className="fila cabecera" style={rejilla}>
        <div className="celda">Personaje</div>
        {columnas.map((c) => (
          <div className="celda" key={c.clave}>
            {c.etiqueta}
          </div>
        ))}
      </div>

      {[...intentos].reverse().map((intento) => (
        <div
          className={`fila ${intento.acertado ? 'acertada' : ''}`}
          key={intento.personaje.n}
          style={rejilla}
        >
          <div className="celda nombre" style={estiloDeSerie(intento.personaje.serie)}>
            <Retrato personaje={intento.personaje} tamano="mini" />
            <span>{intento.personaje.n}</span>
          </div>

          {intento.celdas.map((celda) => (
            <div
              className={`celda ${celda.estado}`}
              key={celda.clave}
              title={celda.ayuda ?? undefined}
            >
              {celda.texto}
              {celda.flecha && (
                <span className="flecha" aria-label={celda.ayuda}>
                  {celda.flecha}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
