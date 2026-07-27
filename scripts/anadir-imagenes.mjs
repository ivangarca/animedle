#!/usr/bin/env node
/**
 * Rellena src/datos/imagenes.json con las URLs de las imagenes de los
 * personajes, buscandolas en AniList.
 *
 *   npm run imagenes            solo los que faltan
 *   npm run imagenes -- --todo  rehace todos desde cero
 *
 * COMO ELIGE (y por que es estricto)
 *   La primera version de este script se quedaba con el resultado mas
 *   popular cuando no encontraba coincidencia exacta. Resultado: buscar
 *   "Goku" devolvia tambien "Rengoku" (de Demon Slayer, con mas
 *   favoritos) y Goku acababa con la cara de Rengoku.
 *
 *   Ahora un candidato solo se acepta si cumple LAS DOS condiciones:
 *     1. Alguno de sus nombres coincide exactamente con el nombre o un
 *        alias del personaje. No vale "contiene", tiene que ser igual.
 *     2. Aparece en un anime cuyo titulo encaja con el campo `serie`.
 *
 *   La segunda es la que salva de verdad: Rengoku no sale en Dragon Ball,
 *   asi que queda descartado aunque su nombre se parezca.
 *
 *   Si nadie cumple las dos, NO se escribe nada y se reporta al final.
 *   Preferimos un hueco (que la web rellena con el avatar de iniciales)
 *   antes que un dato incorrecto.
 *
 * Solo se guardan URLs. NO se descarga ninguna imagen: en este
 * repositorio no entra ni un archivo de imagen.
 *
 * Datos: AniList (https://anilist.co) - API publica, sin clave.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PERSONAJES } from '../src/datos/personajes.js'
// Reutilizamos la misma distancia de edicion que usa el buscador del juego.
import { levenshtein } from '../src/logica/busqueda.js'

const AQUI = dirname(fileURLToPath(import.meta.url))
const SALIDA = resolve(AQUI, '../src/datos/imagenes.json')

const API = 'https://graphql.anilist.co'
const ESPERA_MS = 2000 // AniList limita las rachas cortas, mejor ir despacio
const MAX_TERMINOS = 3 // nombre + dos alias, para no gastar peticiones de mas
const REHACER_TODO = process.argv.includes('--todo')

const CONSULTA = `
query ($busqueda: String) {
  Page(page: 1, perPage: 10) {
    characters(search: $busqueda, sort: FAVOURITES_DESC) {
      name { full native alternative }
      image { large }
      favourites
      media(perPage: 8, type: ANIME) {
        nodes { title { romaji english } }
      }
    }
  }
}`

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

async function buscar(termino, reintentos = 3) {
  const respuesta = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: CONSULTA, variables: { busqueda: termino } }),
  })

  if (respuesta.status === 429 && reintentos > 0) {
    const espera = Number(respuesta.headers.get('retry-after') || 60)
    console.warn(`  limite alcanzado, esperando ${espera}s...`)
    await dormir(espera * 1000)
    return buscar(termino, reintentos - 1)
  }

  if (!respuesta.ok) throw new Error(`AniList devolvio ${respuesta.status}`)

  const json = await respuesta.json()
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join('; '))

  return json.data.Page.characters ?? []
}

/** Nombres normalizados de un candidato de AniList. */
function nombresDe(candidato) {
  return [
    candidato.name?.full,
    candidato.name?.native,
    ...(candidato.name?.alternative ?? []),
  ]
    .filter(Boolean)
    .map(norm)
}

/** Titulos normalizados de los animes en los que sale. */
function seriesDe(candidato) {
  return (candidato.media?.nodes ?? [])
    .flatMap((m) => [m.title?.romaji, m.title?.english])
    .filter(Boolean)
    .map(norm)
}

/**
 * Condicion 1: el nombre encaja.
 *
 * No vale comparar cadenas enteras, porque AniList escribe los nombres al
 * reves y con otras romanizaciones:
 *   "Son Gohan"       -> "Gohan Son"
 *   "Monkey D. Luffy" -> "Luffy Monkey D."
 *   "Tanjiro Kamado"  -> "Tanjirou Kamado"
 *   "L"               -> "L Lawliet"
 *
 * Asi que comparamos CONJUNTOS DE PALABRAS: encaja si todas las palabras
 * de lo que buscamos aparecen en el nombre del candidato, en cualquier
 * orden y tolerando una letra de diferencia por palabra.
 *
 * Es permisivo con el orden pero sigue siendo estricto en lo importante:
 * "goku" no encaja con {kyoujurou, rengoku}, porque ninguna palabra
 * coincide ni se parece lo bastante.
 */
