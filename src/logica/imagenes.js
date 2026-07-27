/**
 * Imagenes de los personajes.
 *
 * Las URLs viven en un archivo aparte (datos/imagenes.json) y no dentro
 * del dataset. Dos razones:
 *   1. El dataset se escribe a mano y las imagenes se generan con un
 *      script: mezclarlos obligaria a regenerar todo cada vez.
 *   2. Ese archivo se puede vaciar de golpe si algun dia hay que quitar
 *      las imagenes, sin tocar ni una linea de logica.
 *
 * IMPORTANTE: aqui solo hay URLs que apuntan al servidor de origen.
 * En este repositorio no se guarda ninguna imagen.
 *
 * Cuando un personaje no tiene imagen, se genera un avatar con sus
 * iniciales y un color derivado del nombre. Asi la interfaz nunca se ve
 * a medias mientras el catalogo esta incompleto.
 */
import MAPA from '../datos/imagenes.json'

/** URL de la imagen de un personaje, o null si no hay. */
export function imagenDe(personaje) {
  return personaje.imagenUrl ?? MAPA[personaje.n] ?? null
}

/** Cuantos personajes del dataset tienen imagen. */
export function conImagen(personajes) {
  return personajes.filter((p) => imagenDe(p) !== null).length
}

/**
 * Iniciales para el avatar de reserva.
 * "Monkey D. Luffy" -> "ML"   "Goku" -> "GO"   "L" -> "L"
 */
export function iniciales(nombre) {
  const palabras = nombre
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .split(/\s+/)
    .filter((p) => p.length > 1)

  if (palabras.length >= 2) {
    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase()
  }
  if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase()
  return nombre.slice(0, 2).toUpperCase()
}

/**
 * Color estable derivado del nombre.
 * El mismo personaje tendra siempre el mismo color, sin guardarlo en
 * ningun sitio: se calcula a partir de un hash del nombre.
 */
export function colorDeNombre(nombre) {
  let h = 0
  for (let i = 0; i < nombre.length; i++) {
    h = (h * 31 + nombre.charCodeAt(i)) % 360
  }
  return `hsl(${h} 45% 42%)`
}
