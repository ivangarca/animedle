/**
 * Tests de la logica del juego.
 *
 * Esto es lo que separa un proyecto de portfolio de un proyecto de clase:
 * la logica esta en funciones puras, asi que se puede verificar sin
 * navegador, sin React y sin clicar nada.  Ejecuta con `npm test`.
 */
import { describe, it, expect } from 'vitest'
import { normalizar, levenshtein, buscar } from './busqueda.js'
import {
  comparar,
  personajeDelDia,
  claveDelDia,
  numeroDelDia,
  resumenCompartible,
  mensajeDeVictoria,
} from './juego.js'
import { PERSONAJES } from '../datos/personajes.js'

const buscarNombre = (n) => PERSONAJES.find((p) => p.n === n)

describe('normalizar', () => {
  it('quita mayusculas, acentos y signos', () => {
    expect(normalizar('  Pokémon  ')).toBe('pokemon')
    expect(normalizar('Yu-Gi-Oh!')).toBe('yugioh')
    expect(normalizar('Monkey D. Luffy')).toBe('monkey d luffy')
  })
})

describe('levenshtein', () => {
  it('vale 0 para cadenas iguales', () => {
    expect(levenshtein('goku', 'goku')).toBe(0)
  })
  it('cuenta una falta como distancia 1', () => {
    expect(levenshtein('lufi', 'lufy')).toBe(1)
    expect(levenshtein('zoro', 'zolo')).toBe(1)
  })
  it('es simetrica', () => {
    expect(levenshtein('naruto', 'narutu')).toBe(levenshtein('narutu', 'naruto'))
  })
})

describe('buscar', () => {
  const primero = (texto) => buscar(texto, PERSONAJES)[0]?.n

  it('encuentra por prefijo', () => {
    expect(primero('nar')).toBe('Naruto Uzumaki')
  })
  it('encuentra con faltas de ortografia', () => {
    expect(primero('lufi')).toBe('Monkey D. Luffy')
  })
  it('encuentra por alias', () => {
    expect(primero('kakarot')).toBe('Goku')
    expect(primero('deku')).toBe('Izuku Midoriya')
  })
  it('encuentra por palabra suelta del nombre', () => {
    expect(primero('zoro')).toBe('Roronoa Zoro')
  })
  it('no devuelve nada con la cadena vacia', () => {
    expect(buscar('   ', PERSONAJES)).toEqual([])
  })
  it('excluye los personajes ya usados', () => {
    const excluidos = new Set(['Goku'])
    const nombres = buscar('goku', PERSONAJES, excluidos).map((p) => p.n)
    expect(nombres).not.toContain('Goku')
  })
  it('respeta el limite de sugerencias', () => {
    expect(buscar('a', PERSONAJES, new Set(), 5).length).toBeLessThanOrEqual(5)
  })
})

describe('comparar', () => {
  const goku = buscarNombre('Goku')
  const vegeta = buscarNombre('Vegeta')
  const naruto = buscarNombre('Naruto Uzumaki')

  it('marca acertado solo cuando es el mismo personaje', () => {
    expect(comparar(goku, goku).acertado).toBe(true)
    expect(comparar(vegeta, goku).acertado).toBe(false)
  })

  it('pone todo en verde cuando aciertas', () => {
    const { celdas } = comparar(goku, goku)
    expect(celdas.every((c) => c.estado === 'ok')).toBe(true)
    expect(celdas.find((c) => c.clave === 'anio').flecha).toBeNull()
  })

  it('reconoce la serie compartida y distingue el rol', () => {
    const { celdas } = comparar(vegeta, goku)
    const porClave = Object.fromEntries(celdas.map((c) => [c.clave, c]))
    expect(porClave.serie.estado).toBe('ok')
    expect(porClave.rol.estado).toBe('no') // Rival vs Protagonista
    expect(porClave.gen.estado).toBe('ok')
  })

  it('apunta la flecha del año hacia la respuesta', () => {
    // Naruto es de 2002, Goku de 1986: hay que bajar.
    const anio = comparar(naruto, goku).celdas.find((c) => c.clave === 'anio')
    expect(anio.flecha).toBe('↓')
    expect(anio.estado).toBe('no')
  })

  it('devuelve una celda por columna', () => {
    expect(comparar(naruto, goku).celdas).toHaveLength(6)
  })
})

