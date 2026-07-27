#!/usr/bin/env node
/**
 * Rellena src/datos/imagenes.json con las URLs de las imagenes de los
 * personajes, buscandolos por nombre en AniList.
 *
 *   npm run imagenes
 *
 * COMO FUNCIONA
 *   Lee los nombres y alias de src/datos/personajes.js, busca cada uno en
 *   la API publica de AniList y guarda la URL de su imagen en un mapa
 *   { "Goku": "https://s4.anilist.co/..." }.
 *
 *   Solo guarda URLs. NO descarga ninguna imagen: en este repositorio no
 *   entra ni un archivo de imagen. La web las enlaza desde el servidor de
 *   origen igual que hacen las demas webs de este tipo.
 *
 *   Los que no encuentre los lista al final para que los pongas a mano:
 *   entras en anilist.co, buscas el personaje, clic derecho sobre su foto
 *   y "Copiar direccion de la imagen".
 *
 *   Es incremental: los que ya estan no se vuelven a pedir. Si quieres
 *   rehacer uno, borra su linea del JSON y vuelve a ejecutarlo.
 *
 * Datos: AniList (https://anilist.co) - API publica, sin clave.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PERSONAJES } from '../src/datos/personajes.js'

const AQUI = dirname(fileURLToPath(import.meta.url))
const SALIDA = resolve(AQUI, '../src/datos/imagenes.json')

const API = 'https://graphql.anilist.co'
const ESPERA_MS = 800 // el limite es 90 peticiones/minuto

const CONSULTA = `
query ($busqueda: String) {
  Page(page: 1, perPage: 5) {
    characters(search: $busqueda, sort: FAVOURITES_DESC) {
      name { full native alternative }
      image { large }
      favourites
    }
  }
}`

const dormir = (ms) => new Promise((r) => setTimeout(r, ms))
const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()

async function buscarPersonaje(termino, reintentos = 3) {
  const respuesta = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: CONSULTA, variables: { busqueda: termino } }),
  })

  if (respuesta.status === 429 && reintentos > 0) {
    const espera = Number(respuesta.headers.get('retry-after') || 60)
    console.warn(`  limite alcanzado, esperando ${espera}s...`)
    await dormir(espera * 1000)
    return buscarPersonaje(termino, reintentos - 1)
  }

  if (!respuesta.ok) throw new Error(`AniList devolvio ${respuesta.status}`)

  const json = await respuesta.json()
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join('; '))

  return json.data.Page.characters ?? []
}

/**
 * De los resultados, elige el que mejor encaje.
 * Prioriza que algun nombre coincida de verdad; si no, el mas popular.
 * Sin esto, buscar "L" devuelve cualquier cosa.
 */
function elegirMejor(resultados, personaje) {
  if (!resultados.length) return null

  const esperados = new Set([norm(personaje.n), ...personaje.a.map(norm)])

  for (const r of resultados) {
    const nombres = [r.name?.full, r.name?.native, ...(r.name?.alternative ?? [])]
      .filter(Boolean)
      .map(norm)
    if (nombres.some((n) => esperados.has(n))) return r
  }

  return resultados[0]
}

async function main() {
  let mapa = {}
  try {
    mapa = JSON.parse(await readFile(SALIDA, 'utf8'))
  } catch {
    /* primera ejecucion */
  }

  const pendientes = PERSONAJES.filter((p) => !mapa[p.n])
  console.log(
    `${PERSONAJES.length} personajes · ${Object.keys(mapa).length} ya tienen imagen · ${pendientes.length} pendientes\n`,
  )

  const sinEncontrar = []

  for (const personaje of pendientes) {
    // Probamos el nombre y, si falla, los alias.
    const terminos = [personaje.n, ...personaje.a]
    let elegido = null

    for (const termino of terminos) {
      const resultados = await buscarPersonaje(termino)
      elegido = elegirMejor(resultados, personaje)
      await dormir(ESPERA_MS)
      if (elegido?.image?.large) break
    }

    if (elegido?.image?.large) {
      mapa[personaje.n] = elegido.image.large
      console.log(`  ok    ${personaje.n}  ->  ${elegido.name.full}`)
    } else {
      sinEncontrar.push(personaje.n)
      console.log(`  FALLO ${personaje.n}`)
    }

    // Guardamos en cada vuelta: si se corta a mitad no se pierde nada.
    await writeFile(SALIDA, JSON.stringify(mapa, null, 2) + '\n', 'utf8')
  }

  console.log(`\nGuardadas ${Object.keys(mapa).length} imagenes en src/datos/imagenes.json`)

  if (sinEncontrar.length) {
    console.log('\nEstos hay que ponerlos a mano:')
    for (const nombre of sinEncontrar) console.log(`  - ${nombre}`)
    console.log('\nBusca el personaje en anilist.co, clic derecho en su foto,')
    console.log('"Copiar direccion de la imagen", y anade la linea al JSON.')
  }

  console.log('\nRevisa el resultado en la web: si algun personaje sale con')
  console.log('la foto de otro, corrige su URL a mano en el JSON.')
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
