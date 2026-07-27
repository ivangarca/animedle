/**
 * Estadisticas y racha, guardadas en localStorage.
 *
 * Como ya no se puede perder (se juega hasta acertar), lo que se mide no
 * es el porcentaje de acierto sino cuantos intentos necesitas de media.
 * La racha cuenta dias seguidos jugando al menos un reto.
 *
 * Todo envuelto en try/catch porque en modo incognito o con las cookies
 * bloqueadas localStorage puede lanzar excepcion, y eso no debe tumbar el juego.
 */
import { claveDelDia } from './juego.js'

const CLAVE = 'animedle:estadisticas:v2'

const INICIAL = {
  retos: 0, // retos completados en total
  intentosTotales: 0, // suma de intentos, para calcular la media
  mejorPartida: null, // menos intentos logrados en un reto
  racha: 0,
  mejorRacha: 0,
  ultimoDia: null, // clave YYYY-MM-DD del ultimo dia jugado
}

export function leerEstadisticas() {
  try {
    const bruto = localStorage.getItem(CLAVE)
    return bruto ? { ...INICIAL, ...JSON.parse(bruto) } : { ...INICIAL }
  } catch {
    return { ...INICIAL }
  }
}

function guardar(datos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos))
  } catch {
    /* sin persistencia, pero el juego sigue funcionando */
  }
}

/** Dia anterior a una fecha, en formato YYYY-MM-DD. */
function claveDeAyer(fecha) {
  const ayer = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() - 1)
  return claveDelDia(ayer)
}

/**
 * Registra un reto completado.
 * La racha solo sube una vez al dia, da igual cuantas tematicas juegues.
 */
export function registrarReto({ intentos, fecha = new Date() }) {
  const hoy = claveDelDia(fecha)
  const previas = leerEstadisticas()

  let racha = previas.racha
  if (previas.ultimoDia !== hoy) {
    // Si el ultimo dia jugado fue ayer, la racha continua. Si no, vuelve a 1.
    racha = previas.ultimoDia === claveDeAyer(fecha) ? previas.racha + 1 : 1
  }

  const nuevas = {
    retos: previas.retos + 1,
    intentosTotales: previas.intentosTotales + intentos,
    mejorPartida:
      previas.mejorPartida === null
        ? intentos
        : Math.min(previas.mejorPartida, intentos),
    racha,
    mejorRacha: Math.max(previas.mejorRacha, racha),
    ultimoDia: hoy,
  }

  guardar(nuevas)
  return nuevas
}

/** Media de intentos, con un decimal. */
export function mediaDeIntentos(estadisticas) {
  if (!estadisticas.retos) return '—'
  return (estadisticas.intentosTotales / estadisticas.retos).toFixed(1)
}
