import { useCallback, useMemo, useState } from 'react'
import Buscador from './componentes/Buscador.jsx'
import Tabla from './componentes/Tabla.jsx'
import PanelFinal from './componentes/PanelFinal.jsx'
import { PERSONAJES } from './datos/personajes.js'
import {
  MAX_INTENTOS,
  comparar,
  numeroDelDia,
  personajeAleatorio,
  personajeDelDia,
} from './logica/juego.js'
import { leerEstadisticas, registrarPartida } from './logica/estadisticas.js'

export default function App() {
  const [modoLibre, setModoLibre] = useState(false)
  const [objetivo, setObjetivo] = useState(() => personajeDelDia(PERSONAJES))
  const [intentos, setIntentos] = useState([])
  const [estadisticas, setEstadisticas] = useState(() => leerEstadisticas())

  const gano = intentos.some((i) => i.acertado)
  const terminado = gano || intentos.length >= MAX_INTENTOS

  const usados = useMemo(
    () => new Set(intentos.map((i) => i.personaje.n)),
    [intentos],
  )

  const intentar = useCallback(
    (personaje) => {
      if (terminado || usados.has(personaje.n)) return

      const resultado = comparar(personaje, objetivo)
      const siguientes = [...intentos, resultado]
      setIntentos(siguientes)

      const acabaAhora = resultado.acertado || siguientes.length >= MAX_INTENTOS
      if (acabaAhora && !modoLibre) {
        setEstadisticas(
          registrarPartida({ gano: resultado.acertado, intentos: siguientes.length }),
        )
      }
    },
    [terminado, usados, objetivo, intentos, modoLibre],
  )

  const empezarModoLibre = useCallback(() => {
    setModoLibre(true)
    setObjetivo(personajeAleatorio(PERSONAJES))
    setIntentos([])
  }, [])

  return (
    <div className="envoltorio">
      <header>
        <h1>
          Anime<span>dle</span>
        </h1>
        <p className="subtitulo">
          Adivina el personaje. Cada intento te dice qué atributos coinciden.
        </p>
      </header>

      <Buscador
        personajes={PERSONAJES}
        usados={usados}
        onElegir={intentar}
        deshabilitado={terminado}
      />

      {!terminado && (
        <p className="contador">
          Intento {intentos.length + 1} de {MAX_INTENTOS}
          {modoLibre ? ' · modo libre' : ` · reto diario #${numeroDelDia()}`}
        </p>
      )}

      <Tabla intentos={intentos} />

      {terminado && (
        <PanelFinal
          gano={gano}
          objetivo={objetivo}
          intentos={intentos}
          modoLibre={modoLibre}
          estadisticas={estadisticas}
          onModoLibre={empezarModoLibre}
        />
      )}

      <footer>
        <p>
          <span className="leyenda ok" /> coincide
          <span className="leyenda casi" /> parecido
          <span className="leyenda no" /> no coincide
        </p>
        <p className="fino">
          Proyecto personal sin ánimo de lucro. Datos de personajes con fines
          informativos; los derechos pertenecen a sus respectivos titulares.
        </p>
      </footer>
    </div>
  )
}
