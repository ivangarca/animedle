/**
 * Busqueda difusa de personajes.
 *
 * Es la pieza mas importante del juego: si buscar da mala sensacion,
 * el juego da mala sensacion. Tiene que encontrar el personaje aunque
 * el usuario escriba el nombre a medias, en otra romanizacion o con faltas.
 *
 * Casos que resuelve:
 *   "lufi"    -> Monkey D. Luffy   (falta de ortografia)
 *   "zolo"    -> Roronoa Zoro      (doblaje alternativo, via alias)
 *   "kakarot" -> Goku              (alias)
 *   "zoro"    -> Roronoa Zoro      (palabra suelta dentro del nombre)
 *   "atack"   -> personajes de Attack on Titan (falta + coincide por serie)
 */

/** Pasa un texto a su forma comparable: minusculas, sin acentos y sin signos. */
export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // "pokemon" encuentra "Pokémon"
    .replace(/[^a-z0-9 ]/g, '') // "yu-gi-oh!" -> "yugioh"
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Distancia de Levenshtein: numero minimo de inserciones, borrados o
 * sustituciones para convertir una cadena en otra. Programacion dinamica
 * con una sola fila en memoria, O(n) de espacio.
 */
export function levenshtein(a, b) {
  if (a === b) return 0
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  let anterior = Array.from({ length: n + 1 }, (_, j) => j)

  for (let i = 1; i <= m; i++) {
    const actual = [i]
    for (let j = 1; j <= n; j++) {
      const coste = a[i - 1] === b[j - 1] ? 0 : 1
      actual[j] = Math.min(
        anterior[j] + 1, // borrar
        actual[j - 1] + 1, // insertar
        anterior[j - 1] + coste, // sustituir
      )
    }
    anterior = actual
  }
  return anterior[n]
}

/** Umbral de faltas tolerado segun lo largo que sea lo escrito. */
function faltasPermitidas(longitud) {
  if (longitud <= 3) return 0
  if (longitud <= 6) return 1
  return 2
}

/**
 * Puntua lo bien que un personaje encaja con la consulta.
 * Menor puntuacion = mejor coincidencia. Infinity = no encaja.
 */
export function puntuar(consulta, personaje) {
  const claves = [normalizar(personaje.n), ...personaje.a.map(normalizar)]
  const maxFaltas = faltasPermitidas(consulta.length)
  let mejor = Infinity

  for (const clave of claves) {
    if (clave.startsWith(consulta)) mejor = Math.min(mejor, 0)
    else if (clave.includes(consulta)) mejor = Math.min(mejor, 1)

    // Palabras sueltas: "zoro" dentro de "roronoa zoro".
    for (const palabra of clave.split(' ')) {
      if (palabra.startsWith(consulta)) mejor = Math.min(mejor, 0.5)
      if (maxFaltas > 0) {
        const d = levenshtein(consulta, palabra)
        if (d <= maxFaltas) mejor = Math.min(mejor, 2 + d)
      }
    }

    if (maxFaltas > 0) {
      const d = levenshtein(consulta, clave)
      if (d <= maxFaltas) mejor = Math.min(mejor, 2 + d)
    }
  }

  // Ultimo recurso: coincidir por serie ("atack" -> Attack on Titan).
  if (mejor === Infinity && consulta.length >= 4) {
    const serie = normalizar(personaje.serie)
    if (serie.includes(consulta)) mejor = 4
    else if (maxFaltas > 0) {
      for (const palabra of serie.split(' ')) {
        if (levenshtein(consulta, palabra) <= maxFaltas) mejor = Math.min(mejor, 5)
      }
    }
  }

  return mejor
}

/**
 * Devuelve los mejores candidatos para lo que el usuario ha escrito.
 * @param {string} texto      lo escrito en el buscador
 * @param {object[]} personajes  dataset completo
 * @param {Set<string>} excluidos nombres ya usados en esta partida
 * @param {number} limite     cuantas sugerencias devolver
 */
export function buscar(texto, personajes, excluidos = new Set(), limite = 8) {
  const consulta = normalizar(texto)
  if (!consulta) return []

  return personajes
    .filter((p) => !excluidos.has(p.n))
    .map((p) => ({ personaje: p, puntos: puntuar(consulta, p) }))
    .filter((x) => x.puntos !== Infinity)
    .sort((a, b) => a.puntos - b.puntos || a.personaje.n.localeCompare(b.personaje.n))
    .slice(0, limite)
    .map((x) => x.personaje)
}
