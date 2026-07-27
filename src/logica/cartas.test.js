/**
 * Tests del sistema de sobres.
 *
 * Este es el archivo que ensenar en una entrevista. Abrimos cien mil
 * sobres con un generador aleatorio controlado y comprobamos que las
 * probabilidades reales convergen a las del diseno. Verificar
 * numericamente un sistema aleatorio es algo que muy poca gente hace,
 * y solo es posible porque `abrirSobre` recibe la aleatoriedad como
 * parametro en vez de llamar a Math.random por dentro.
 */
import { describe, it, expect } from 'vitest'
import {
  CARTAS_POR_SOBRE,
  ORDEN_RAREZAS,
  RAREZAS,
  SOBRES_PARA_GARANTIA,
  abrirSobre,
  claveCarta,
  sortearRareza,
  totalDeCartas,
} from './cartas.js'
import { PERSONAJES } from '../datos/personajes.js'

describe('probabilidades declaradas', () => {
  it('suman exactamente 1', () => {
    const suma = ORDEN_RAREZAS.reduce((t, id) => t + RAREZAS[id].probabilidad, 0)
    expect(suma).toBeCloseTo(1, 10)
  })
})

describe('sortearRareza', () => {
  it('reparte el intervalo 0-1 en tramos por rareza', () => {
    expect(sortearRareza(0)).toBe('azul')
    expect(sortearRareza(0.69)).toBe('azul')
    expect(sortearRareza(0.71)).toBe('lila')
    expect(sortearRareza(0.94)).toBe('lila')
    expect(sortearRareza(0.96)).toBe('amarillo')
    expect(sortearRareza(0.999)).toBe('amarillo')
  })

  it('nunca devuelve una rareza inexistente', () => {
    for (let i = 0; i <= 100; i++) {
      expect(ORDEN_RAREZAS).toContain(sortearRareza(i / 100))
    }
  })
})

describe('abrirSobre', () => {
  it('devuelve el numero de cartas configurado', () => {
    const { cartas } = abrirSobre({ personajes: PERSONAJES })
    expect(cartas).toHaveLength(CARTAS_POR_SOBRE)
  })

  it('todas las cartas son de personajes del dataset', () => {
    const nombres = new Set(PERSONAJES.map((p) => p.n))
    const { cartas } = abrirSobre({ personajes: PERSONAJES })
    for (const carta of cartas) {
      expect(nombres.has(carta.personaje.n)).toBe(true)
      expect(ORDEN_RAREZAS).toContain(carta.rareza)
    }
  })

  it('es reproducible con un generador fijo', () => {
    // Un generador que siempre devuelve 0 -> siempre la primera rareza
    // y siempre el primer personaje.
    const cero = () => 0
    const { cartas } = abrirSobre({ personajes: PERSONAJES, aleatorio: cero })
    expect(cartas.every((c) => c.rareza === 'azul')).toBe(true)
    expect(cartas.every((c) => c.personaje.n === PERSONAJES[0].n)).toBe(true)
  })
})

describe('las tasas de drop convergen al diseno', () => {
  it('en 100.000 sobres cada rareza sale con su probabilidad', () => {
    const SOBRES = 100000
    const cuenta = { azul: 0, lila: 0, amarillo: 0 }

    // Generador congruencial lineal: deterministico y bien repartido,
    // asi el test no falla un dia por mala suerte.
    let semilla = 123456789
    const aleatorio = () => {
      semilla = (semilla * 1103515245 + 12345) % 2147483648
      return semilla / 2147483648
    }

    // Sin garantia, para medir la probabilidad pura.
    for (let i = 0; i < SOBRES; i++) {
      const { cartas } = abrirSobre({
        personajes: PERSONAJES,
        sobresSinLegendaria: 0,
        aleatorio,
      })
      for (const carta of cartas) cuenta[carta.rareza]++
    }

    const totalCartas = SOBRES * CARTAS_POR_SOBRE
    for (const id of ORDEN_RAREZAS) {
      const observada = cuenta[id] / totalCartas
      // Margen de un punto porcentual: con 300.000 muestras sobra.
      expect(observada).toBeCloseTo(RAREZAS[id].probabilidad, 2)
    }
  })
})

describe('garantia de legendaria (pity)', () => {
  it('fuerza una legendaria al llegar al limite', () => {
    // Generador que nunca daria legendaria por azar.
    const sinSuerte = () => 0
    const { cartas } = abrirSobre({
      personajes: PERSONAJES,
      sobresSinLegendaria: SOBRES_PARA_GARANTIA - 1,
      aleatorio: sinSuerte,
    })
    expect(cartas.some((c) => c.rareza === 'amarillo')).toBe(true)
  })

  it('reinicia el contador cuando sale legendaria', () => {
    const conSuerte = () => 0.99 // siempre amarillo
    const { sobresSinLegendaria } = abrirSobre({
      personajes: PERSONAJES,
      sobresSinLegendaria: 5,
      aleatorio: conSuerte,
    })
    expect(sobresSinLegendaria).toBe(0)
  })

  it('incrementa el contador cuando no sale legendaria', () => {
    const sinSuerte = () => 0
    const { sobresSinLegendaria } = abrirSobre({
      personajes: PERSONAJES,
      sobresSinLegendaria: 3,
      aleatorio: sinSuerte,
    })
    expect(sobresSinLegendaria).toBe(4)
  })

  it('nunca deja pasar mas sobres seguidos que el limite sin legendaria', () => {
    const sinSuerte = () => 0
    let contador = 0
    let peorRacha = 0

    for (let i = 0; i < 50; i++) {
      const { cartas, sobresSinLegendaria } = abrirSobre({
        personajes: PERSONAJES,
        sobresSinLegendaria: contador,
        aleatorio: sinSuerte,
      })
      contador = sobresSinLegendaria
      peorRacha = Math.max(peorRacha, contador)
      if (cartas.some((c) => c.rareza === 'amarillo')) expect(contador).toBe(0)
    }

    expect(peorRacha).toBeLessThan(SOBRES_PARA_GARANTIA)
  })
})

describe('claves y totales', () => {
  it('la clave distingue rarezas del mismo personaje', () => {
    expect(claveCarta('Goku', 'azul')).not.toBe(claveCarta('Goku', 'amarillo'))
  })

  it('hay una carta por personaje y rareza', () => {
    expect(totalDeCartas(PERSONAJES)).toBe(PERSONAJES.length * ORDEN_RAREZAS.length)
  })
})
