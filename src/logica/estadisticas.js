/**
 * Estadisticas y racha, guardadas en localStorage.
 * Todo envuelto en try/catch porque en modo incognito o con las cookies
 * bloqueadas localStorage puede lanzar excepcion, y eso no debe tumbar el juego.
 */
import { claveDelDia } from './juego.js'

const CLAVE = 'animedle:estadisticas:v1'

const INICIAL = {
  partidas: 0,
  victorias: 0,
  racha: 0,
  mejorRacha: 0,
  ultimoDia: null, // clave YYYY-MM-DD del ultimo reto diario jugado
  distribucion: {}, // { "1": 0, "2": 3, ... } intentos usados al ganar
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

/**
 * Registra el final de una partida del reto diario.
 * El modo libre no cuenta para las estadisticas: si contase, la racha
 * no significaria nada.
 */
export function registrarPartida({ gano, intentos, fecha = new Date() }) {
  const hoy = claveDelDia(fecha)
  const previas = leerEstadisticas()

  // Evita contar dos veces el mismo dia si recarga la pagina.
  if (previas.ultimoDia === hoy) return previas

  const racha = gano ? previas.racha + 1 : 0
  const distribucion = { ...previas.distribucion }
  if (gano) distribucion[intentos] = (distribucion[intentos] || 0) + 1

  const nuevas = {
    partidas: previas.partidas + 1,
    victorias: previas.victorias + (gano ? 1 : 0),
    racha,
    mejorRacha: Math.max(previas.mejorRacha, racha),
    ultimoDia: hoy,
    distribucion,
  }

  guardar(nuevas)
  return nuevas
}

export function porcentajeAcierto(estadisticas) {
  if (!estadisticas.partidas) return 0
  return Math.round((estadisticas.victorias / estadisticas.partidas) * 100)
}
