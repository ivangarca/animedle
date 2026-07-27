import Retrato from './Retrato.jsx'
import { RAREZAS } from '../logica/cartas.js'

/**
 * Una carta.
 *
 * La rareza decide QUE se ve, no solo el color del marco:
 *   - azul     -> una placa con el nombre
 *   - amarillo -> el retrato del personaje
 *
 * Si `cantidad` es 0 la carta no se ha conseguido: el retrato sale en
 * silueta y el nombre se oculta. `nueva` la resalta al salir de un sobre.
 */
export default function Carta({ personaje, rareza, cantidad = 1, nueva = false }) {
  const { color, nombre, muestraImagen } = RAREZAS[rareza]
  const conseguida = cantidad > 0

  const clases = ['carta', `rareza-${rareza}`]
  if (!conseguida) clases.push('vacia')
  if (nueva) clases.push('nueva')

  return (
    <div
      className={clases.join(' ')}
      style={
        conseguida
          ? {
              borderColor: color,
              background: `linear-gradient(160deg, ${color}44, var(--panel2))`,
            }
          : undefined
      }
      title={conseguida ? `${personaje.n} · ${nombre}` : `Carta ${nombre} sin conseguir`}
    >
      <span className="carta-rareza" style={conseguida ? { color } : undefined}>
        {nombre}
      </span>

      {muestraImagen ? (
        <>
          <Retrato personaje={personaje} silueta={!conseguida} />
          <span className="carta-nombre">{conseguida ? personaje.n : '???'}</span>
        </>
      ) : (
        <div className="carta-placa" style={conseguida ? { borderColor: color } : undefined}>
          <span>{conseguida ? personaje.n : '???'}</span>
        </div>
      )}

      <span className="carta-serie">{personaje.serie}</span>

      {cantidad > 1 && <span className="carta-cantidad">×{cantidad}</span>}
    </div>
  )
}