describe('reto diario', () => {
  it('da el mismo personaje para la misma fecha', () => {
    const a = personajeDelDia(PERSONAJES, new Date(2026, 6, 27))
    const b = personajeDelDia(PERSONAJES, new Date(2026, 6, 27))
    expect(a.n).toBe(b.n)
  })

  it('formatea la clave del dia como YYYY-MM-DD', () => {
    expect(claveDelDia(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('avanza el numero de reto un dia cada dia', () => {
    const d1 = numeroDelDia(new Date(2026, 6, 27))
    const d2 = numeroDelDia(new Date(2026, 6, 28))
    expect(d2 - d1).toBe(1)
  })

  it('varia el personaje a lo largo de los dias', () => {
    const distintos = new Set()
    for (let i = 0; i < 30; i++) {
      distintos.add(personajeDelDia(PERSONAJES, new Date(2026, 0, 1 + i)).n)
    }
    // No exigimos 30 distintos, pero si variedad razonable.
    expect(distintos.size).toBeGreaterThan(10)
  })
})

describe('resumenCompartible', () => {
  const goku = buscarNombre('Goku')
  const dosIntentos = () => [comparar(buscarNombre('Vegeta'), goku), comparar(goku, goku)]

  it('incluye el numero de intentos y una fila de emojis por intento', () => {
    const lineas = resumenCompartible({ intentos: dosIntentos() }).split('\n')

    expect(lineas[0]).toContain('2 intentos')
    expect(lineas).toHaveLength(3) // cabecera + 2 intentos
    expect(lineas[2]).toBe('🟩🟩🟩🟩🟩🟩')
  })

  it('usa el singular con un solo intento', () => {
    const texto = resumenCompartible({ intentos: [comparar(goku, goku)] })
    expect(texto.split('\n')[0]).toContain('1 intento')
    expect(texto).not.toContain('1 intentos')
  })

  it('anade la tematica a la cabecera cuando hay etiqueta', () => {
    const texto = resumenCompartible({ intentos: dosIntentos(), etiqueta: 'One Piece' })
    expect(texto.split('\n')[0]).toContain('Animedle One Piece #')
  })

  it('no anade nada a la cabecera sin etiqueta', () => {
    const texto = resumenCompartible({ intentos: dosIntentos() })
    expect(texto.split('\n')[0]).toMatch(/^Animedle #\d+/)
  })
})

describe('mensajeDeVictoria', () => {
  it('cambia segun los intentos y nunca esta vacio', () => {
    const uno = mensajeDeVictoria(1)
    expect(uno).toContain('primera')
    expect(mensajeDeVictoria(3)).not.toBe(uno)
    for (const n of [1, 2, 3, 5, 8, 12, 30]) {
      expect(mensajeDeVictoria(n).length).toBeGreaterThan(0)
    }
  })
})

describe('integridad del dataset', () => {
  it('no tiene nombres repetidos', () => {
    const nombres = PERSONAJES.map((p) => p.n)
    expect(new Set(nombres).size).toBe(nombres.length)
  })

  it('todas las fichas tienen todos los campos', () => {
    for (const p of PERSONAJES) {
      expect(typeof p.n).toBe('string')
      expect(Array.isArray(p.a)).toBe(true)
      expect(typeof p.anio).toBe('number')
      for (const campo of ['serie', 'rol', 'afi', 'poder', 'gen']) {
        expect(p[campo], `${p.n} sin ${campo}`).toBeTruthy()
      }
    }
  })
})
