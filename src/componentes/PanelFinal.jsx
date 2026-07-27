import { useState } from 'react'
import Confeti from './Confeti.jsx'
import { mensajeDeVictoria, resumenCompartible } from '../logica/juego.js'
import { mediaDeIntentos } from '../logica/estadisticas.js'

/** Panel que aparece al acertar: mensaje, estadisticas y compartir. */
export default function PanelFinal({
  objetivo,
  intentos,
  etiqueta,
  estadisticas,
  onVolver,
}) {
  const [copiado, setCopiado] = useState(false)
  const resumen = resumenCompartible({ intentos, etiqueta })

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
    <>
      <Confeti />

      <div className="panel ganado">
        <h2>{mensajeDeVictoria(intentos.length)}</h2>

        <p>
          <b>{objetivo.n}</b> en {intentos.length}{' '}
          {intentos.length === 1 ? 'intento' : 'intentos'}.
        </p>

        <div className="estadisticas">
          <div>
            <strong>{estadisticas.retos}</strong>
            <span>retos</span>
          </div>
          <div>
            <strong>{mediaDeIntentos(estadisticas)}</strong>
            <span>media</span>
          </div>
          <div>
            <strong>{estadisticas.mejorPartida ?? '—'}</strong>
            <span>récord</span>
          </div>
          <div>
            <strong>{estadisticas.racha}</strong>
            <span>racha</span>
          </div>
        </div>

        <pre className="compartir">{resumen}</pre>

        <div className="botones">
          <button onClick={copiar}>{copiado ? 'Copiado' : 'Copiar resultado'}</button>
          <button className="sec" onClick={onVolver}>
            Volver al menú
          </button>
        </div>

        <p className="nota">Esta temática vuelve a las 00:00.</p>
      </div>
    </>
  )
}
