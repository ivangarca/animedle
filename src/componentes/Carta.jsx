import { RAREZAS } from '../logica/cartas.js'

/**
 * Una carta. Si `cantidad` es 0 se dibuja como no conseguida.
 * `nueva` la resalta al salir de un sobre.
 */
export default function Carta({ personaje, rareza, cantidad = 1, nueva = false }) {
  const { color, nombre } = RAREZAS[rareza]
  const conseguida = cantidad > 0

  const clases = ['carta', `rareza-${rareza}`]
  if (!conseguida) clases.push('vacia')
  if (nueva) clases.push('nueva')

  return (
    <div
      className={clases.join(' ')}
      style={
        conseguida
          ? { borderColor: color, background: `linear-gradient(160deg, ${color}44, var(--panel2))` }
          : undefined
      }
      title={`${personaje.n} · ${nombre}`}
    >
      <span className="carta-rareza" style={conseguida ? { color } : undefined}>
        {nombre}
      </span>
      <span className="carta-nombre">{conseguida ? personaje.n : '???'}</span>
      <span className="carta-serie">{personaje.serie}</span>
      {cantidad > 1 && <span className="carta-cantidad">×{cantidad}</span>}
    </div>
  )
}
