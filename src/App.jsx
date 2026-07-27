import { useCallback, useMemo, useState } from 'react'
import Buscador from './componentes/Buscador.jsx'
import Tabla from './componentes/Tabla.jsx'
import PanelFinal from './componentes/PanelFinal.jsx'
import Menu from './componentes/Menu.jsx'
import { PERSONAJES } from './datos/personajes.js'
import {
  MAX_INTENTOS,
  comparar,
  numeroDelDia,
  personajeAleatorio,
  personajeDelDia,
} from './logica/juego.js'
import {
  TODOS,
  nombreDeColeccion,
  personajesDe,
} from './logica/colecciones.js'
import { leerEstadisticas, registrarPartida } from './logica/estadisticas.js'

export default function App() {
  // null = estamos en el menu. Cualquier otro valor = partida en marcha.
  const [coleccion, setColeccion] = useState(null)
  const [modoLibre, setModoLibre] = useState(false)
  const [objetivo, setObjetivo] = useState(null)
  const [intentos, setIntentos] = useState([])
  const [estadisticas, setEstadisticas] = useState(() => leerEstadisticas())

  // Personajes con los que se juega y entre los que se busca.
  const personajes = useMemo(() => personajesDe(coleccion), [coleccion])

  const gano = intentos.some((i) => i.acertado)
  const terminado = gano || intentos.length >= MAX_INTENTOS

  const usados = useMemo(
    () => new Set(intentos.map((i) => i.personaje.n)),
    [intentos],
  )

  /** Empieza el reto diario de una coleccion. */
  const empezar = useCallback((id) => {
    const lista = personajesDe(id)
    setColeccion(id)
    setModoLibre(false)
    setObjetivo(personajeDelDia(lista, new Date(), `:${id}`))
    setIntentos([])
  }, [])

  const volverAlMenu = useCallback(() => {
    setColeccion(null)
    setObjetivo(null)
    setIntentos([])
    setModoLibre(false)
  }, [])

  const empezarModoLibre = useCallback(() => {
    setModoLibre(true)
    setObjetivo(personajeAleatorio(personajes))
    setIntentos([])
  }, [personajes])

  const intentar = useCallback(
    (personaje) => {
      if (terminado || usados.has(personaje.n)) return

      const resultado = comparar(personaje, objetivo)
      const siguientes = [...intentos, resultado]
      setIntentos(siguientes)

      // Solo cuenta para la racha el reto diario con todos los personajes:
      // si contasen las tematicas, la racha no significaria nada.
      const acabaAhora = resultado.acertado || siguientes.length >= MAX_INTENTOS
      if (acabaAhora && !modoLibre && coleccion === TODOS) {
        setEstadisticas(
          registrarPartida({ gano: resultado.acertado, intentos: siguientes.length }),
        )
      }
    },
    [terminado, usados, objetivo, intentos, modoLibre, coleccion],
  )

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

      {!coleccion ? (
        <Menu personajes={PERSONAJES} onElegir={empezar} />
      ) : (
        <>
          <div className="barra">
            <button className="volver" onClick={volverAlMenu}>
              ← Menú
            </button>
            <span className="coleccion-activa">{nombreDeColeccion(coleccion)}</span>
          </div>

          <Buscador
            personajes={personajes}
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
              modoLibre={modoLibre || coleccion !== TODOS}
              estadisticas={estadisticas}
              onModoLibre={empezarModoLibre}
            />
          )}
        </>
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
