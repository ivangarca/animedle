/**
 * Cartas, rarezas y apertura de sobres.
 *
 * DISENO
 *   Cada personaje tiene DOS cartas:
 *     - azul     -> solo el nombre
 *     - amarillo -> el retrato del personaje
 *   La imagen es la recompensa. Por eso la rareza no es un marco distinto
 *   sobre el mismo dibujo: es que la carta buena te ensena al personaje.
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
 * Sobres seguidos sin dorada tras los cuales se garantiza una.
 * En los gacha esto se llama "pity": evita que un jugador con mala
 * suerte se harte y lo deje.
 *
 * Con 20% por carta, la probabilidad de que un sobre no traiga dorada es
 * 0.8^3 = 51%. Encadenar seis asi es un 1,8%: raro, pero le pasa a
 * alguien. La garantia esta para ese alguien.
 */
export const SOBRES_PARA_GARANTIA = 6

export const RAREZAS = {
  azul: {
    id: 'azul',
    nombre: 'Común',
    color: '#3498db',
    probabilidad: 0.8,
    muestraImagen: false,
  },
  amarillo: {
    id: 'amarillo',
    nombre: 'Dorada',
    color: '#e6a010',
    probabilidad: 0.2,
    muestraImagen: true,
  },
}

/** De menos a mas valiosa. */
export const ORDEN_RAREZAS = ['azul', 'amarillo']

/** La rareza mas alta, la que dispara la garantia. */
export const RAREZA_ESPECIAL = 'amarillo'

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
    const yaHayEspecial = cartas.some((c) => c.rareza === RAREZA_ESPECIAL)
    const forzarEspecial = tocaGarantia && esUltima && !yaHayEspecial

    const rareza = forzarEspecial ? RAREZA_ESPECIAL : sortearRareza(aleatorio())
    const personaje = personajes[Math.floor(aleatorio() * personajes.length)]

    cartas.push({ personaje, rareza })
  }

  const salioEspecial = cartas.some((c) => c.rareza === RAREZA_ESPECIAL)

  return {
    cartas,
    sobresSinLegendaria: salioEspecial ? 0 : sobresSinLegendaria + 1,
  }
}

/** Cuantas cartas distintas existen en total. */
export function totalDeCartas(personajes) {
  return personajes.length * ORDEN_RAREZAS.length
}

/**
 * Probabilidad de que un sobre traiga al menos una carta de esa rareza.
 * Se muestra en la tienda: es mas util para el jugador que la
 * probabilidad por carta, que nadie sabe interpretar.
 */
export function probabilidadPorSobre(rareza) {
  const p = RAREZAS[rareza].probabilidad
  return 1 - Math.pow(1 - p, CARTAS_POR_SOBRE)
}
