import { useMemo, useState } from 'react'
import Carta from './Carta.jsx'
import { ORDEN_RAREZAS, totalDeCartas } from '../logica/cartas.js'
import { cantidadDe, cartasDistintas } from '../logica/cartera.js'

/** Album: todas las cartas que existen, con las conseguidas destacadas. */
export default function Coleccion({ personajes, cartera, onVolver }) {
  const [soloConseguidas, setSoloConseguidas] = useState(false)

  const porSerie = useMemo(() => {
    const grupos = new Map()
    for (const p of personajes) {
      if (!grupos.has(p.serie)) grupos.set(p.serie, [])
      grupos.get(p.serie).push(p)
    }
    return [...grupos.entries()]
  }, [personajes])

  const conseguidas = cartasDistintas(cartera)
  const total = totalDeCartas(personajes)
  const porcentaje = total ? Math.round((conseguidas / total) * 100) : 0

  return (
    <div className="pantalla">
      <div className="barra">
        <button className="volver" onClick={onVolver}>
          ← Menú
        </button>
        <span className="pill">
          {conseguidas} / {total} · {porcentaje}%
        </span>
      </div>

      <label className="filtro">
        <input
          type="checkbox"
          checked={soloConseguidas}
          onChange={(e) => setSoloConseguidas(e.target.checked)}
        />
        Mostrar solo las conseguidas
      </label>

      {porSerie.map(([serie, lista]) => {
        const cartas = lista.flatMap((personaje) =>
          ORDEN_RAREZAS.map((rareza) => ({
            personaje,
            rareza,
            cantidad: cantidadDe(cartera, personaje.n, rareza),
          })),
        )

        const visibles = soloConseguidas ? cartas.filter((c) => c.cantidad > 0) : cartas
        if (!visibles.length) return null

        return (
          <section key={serie} className="grupo-serie">
            <h3>
              {serie}
              <small>
                {cartas.filter((c) => c.cantidad > 0).length} / {cartas.length}
              </small>
            </h3>
            <div className="cartas-rejilla">
              {visibles.map((c) => (
                <Carta
                  key={`${c.personaje.n}-${c.rareza}`}
                  personaje={c.personaje}
                  rareza={c.rareza}
                  cantidad={c.cantidad}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
