import { useCallback, useMemo, useState } from 'react'
import Buscador from './componentes/Buscador.jsx'
import Tabla from './componentes/Tabla.jsx'
import PanelFinal from './componentes/PanelFinal.jsx'
import Menu from './componentes/Menu.jsx'
import { PERSONAJES } from './datos/personajes.js'
import { comparar, numeroDelDia, personajeDelDia } from './logica/juego.js'
import { TODOS, nombreDeColeccion, personajesDe } from './logica/colecciones.js'
import { leerEstadisticas, registrarReto } from './logica/estadisticas.js'
import { completadaHoy, guardarResultado, leerProgreso } from './logica/progreso.js'

export default function App() {
  // null = estamos en el menu. Cualquier otro valor = partida en marcha.
  const [coleccion, setColeccion] = useState(null)
  const [objetivo, setObjetivo] = useState(null)
  const [intentos, setIntentos] = useState([])
  const [estadisticas, setEstadisticas] = useState(() => leerEstadisticas())
  const [progreso, setProgreso] = useState(() => leerProgreso())

  // Personajes con los que se juega y entre los que se busca.
  const personajes = useMemo(() => personajesDe(coleccion), [coleccion])

  // Se juega hasta acertar: no hay limite de intentos.
  const acertado = intentos.some((i) => i.acertado)

  const usados = useMemo(
    () => new Set(intentos.map((i) => i.personaje.n)),
    [intentos],
  )

  const empezar = useCallback(
    (id) => {
      // Cinturon y tirantes: el menu ya deshabilita las hechas, pero si el
      // dia cambia con la pestana abierta esto evita repetir una coleccion.
      if (completadaHoy(progreso, id)) return

      const lista = personajesDe(id)
      setColeccion(id)
      setObjetivo(personajeDelDia(lista, new Date(), `:${id}`))
      setIntentos([])
    },
    [progreso],
  )

  const volverAlMenu = useCallback(() => {
    setProgreso(leerProgreso())
    setColeccion(null)
    setObjetivo(null)
    setIntentos([])
  }, [])

  const intentar = useCallback(
    (personaje) => {
      if (acertado || usados.has(personaje.n)) return

      const resultado = comparar(personaje, objetivo)
      const siguientes = [...intentos, resultado]
      setIntentos(siguientes)

      if (resultado.acertado) {
        setEstadisticas(registrarReto({ intentos: siguientes.length }))
        setProgreso(
          guardarResultado(coleccion, {
            intentos: siguientes.length,
            personaje: objetivo.n,
          }),
        )
      }
    },
    [acertado, usados, objetivo, intentos, coleccion],
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
        <Menu personajes={PERSONAJES} progreso={progreso} onElegir={empezar} />
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
            deshabilitado={acertado}
          />

          {!acertado && (
            <p className="contador">Reto diario #{numeroDelDia()}</p>
          )}

          <Tabla intentos={intentos} />

          {acertado && (
            <PanelFinal
              objetivo={objetivo}
              intentos={intentos}
              etiqueta={coleccion === TODOS ? '' : coleccion}
              estadisticas={estadisticas}
              onVolver={volverAlMenu}
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
