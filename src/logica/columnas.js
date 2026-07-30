/**
 * Que columnas se ven en cada partida.
 *
 * COMO FUNCIONA
 *   - Jugando "Todos los personajes" se ven las columnas base:
 *     serie, temporada, año, rol, poder y género.
 *   - Jugando una tematica se ven esas mismas MAS cualquier campo extra
 *     que hayas añadido a los personajes de esa serie.
 *
 *   Los campos extra se detectan solos leyendo el dataset. No hay que
 *   declararlos en ninguna lista: si añades `raza: 'Saiyan'` a las fichas
 *   de Dragon Ball, al entrar en la tematica de Dragon Ball aparece la
 *   columna "Raza". Y solo ahi, porque los demas personajes no la tienen.
 *
 *   Para que la columna se llame bonito (con tildes o con otro nombre),
 *   añade la clave a ETIQUETAS. Si no esta, se usa la propia clave con la
 *   primera letra en mayuscula.
 */
import { PERSONAJES } from '../datos/personajes.js'
import { TODOS, personajesDe } from './colecciones.js'

/** Claves que no son atributos: no se muestran nunca como columna. */
const CLAVES_INTERNAS = new Set(['n', 'a', 'imagenUrl'])

/** Columnas comunes a todos los personajes, en orden. */
export const CLAVES_BASE = ['serie', 'temporada', 'anio', 'rol', 'poder', 'gen']

/** Nombres bonitos. Lo que no este aqui se genera automaticamente. */
export const ETIQUETAS = {
  serie: 'Serie',
  temporada: 'Temporada',
  anio: 'Año',
  rol: 'Rol',
  poder: 'Poder',
  gen: 'Género',

  // Ejemplos previstos para los campos extra por serie.
  raza: 'Raza',
  transformacion: 'Transformación',
  afiliacion: 'Afiliación',
  equipo: 'Equipo',
  posicion: 'Posición',
  aldea: 'Aldea',
  clan: 'Clan',
  tripulacion: 'Tripulación',
  fruta: 'Fruta del Diablo',
  ojos: 'Ojos',
  pelo: 'Pelo',
  estudio: 'Estudio',
}

/** "transformacion" -> "Transformacion" cuando no hay etiqueta definida. */
export function etiquetaDe(clave) {
  return ETIQUETAS[clave] ?? clave.charAt(0).toUpperCase() + clave.slice(1)
}

/**
 * Campos extra que existen en una lista de personajes: los que no son
 * base ni internos. Se devuelven en el orden en que aparecen escritos en
 * las fichas, que es el orden en que tu los has puesto.
 */
export function clavesExtraDe(personajes) {
  const base = new Set(CLAVES_BASE)
  const extras = []

  for (const personaje of personajes) {
    for (const clave of Object.keys(personaje)) {
      if (base.has(clave) || CLAVES_INTERNAS.has(clave)) continue
      if (!extras.includes(clave)) extras.push(clave)
    }
  }

  return extras
}

/**
 * Columnas de una partida.
 * @param {string|null} coleccion  TODOS, null o el nombre de una serie
 * @param {object[]} personajes    dataset completo
 */
export function columnasDe(coleccion, personajes = PERSONAJES) {
  const base = CLAVES_BASE.map((clave) => ({ clave, etiqueta: etiquetaDe(clave) }))

  // En la vista general solo las base: un campo propio de One Piece no
  // diria nada comparando a Goku con Naruto.
  if (!coleccion || coleccion === TODOS) return base

  const extras = clavesExtraDe(personajesDe(coleccion, personajes)).map((clave) => ({
    clave,
    etiqueta: etiquetaDe(clave),
  }))

  return [...base, ...extras]
}
