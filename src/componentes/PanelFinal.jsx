import { useState } from 'react'
import { MAX_INTENTOS, resumenCompartible } from '../logica/juego.js'
import { porcentajeAcierto } from '../logica/estadisticas.js'

/** Panel que aparece al terminar: resultado, estadisticas y compartir. */
export default function PanelFinal({
  gano,
  objetivo,
  intentos,
  modoLibre,
  estadisticas,
  onModoLibre,
}) {
  const [copiado, setCopiado] = useState(false)
  const resumen = resumenCompartible({ intentos, gano, modoLibre })

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resumen)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* algunos navegadores lo bloquean sin https: el texto sigue visible */
    }
  }

  return (
    <div className="panel">
      <h2>{gano ? '¡Correcto!' : 'Se acabaron los intentos'}</h2>

      <p>
        {gano ? (
          <>
            Lo has sacado en <b>{intentos.length}</b> de {MAX_INTENTOS} intentos.
          </>
        ) : (
          <>
            Era <b>{objetivo.n}</b> ({objetivo.serie}).
          </>
        )}
      </p>

      {!modoLibre && (
        <div className="estadisticas">
          <div>
            <strong>{estadisticas.partidas}</strong>
            <span>jugadas</span>
          </div>
          <div>
            <strong>{porcentajeAcierto(estadisticas)}%</strong>
            <span>acierto</span>
          </div>
          <div>
            <strong>{estadisticas.racha}</strong>
            <span>racha</span>
          </div>
          <div>
            <strong>{estadisticas.mejorRacha}</strong>
            <span>mejor</span>
          </div>
        </div>
      )}

      <pre className="compartir">{resumen}</pre>

      <div className="botones">
        <button onClick={copiar}>{copiado ? 'Copiado' : 'Copiar resultado'}</button>
        <button className="sec" onClick={onModoLibre}>
          Jugar en modo libre
        </button>
      </div>

      {!modoLibre && <p className="nota">Mañana hay personaje nuevo.</p>}
    </div>
  )
}
