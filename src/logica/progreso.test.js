/**
 * Tests del progreso diario: la regla de "un reto por coleccion y por dia".
 *
 * Fijate en que `completadaHoy`, `msHastaMedianoche` y `formatearEspera`
 * son funciones puras: reciben la fecha como parametro en vez de leer el
 * reloj por su cuenta. Por eso se pueden testear sin trucos ni esperas.
 * Es la razon de que `fecha` sea un argumento y no un `new Date()` dentro.
 */
import { describe, it, expect } from 'vitest'
import {
  UN_RETO_POR_DIA,
  bloqueadaHoy,
  completadaHoy,
  formatearEspera,
  msHastaMedianoche,
} from './progreso.js'

const HOY = new Date(2026, 6, 27, 15, 30) // 27/07/2026 a las 15:30

describe('completadaHoy', () => {
  const progreso = {
    'One Piece': { dia: '2026-07-27', intentos: 4, personaje: 'Nami' },
    todos: { dia: '2026-07-26', intentos: 6, personaje: 'Goku' },
  }

  it('detecta una coleccion jugada hoy', () => {
    expect(completadaHoy(progreso, 'One Piece', HOY)).toBe(true)
  })

  it('deja volver a jugar una coleccion de ayer', () => {
    expect(completadaHoy(progreso, 'todos', HOY)).toBe(false)
  })

  it('deja jugar una coleccion que no se ha tocado nunca', () => {
    expect(completadaHoy(progreso, 'Naruto', HOY)).toBe(false)
  })
})

describe('bloqueadaHoy', () => {
  const progreso = {
    'One Piece': { dia: '2026-07-27', intentos: 4, personaje: 'Nami' },
  }

  it('sigue la regla del interruptor', () => {
    // Este test no asume el valor del interruptor: comprueba que
    // bloqueadaHoy y completadaHoy son coherentes con el.
    const bloqueada = bloqueadaHoy(progreso, 'One Piece', HOY)
    expect(bloqueada).toBe(UN_RETO_POR_DIA && completadaHoy(progreso, 'One Piece', HOY))
  })

  it('nunca bloquea una coleccion sin jugar', () => {
    expect(bloqueadaHoy(progreso, 'Naruto', HOY)).toBe(false)
  })
})

describe('msHastaMedianoche', () => {
  it('calcula lo que falta para las 00:00', () => {
    // De 15:30 a medianoche son 8 h 30 min.
    expect(msHastaMedianoche(HOY)).toBe((8 * 60 + 30) * 60 * 1000)
  })

  it('siempre devuelve un valor positivo', () => {
    expect(msHastaMedianoche(new Date(2026, 6, 27, 23, 59, 59))).toBeGreaterThan(0)
  })
})

describe('formatearEspera', () => {
  it('muestra horas y minutos', () => {
    expect(formatearEspera((8 * 60 + 30) * 60000)).toBe('8 h 30 min')
  })

  it('omite las horas cuando no hay', () => {
    expect(formatearEspera(45 * 60000)).toBe('45 min')
  })

  it('omite los minutos cuando son cero', () => {
    expect(formatearEspera(3 * 60 * 60000)).toBe('3 h')
  })

  it('avisa cuando queda menos de un minuto', () => {
    expect(formatearEspera(20000)).toBe('menos de un minuto')
  })
})
