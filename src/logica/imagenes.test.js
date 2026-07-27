import { describe, it, expect } from 'vitest'
import { colorDeNombre, imagenDe, iniciales } from './imagenes.js'
import { PERSONAJES } from '../datos/personajes.js'

describe('iniciales', () => {
  it('usa la primera y la ultima palabra', () => {
    expect(iniciales('Monkey D. Luffy')).toBe('ML')
    expect(iniciales('Naruto Uzumaki')).toBe('NU')
  })

  it('usa dos letras cuando hay una sola palabra', () => {
    expect(iniciales('Goku')).toBe('GO')
    expect(iniciales('Saitama')).toBe('SA')
  })

  it('aguanta nombres de una letra sin romperse', () => {
    expect(iniciales('L')).toBe('L')
  })

  it('ignora signos de puntuacion', () => {
    expect(iniciales('Mr. Satán')).toBe('MS')
    expect(iniciales('Cell Jr.')).toBe('CJ')
  })

  it('nunca devuelve una cadena vacia', () => {
    for (const p of PERSONAJES) {
      expect(iniciales(p.n).length).toBeGreaterThan(0)
    }
  })
})

describe('colorDeNombre', () => {
  it('es estable: el mismo nombre da siempre el mismo color', () => {
    expect(colorDeNombre('Goku')).toBe(colorDeNombre('Goku'))
  })

  it('da colores distintos a nombres distintos', () => {
    expect(colorDeNombre('Goku')).not.toBe(colorDeNombre('Vegeta'))
  })

  it('devuelve un color CSS valido', () => {
    expect(colorDeNombre('Goku')).toMatch(/^hsl\(\d+ \d+% \d+%\)$/)
  })
})

describe('imagenDe', () => {
  it('devuelve null cuando el personaje no tiene imagen', () => {
    expect(imagenDe({ n: 'Personaje Inventado' })).toBeNull()
  })

  it('prioriza la url puesta en la propia ficha', () => {
    const personaje = { n: 'Goku', imagenUrl: 'https://ejemplo.com/goku.png' }
    expect(imagenDe(personaje)).toBe('https://ejemplo.com/goku.png')
  })

  it('no revienta con ningun personaje del dataset', () => {
    for (const p of PERSONAJES) {
      const url = imagenDe(p)
      expect(url === null || typeof url === 'string').toBe(true)
    }
  })
})
