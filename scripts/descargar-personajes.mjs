#!/usr/bin/env node
/**
 * Descarga los personajes mas populares de AniList y genera un JSON base.
 *
 *   npm run datos              -> 300 personajes (por defecto)
 *   npm run datos -- 500       -> 500 personajes
 *
 * Por que asi:
 *   - AniList ordena por numero de favoritos, asi que los primeros son
 *     los que la gente reconoce. Es la forma barata de tener un dataset
 *     jugable sin elegir a mano.
 *   - Se ejecuta en tu maquina y guarda un JSON en el repositorio, asi
 *     que la web en produccion NO llama a la API: carga instantanea,
 *     cero dependencia de que AniList este caido y cero rate limits.
 *
 * QUE TRAE LA API Y QUE NO
 *   Trae: nombre, alias, genero, serie, anio, estudio, URL de imagen.
 *   No trae: rol, afiliacion y tipo de poder. Esos atributos no existen
 *   en AniList y hay que curarlos a mano (o desde wikis de Fandom, que
 *   son CC-BY-SA y por tanto reutilizables citando la fuente).
 *   El script los deja a null y te dice cuantos faltan.
 *
 * IMPORTANTE: se guarda la URL de la imagen, nunca el archivo. Las
 * imagenes no entran en el repositorio.
 *
 * Datos: AniList (https://anilist.co) — API publica, sin clave.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const SALIDA = resolve(AQUI, '../src/datos/personajes.json')

const API = 'https://graphql.anilist.co'
const POR_PAGINA = 50
const ESPERA_MS = 800 // el limite es 90 peticiones/minuto: vamos sobrados
const OBJETIVO = Number(process.argv[2]) || 300

const CONSULTA = `
query ($pagina: Int, $porPagina: Int) {
  Page(page: $pagina, perPage: $porPagina) {
    pageInfo { hasNextPage }
    characters(sort: FAVOURITES_DESC) {
      id
      name { full native alternative }
      image { large }
      gender
      favourites
      media(sort: POPULARITY_DESC, type: ANIME, perPage: 1) {
        nodes {
          title { romaji english }
          startDate { year }
          studios(isMain: true) { nodes { name } }
        }
      }
    }
  }
}`

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

async function pedirPagina(pagina, reintentos = 3) {
  const respuesta = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: CONSULTA,
      variables: { pagina, porPagina: POR_PAGINA },
    }),
  })

  // 429 = te has pasado del limite. AniList dice cuanto esperar.
  if (respuesta.status === 429 && reintentos > 0) {
    const espera = Number(respuesta.headers.get('retry-after') || 60)
    console.warn(`  limite alcanzado, esperando ${espera}s...`)
    await dormir(espera * 1000)
    return pedirPagina(pagina, reintentos - 1)
  }

  if (!respuesta.ok) {
    throw new Error(`AniList devolvio ${respuesta.status} ${respuesta.statusText}`)
  }

  const json = await respuesta.json()
  if (json.errors) {
    throw new Error(`AniList: ${json.errors.map((e) => e.message).join('; ')}`)
  }
  return json.data.Page
}

/** Genero en el formato que usa el juego. */
function traducirGenero(gender) {
  if (gender === 'Male') return 'Masculino'
  if (gender === 'Female') return 'Femenino'
  return null // "Non-binary", null u otros: mejor revisarlo a mano
}

/** Convierte un personaje de AniList a una ficha del juego. */
function aFicha(c) {
  const anime = c.media?.nodes?.[0]
  const nombre = c.name?.full?.trim()
  if (!nombre || !anime) return null

  const serie = anime.title?.english || anime.title?.romaji
  const anio = anime.startDate?.year
  if (!serie || !anio) return null

  // Alias: alternativos de AniList + apellido/nombre por separado,
  // que es como los busca la gente ("zoro", "luffy", "deku").
  const alias = new Set()
  for (const alt of c.name?.alternative ?? []) {
    const limpio = alt.trim()
    if (limpio && limpio.length < 30) alias.add(limpio.toLowerCase())
  }
  for (const parte of nombre.split(/\s+/)) {
    if (parte.length > 2) alias.add(parte.toLowerCase())
  }
  alias.delete(nombre.toLowerCase())

  return {
    id: c.id,
    n: nombre,
    a: [...alias],
    serie,
    anio,
    gen: traducirGenero(c.gender),
    estudio: anime.studios?.nodes?.[0]?.name ?? null,
    imagenUrl: c.image?.large ?? null, // solo la URL, jamas el archivo
    favoritos: c.favourites ?? 0,

    // Pendientes de curacion manual:
    rol: null,
    afi: null,
    poder: null,
  }
}

async function main() {
  console.log(`Descargando los ${OBJETIVO} personajes mas populares de AniList...\n`)

  const fichas = []
  const vistos = new Set()
  let pagina = 1

  while (fichas.length < OBJETIVO) {
    const datos = await pedirPagina(pagina)

    for (const personaje of datos.characters) {
      const ficha = aFicha(personaje)
      if (!ficha || vistos.has(ficha.n)) continue
      vistos.add(ficha.n)
      fichas.push(ficha)
      if (fichas.length >= OBJETIVO) break
    }

    console.log(`  pagina ${pagina} -> ${fichas.length}/${OBJETIVO} fichas`)

    if (!datos.pageInfo.hasNextPage) break
    pagina++
    await dormir(ESPERA_MS)
  }

  await mkdir(dirname(SALIDA), { recursive: true })
  await writeFile(SALIDA, JSON.stringify(fichas, null, 2) + '\n', 'utf8')

  const sinGenero = fichas.filter((f) => !f.gen).length
  const sinCurar = fichas.filter((f) => !f.rol || !f.afi || !f.poder).length

  console.log(`\nListo: ${fichas.length} fichas en src/datos/personajes.json`)
  console.log(`  ${sinGenero} sin genero (revisar a mano)`)
  console.log(`  ${sinCurar} sin rol / afiliacion / poder (curacion manual pendiente)`)
  console.log('\nSiguiente paso: rellenar esos campos y cambiar el import de')
  console.log('personajes.js a personajes.json en src/App.jsx.')
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
