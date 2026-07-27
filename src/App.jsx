import { useCallback, useMemo, useState } from 'react'
import Buscador from './componentes/Buscador.jsx'
import Tabla from './componentes/Tabla.jsx'
import PanelFinal from './componentes/PanelFinal.jsx'
import Menu from './componentes/Menu.jsx'
import Tienda from './componentes/Tienda.jsx'
import Coleccion from './componentes/Coleccion.jsx'
import { PERSONAJES } from './datos/personajes.js'
import { comparar, numeroDelDia, personajeDelDia } from './logica/juego.js'
import { TODOS, nombreDeColeccion, personajesDe } from './logica/colecciones.js'
import { leerEstadisticas, registrarReto } from './logica/estadisticas.js'
import { completadaHoy, guardarResultado, leerProgreso } from './logica/progreso.js'
import { anadirMonedas, leerCartera } from './logica/cartera.js'
import { MONEDAS_POR_ACIERTO } from './logica/cartas.js'

export default function App() {
  // 'menu' | 'juego' | 'tienda' | 'coleccion'
  const [vista, setVista] = useState('menu')
  const [coleccion, setColeccion] = useState(null)
  const [objetivo, setObjetivo] = useState(null)
  const [intentos, setIntentos] = useState([])
  const [estadisticas, setEstadisticas] = useState(() => leerEstadisticas())
  const [progreso, setProgreso] = useState(() => leerProgreso())
  const [cartera, setCartera] = useState(() => leerCartera())

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

      setColeccion(id)
      setObjetivo(personajeDelDia(personajesDe(id), new Date(), `:${id}`))
      setIntentos([])
      setVista('juego')
    },
    [progreso],
  )

  const volverAlMenu = useCallback(() => {
    setProgreso(leerProgreso())
    setColeccion(null)
    setObjetivo(null)
    setIntentos([])
    setVista('menu')
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
        setCartera(anadirMonedas(MONEDAS_POR_ACIERTO))
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

      {vista === 'menu' && (
        <>
          <div className="acciones">
            <span className="monedas">{cartera.monedas} monedas</span>
            <div>
              <button className="sec" onClick={() => setVista('tienda')}>
                Tienda
              </button>
              <button className="sec" onClick={() => setVista('coleccion')}>
                Colección
              </button>
            </div>
          </div>

          <Menu personajes={PERSONAJES} progreso={progreso} onElegir={empezar} />
        </>
      )}

      {vista === 'tienda' && (
        <Tienda
          personajes={PERSONAJES}
          cartera={cartera}
          onCartera={setCartera}
          onVolver={() => setVista('menu')}
        />
      )}

      {vista === 'coleccion' && (
        <Coleccion
          personajes={PERSONAJES}
          cartera={cartera}
          onVolver={() => setVista('menu')}
        />
      )}

      {vista === 'juego' && (
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

          {!acertado && <p className="contador">Reto diario #{numeroDelDia()}</p>}

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
