/**
 * Cartera del jugador: monedas y cartas conseguidas.
 *
 * Persistencia en localStorage, igual que el resto. Y aqui viene la
 * limitacion importante, escrita para que no se olvide:
 *
 *   Las monedas viven en el navegador del jugador, asi que cualquiera
 *   puede abrir las DevTools y ponerse las que quiera. No hay forma de
 *   evitarlo en el cliente: cifrar no sirve porque la clave estaria en
 *   este mismo archivo. La solucion real es mover la autoridad a un
 *   servidor (Supabase con Row Level Security y funciones de Postgres),
 *   de forma que el cliente pida "abrir sobre" y el servidor decida.
 *
 * Se asume a proposito: es un juego de un solo jugador, sin dinero real
 * y sin ranking, asi que el unico perjudicado por hacer trampas es quien
 * las hace.
 */
import { COSTE_SOBRE, abrirSobre, claveCarta } from './cartas.js'

/*
 * v2: al pasar de tres rarezas a dos, las cartas guardadas con la rareza
 * antigua ya no existen. Subir el numero de version descarta los datos
 * viejos en lugar de arrastrar basura que la interfaz no sabe dibujar.
 * Es la forma mas simple de migrar cuando los datos no valen dinero.
 */
const CLAVE = 'animedle:cartera:v2'

const INICIAL = {
  monedas: 0,
  cartas: {}, // { "Goku|azul": 3, ... } -> cantidad, para contar duplicados
  sobresAbiertos: 0,
  sobresSinLegendaria: 0,
}

export function leerCartera() {
  try {
    const bruto = localStorage.getItem(CLAVE)
    return bruto ? { ...INICIAL, ...JSON.parse(bruto) } : { ...INICIAL }
  } catch {
    return { ...INICIAL }
  }
}

function guardar(cartera) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(cartera))
  } catch {
    /* sin persistencia, pero el juego sigue funcionando */
  }
  return cartera
}

/** Suma monedas y devuelve la cartera actualizada. */
export function anadirMonedas(cantidad) {
  const cartera = leerCartera()
  return guardar({ ...cartera, monedas: cartera.monedas + cantidad })
}

/**
 * Compra y abre un sobre.
 * @returns {{cartera: object, cartas: object[]}|null} null si no hay monedas
 */
export function comprarSobre(personajes) {
  const cartera = leerCartera()
  if (cartera.monedas < COSTE_SOBRE) return null

  const { cartas, sobresSinLegendaria } = abrirSobre({
    personajes,
    sobresSinLegendaria: cartera.sobresSinLegendaria,
  })

  const inventario = { ...cartera.cartas }
  for (const carta of cartas) {
    const clave = claveCarta(carta.personaje.n, carta.rareza)
    inventario[clave] = (inventario[clave] ?? 0) + 1
  }

  const nueva = guardar({
    monedas: cartera.monedas - COSTE_SOBRE,
    cartas: inventario,
    sobresAbiertos: cartera.sobresAbiertos + 1,
    sobresSinLegendaria,
  })

  return { cartera: nueva, cartas }
}

/** Cuantas copias tiene el jugador de una carta concreta. */
export function cantidadDe(cartera, nombrePersonaje, rareza) {
  return cartera.cartas[claveCarta(nombrePersonaje, rareza)] ?? 0
}

/** Cartas distintas conseguidas (sin contar duplicados). */
export function cartasDistintas(cartera) {
  return Object.values(cartera.cartas).filter((n) => n > 0).length
}
