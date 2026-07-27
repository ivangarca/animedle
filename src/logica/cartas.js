/**
 * Cartas, rarezas y apertura de sobres.
 *
 * Todo lo de aqui son funciones puras. Fijate en que `abrirSobre` recibe
 * la funcion de aleatoriedad como parametro (`aleatorio`) en vez de llamar
 * a Math.random por su cuenta. Eso permite:
 *   - testear con un generador falso y resultados predecibles
 *   - abrir 100.000 sobres en un test y comprobar que las probabilidades
 *     salen las que dice el diseno
 * Es una tecnica que se llama inyeccion de dependencias, y aqui se ve
 * para que sirve de verdad.
 */

/** Coste de un sobre y recompensa por acertar un reto. */
export const COSTE_SOBRE = 100
export const MONEDAS_POR_ACIERTO = 100

/** Cartas que trae cada sobre. */
export const CARTAS_POR_SOBRE = 3

/**
 * Sobres seguidos sin legendaria tras los cuales se garantiza una.
 * En los gacha esto se llama "pity": evita que un jugador con mala
 * suerte se harte y lo deje.
 */
export const SOBRES_PARA_GARANTIA = 10

export const RAREZAS = {
  azul: { id: 'azul', nombre: 'Común', color: '#3498db', probabilidad: 0.7 },
  lila: { id: 'lila', nombre: 'Rara', color: '#9b59b6', probabilidad: 0.25 },
  amarillo: { id: 'amarillo', nombre: 'Legendaria', color: '#f1c40f', probabilidad: 0.05 },
}

/** De menos a mas valiosa. */
export const ORDEN_RAREZAS = ['azul', 'lila', 'amarillo']

/** Identificador unico de una carta: mismo personaje, distinta rareza. */
export function claveCarta(nombrePersonaje, rareza) {
  return `${nombrePersonaje}|${rareza}`
}

/**
 * Elige una rareza a partir de un numero entre 0 y 1.
 * Reparte el intervalo en tramos proporcionales a cada probabilidad.
 */
export function sortearRareza(valor) {
  let acumulado = 0
  for (const id of ORDEN_RAREZAS) {
    acumulado += RAREZAS[id].probabilidad
    if (valor < acumulado) return id
  }
  return ORDEN_RAREZAS[0] // por si los decimales no suman exactamente 1
}

/**
 * Abre un sobre.
 * @param {object[]} personajes         de donde salen las cartas
 * @param {number} sobresSinLegendaria  contador para la garantia
 * @param {() => number} aleatorio      generador, inyectable para testear
 * @returns {{cartas: {personaje: object, rareza: string}[], sobresSinLegendaria: number}}
 */
export function abrirSobre({ personajes, sobresSinLegendaria = 0, aleatorio = Math.random }) {
  const tocaGarantia = sobresSinLegendaria + 1 >= SOBRES_PARA_GARANTIA
  const cartas = []

  for (let i = 0; i < CARTAS_POR_SOBRE; i++) {
    const esUltima = i === CARTAS_POR_SOBRE - 1
    const yaHayLegendaria = cartas.some((c) => c.rareza === 'amarillo')
    const forzarLegendaria = tocaGarantia && esUltima && !yaHayLegendaria

    const rareza = forzarLegendaria ? 'amarillo' : sortearRareza(aleatorio())
    const personaje = personajes[Math.floor(aleatorio() * personajes.length)]

    cartas.push({ personaje, rareza })
  }

  const salioLegendaria = cartas.some((c) => c.rareza === 'amarillo')

  return {
    cartas,
    sobresSinLegendaria: salioLegendaria ? 0 : sobresSinLegendaria + 1,
  }
}

/** Cuantas cartas distintas existen en total. */
export function totalDeCartas(personajes) {
  return personajes.length * ORDEN_RAREZAS.length
}
