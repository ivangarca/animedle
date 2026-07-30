/**
 * Tests de la deteccion automatica de columnas.
 *
 * Todos usan un dataset inventado en lugar del real: asi comprueban el
 * MECANISMO y no se rompen cada vez que añades un personaje o un campo.
 */
import { describe, it, expect } from 'vitest'
import { CLAVES_BASE, clavesExtraDe, columnasDe, etiquetaDe } from './columnas.js'
import { TODOS } from './colecciones.js'

const ficha = (extra = {}) => ({
  a: [],
  serie: 'Dragon Ball',
  temporada: 'Saga Cell',
  anio: 1986,
  rol: 'Protagonista',
  poder: 'Ki',
  gen: 'Masculino',
  ...extra,
})

const DATASET = [
  ficha({ n: 'Goku', raza: 'Saiyan', transformacion: 'Super Saiyan' }),
  ficha({ n: 'Piccolo', raza: 'Namekiano' }),
  ficha({ n: 'Luffy', serie: 'One Piece', tripulacion: 'Sombreros de Paja' }),
  ficha({ n: 'Zoro', serie: 'One Piece', tripulacion: 'Sombreros de Paja' }),
]

const claves = (cols) => cols.map((c) => c.clave)

describe('clavesExtraDe', () => {
  it('detecta los campos que no son base', () => {
    expect(clavesExtraDe(DATASET)).toEqual(['raza', 'transformacion', 'tripulacion'])
  })

  it('ignora el nombre, los alias y la url de la imagen', () => {
    const extras = clavesExtraDe([ficha({ n: 'X', imagenUrl: 'https://x' })])
    expect(extras).toEqual([])
  })

  it('devuelve lista vacia si no hay campos extra', () => {
    expect(clavesExtraDe([ficha({ n: 'X' })])).toEqual([])
  })

  it('no repite una clave que tienen varios personajes', () => {
    expect(clavesExtraDe(DATASET).filter((c) => c === 'tripulacion')).toHaveLength(1)
  })
})

describe('columnasDe', () => {
  it('en la vista general solo saca las columnas base', () => {
    expect(claves(columnasDe(TODOS, DATASET))).toEqual(CLAVES_BASE)
  })

  it('en una tematica añade los campos propios de esa serie', () => {
    expect(claves(columnasDe('Dragon Ball', DATASET))).toEqual([
      ...CLAVES_BASE,
      'raza',
      'transformacion',
    ])
  })

  it('no mezcla los campos de una serie con los de otra', () => {
    const deOnePiece = claves(columnasDe('One Piece', DATASET))
    expect(deOnePiece).toContain('tripulacion')
    expect(deOnePiece).not.toContain('raza')
  })

  it('una serie sin campos extra se queda con las base', () => {
    const soloBase = [ficha({ n: 'Ichigo', serie: 'Bleach' })]
    expect(claves(columnasDe('Bleach', soloBase))).toEqual(CLAVES_BASE)
  })

  it('sin coleccion se comporta como la vista general', () => {
    expect(claves(columnasDe(null, DATASET))).toEqual(CLAVES_BASE)
  })
})

describe('etiquetaDe', () => {
  it('usa el nombre bonito cuando existe', () => {
    expect(etiquetaDe('anio')).toBe('Año')
    expect(etiquetaDe('transformacion')).toBe('Transformación')
  })

  it('si no existe, pone la clave con la primera en mayuscula', () => {
    expect(etiquetaDe('altura')).toBe('Altura')
    expect(etiquetaDe('armaFavorita')).toBe('ArmaFavorita')
  })
})