function nombreEncaja(candidato, personaje) {
  const candidatas = nombresDe(candidato).map((n) => n.split(' ').filter(Boolean))

  const parecidas = (a, b) => a === b || (a.length > 3 && levenshtein(a, b) <= 1)

  const encajaEn = (palabrasCandidato, buscado) =>
    buscado
      .split(' ')
      .filter(Boolean)
      .every((palabra) => palabrasCandidato.some((p) => parecidas(palabra, p)))

  const buscados = [norm(personaje.n), ...personaje.a.map(norm)]

  return candidatas.some((palabras) => buscados.some((b) => encajaEn(palabras, b)))
}

/** Condicion 2: sale en un anime cuyo titulo encaja con la serie. */
function serieEncaja(candidato, personaje) {
  const serie = norm(personaje.serie)
  return seriesDe(candidato).some((t) => t.includes(serie) || serie.includes(t))
}

/**
 * Elige el candidato valido. Devuelve null si ninguno cumple las dos
 * condiciones: mejor un hueco que un dato falso.
 */
function elegir(candidatos, personaje) {
  const validos = candidatos.filter(
    (c) => c.image?.large && nombreEncaja(c, personaje) && serieEncaja(c, personaje),
  )
  if (!validos.length) return null

  // Entre los validos, el mas popular suele ser la version canonica.
  // Esto es lo que descarta a "Goku: Xeno Son" en favor del Goku de siempre.
  return validos.sort((a, b) => (b.favourites ?? 0) - (a.favourites ?? 0))[0]
}

async function main() {
  let mapa = {}
  if (!REHACER_TODO) {
    try {
      mapa = JSON.parse(await readFile(SALIDA, 'utf8'))
    } catch {
      /* primera ejecucion */
    }
  } else {
    console.log('Modo --todo: se rehacen todas las imagenes desde cero.\n')
  }

  const pendientes = PERSONAJES.filter((p) => !mapa[p.n])
  console.log(
    `${PERSONAJES.length} personajes · ${Object.keys(mapa).length} ya resueltos · ${pendientes.length} por buscar\n`,
  )

  const sinEncontrar = []

  for (const personaje of pendientes) {
    // Probamos el nombre y, si no encaja, los alias.
    let elegido = null

    for (const termino of [personaje.n, ...personaje.a].slice(0, MAX_TERMINOS)) {
      const candidatos = await buscar(termino)
      await dormir(ESPERA_MS)
      elegido = elegir(candidatos, personaje)
      if (elegido) break
    }

    if (elegido) {
      mapa[personaje.n] = elegido.image.large
      console.log(`  ok    ${personaje.n}  ->  ${elegido.name.full}`)
    } else {
      sinEncontrar.push(personaje.n)
      console.log(`  ----  ${personaje.n}  (sin coincidencia fiable)`)
    }

    // Guardamos en cada vuelta: si se corta a mitad no se pierde nada.
    await writeFile(SALIDA, JSON.stringify(mapa, null, 2) + '\n', 'utf8')
  }

  // Aviso de duplicados: dos personajes con la misma URL significa que
  // uno de los dos esta mal.
  const porUrl = new Map()
  for (const [nombre, url] of Object.entries(mapa)) {
    if (!porUrl.has(url)) porUrl.set(url, [])
    porUrl.get(url).push(nombre)
  }
  const duplicados = [...porUrl.values()].filter((nombres) => nombres.length > 1)

  console.log(`\nGuardadas ${Object.keys(mapa).length} imagenes en src/datos/imagenes.json`)

  if (duplicados.length) {
    console.log('\nOJO, comparten imagen (alguno esta mal):')
    for (const nombres of duplicados) console.log(`  ${nombres.join(' = ')}`)
  }

  if (sinEncontrar.length) {
    console.log(`\nSin imagen (${sinEncontrar.length}), ponlos a mano si quieres:`)
    for (const nombre of sinEncontrar) console.log(`  - ${nombre}`)
    console.log('\nBusca el personaje en anilist.co, clic derecho en su foto,')
    console.log('"Copiar direccion de la imagen", y anade la linea al JSON.')
    console.log('Mientras no la tengan, la web usa el avatar de iniciales.')
  }
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
