/**
 * Progreso diario: que colecciones has completado hoy.
 *
 * Regla del juego: un reto por coleccion y por dia. Si ya has hecho el de
 * One Piece, esa tematica se bloquea hasta las 00:00, pero puedes seguir
 * jugando las que no hayas tocado.
 *
 * Se guarda en localStorage con la fecha local del jugador, asi que el
 * reinicio ocurre a su medianoche, no a una hora universal.
 *
 * Nota honesta: al ser local, esto no impide que alguien borre el
 * almacenamiento del navegador y vuelva a jugar. Para impedirlo de verdad
 * haria falta un servidor con cuentas, y no merece la pena aqui: el juego
 * es contra uno mismo.
 */
import { claveDelDia } from './juego.js'

const CLAVE = 'animedle:progreso:v1'

/* ==================================================================
 * INTERRUPTOR DE PRUEBAS
 *
 *   false -> puedes repetir todos los retos que quieras (para probar)
 *   true  -> un reto por tematica y dia (comportamiento real)
 *
 * ANTES DE PUBLICAR: ponlo en true.
 * ================================================================== */
export const UN_RETO_POR_DIA = false

/** @returns {Record<string, {dia: string, intentos: number, personaje: string}>} */
export function leerProgreso() {
  try {
    const bruto = localStorage.getItem(CLAVE)
    return bruto ? JSON.parse(bruto) : {}
  } catch {
    return {}
  }
}

/** Guarda que una coleccion ya se ha completado hoy y devuelve el progreso nuevo. */
export function guardarResultado(coleccion, { intentos, personaje, fecha = new Date() }) {
  const progreso = leerProgreso()
  progreso[coleccion] = {
    dia: claveDelDia(fecha),
    intentos,
    personaje,
  }

  try {
    localStorage.setItem(CLAVE, JSON.stringify(progreso))
  } catch {
    /* sin persistencia, pero el juego sigue funcionando */
  }

  return progreso
}

/** ¿Se ha completado ya hoy esta coleccion? */
export function completadaHoy(progreso, coleccion, fecha = new Date()) {
  return progreso[coleccion]?.dia === claveDelDia(fecha)
}

/**
 * ¿Esta bloqueada esta coleccion ahora mismo?
 *
 * Es lo que usa la interfaz. Separado de `completadaHoy` a proposito:
 * esa funcion responde a un hecho ("la jugo hoy") y esta a una regla
 * ("por tanto no puede volver a jugarla"). Asi el interruptor de pruebas
 * no toca la logica que esta testeada.
 */
export function bloqueadaHoy(progreso, coleccion, fecha = new Date()) {
  return UN_RETO_POR_DIA && completadaHoy(progreso, coleccion, fecha)
}

/** Milisegundos que faltan para las 00:00 del dia siguiente. */
export function msHastaMedianoche(fecha = new Date()) {
  const manana = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate() + 1,
    0,
    0,
    0,
    0,
  )
  return manana - fecha
}

/** "3 h 12 min" / "12 min" / "menos de un minuto" */
export function formatearEspera(ms) {
  const minutosTotales = Math.ceil(ms / 60000)
  if (minutosTotales <= 1) return 'menos de un minuto'

  const horas = Math.floor(minutosTotales / 60)
  const minutos = minutosTotales % 60

  if (!horas) return `${minutos} min`
  if (!minutos) return `${horas} h`
  return `${horas} h ${minutos} min`
}
