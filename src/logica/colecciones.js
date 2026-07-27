/**
 * Colecciones: jugar con todos los personajes o con una sola serie.
 *
 * Las colecciones NO estan escritas a mano: se deducen del dataset.
 * Asi, cuando anadas personajes de una serie nueva, su tematica aparece
 * sola en el menu sin que tengas que tocar nada aqui.
 */
import { PERSONAJES } from '../datos/personajes.js'

/** Identificador de la coleccion que incluye a todo el mundo. */
export const TODOS = 'todos'

/** Menos personajes que esto y la partida no tiene ninguna gracia. */
export const MINIMO_POR_COLECCION = 4

/**
 * Series con suficientes personajes para jugar, de mayor a menor.
 * @returns {{id: string, nombre: string, total: number}[]}
 */
export function coleccionesDisponibles(personajes = PERSONAJES) {
  const cuenta = new Map()
  for (const p of personajes) {
    cuenta.set(p.serie, (cuenta.get(p.serie) ?? 0) + 1)
  }

  return [...cuenta.entries()]
    .filter(([, total]) => total >= MINIMO_POR_COLECCION)
    .map(([serie, total]) => ({ id: serie, nombre: serie, total }))
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre))
}

/** Personajes que entran en una coleccion. */
export function personajesDe(coleccion, personajes = PERSONAJES) {
  if (!coleccion || coleccion === TODOS) return personajes
  return personajes.filter((p) => p.serie === coleccion)
}

/** Nombre legible para mostrar en la cabecera. */
export function nombreDeColeccion(coleccion) {
  return !coleccion || coleccion === TODOS ? 'Todos los personajes' : coleccion
}
