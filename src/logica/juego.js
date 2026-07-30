/**
 * Reglas del juego. Aqui no hay nada de React ni de interfaz: son
 * funciones puras (entra un dato, sale un dato), y por eso se pueden
 * testear facilmente. Ver juego.test.js.
 */
import { normalizar } from './busqueda.js'

/*
 * No hay limite de intentos: se juega hasta acertar.
 * El limite llegara con el modo dificil.
 */

/** Valor que significa "dato no disponible", no un valor real. */
export const SIN_DATO = '-'

/** Columnas del modo clasico, en orden. */
export const COLUMNAS = [
  { clave: 'serie', etiqueta: 'Serie' },
  { clave: 'temporada', etiqueta: 'Temporada' },
  { clave: 'anio', etiqueta: 'Año' },
  { clave: 'rol', etiqueta: 'Rol' },
  { clave: 'afi', etiqueta: 'Afiliación' },
  { clave: 'poder', etiqueta: 'Poder' },
  { clave: 'gen', etiqueta: 'Género' },
]

/* ------------------------------------------------------------------ */
/* Reto diario                                                         */
/* ------------------------------------------------------------------ */

/** Hash djb2: pequeno, rapido y determinista. */
export function hash(texto) {
  let h = 5381
  for (let i = 0; i < texto.length; i++) {
    h = ((h * 33) ^ texto.charCodeAt(i)) >>> 0
  }
  return h
}

/** Fecha en formato YYYY-MM-DD segun el reloj local del usuario. */
export function claveDelDia(fecha = new Date()) {
  const y = fecha.getFullYear()
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Numero de reto, contando desde el 1 de enero de 2024. */
export function numeroDelDia(fecha = new Date()) {
  const inicio = Date.UTC(2024, 0, 1)
  const hoy = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  return Math.floor((hoy - inicio) / 86400000)
}

/**
 * Elige el personaje del dia.
 * Al derivarlo de la fecha, todo el mundo juega el mismo sin necesidad
 * de servidor, base de datos ni sincronizacion. Coste cero.
 *
 * `sufijo` sirve para que cada coleccion tenga su propio personaje del dia:
 * si no lo pasaramos, la coleccion de Dragon Ball y la general caerian
 * siempre en el mismo indice.
 */
export function personajeDelDia(personajes, fecha = new Date(), sufijo = '') {
  return personajes[hash(claveDelDia(fecha) + sufijo) % personajes.length]
}

export function personajeAleatorio(personajes) {
  return personajes[Math.floor(Math.random() * personajes.length)]
}

/* ------------------------------------------------------------------ */
/* Comparacion de atributos                                            */
/* ------------------------------------------------------------------ */

/** Palabras significativas de un texto, para detectar parentesco. */
function palabrasClave(texto) {
  return new Set(
    normalizar(String(texto))
      .split(' ')
      .filter((p) => p.length > 3),
  )
}

function compartenPalabra(a, b) {
  const pa = palabrasClave(a)
  return [...palabrasClave(b)].some((p) => pa.has(p))
}

/**
 * Compara un personaje con el objetivo y devuelve una celda por columna.
 * estado: 'ok' (verde) | 'casi' (amarillo) | 'no' (rojo)
 *
 * El amarillo solo aparece donde tiene sentido: en el año cuando la
 * diferencia es pequena, y en afiliacion/poder cuando comparten algun
 * concepto. Si prefieres solo verde y rojo, pon casi = false y listo.
 */
export function comparar(personaje, objetivo) {
  const celdas = COLUMNAS.map(({ clave }) => {
    const valor = personaje[clave]
    const esperado = objetivo[clave]

    if (clave === 'anio') {
      const diferencia = esperado - valor
      let estado = 'no'
      if (diferencia === 0) estado = 'ok'
      else if (Math.abs(diferencia) <= 5) estado = 'casi'

      return {
        clave,
        texto: String(valor),
        // La flecha apunta hacia la respuesta: arriba si es mas nueva.
        flecha: diferencia === 0 ? null : diferencia > 0 ? '↑' : '↓',
        // Texto de ayuda, para que la flecha no haya que adivinarla.
        ayuda:
          diferencia === 0
            ? 'Mismo año'
            : diferencia > 0
              ? 'El personaje del día es de un anime más nuevo'
              : 'El personaje del día es de un anime más antiguo',
        estado,
      }
    }

    // Un '-' en temporada significa "no lo se", no un valor compartido.
    // Pintarlo verde seria mentir: diria "coincidis" cuando no hay dato.
    if (clave === 'temporada' && (valor === SIN_DATO || esperado === SIN_DATO)) {
      return {
        clave,
        texto: String(valor),
        flecha: null,
        ayuda: 'Temporada sin datos todavía',
        estado: 'no',
      }
    }

    const permiteCasi = clave === 'afi' || clave === 'poder'
    let estado = 'no'
    if (valor === esperado) estado = 'ok'
    else if (permiteCasi && compartenPalabra(valor, esperado)) estado = 'casi'

    return { clave, texto: String(valor), flecha: null, ayuda: null, estado }
  })

  return { personaje, celdas, acertado: personaje.n === objetivo.n }
}

/* ------------------------------------------------------------------ */
/* Mensajes                                                           */
/* ------------------------------------------------------------------ */

/**
 * Mensaje de victoria segun lo que has tardado.
 * Detalle pequeno que cambia mucho como se siente el juego: un texto
 * distinto da la sensacion de que el juego se ha enterado de lo que
 * has hecho.
 */
export function mensajeDeVictoria(intentos) {
  if (intentos === 1) return '¡A la primera! Eso o has hecho trampa.'
  if (intentos === 2) return '¡Casi de un tiro! Impresionante.'
  if (intentos <= 4) return '¡Muy bien! Y con margen de sobra.'
  if (intentos <= 7) return '¡Correcto! Te ha costado un poco.'
  if (intentos <= 12) return '¡Lo tenemos! Ha habido pelea.'
  return '¡Por fin! Eso ha sido una odisea.'
}

/* ------------------------------------------------------------------ */
/* Resultado compartible                                              */
/* ------------------------------------------------------------------ */

const EMOJI = { ok: '🟩', casi: '🟨', no: '🟥' }

/**
 * Cuadricula de emojis. Este es el mecanismo que hizo viral al Wordle:
 * el resultado se puede pegar en WhatsApp o Discord sin spoilear nada.
 */
export function resumenCompartible({ intentos, etiqueta = '', fecha = new Date() }) {
  const tematica = etiqueta ? ` ${etiqueta}` : ''
  const cabecera = `Animedle${tematica} #${numeroDelDia(fecha)}`
  const marcador = `${intentos.length} ${intentos.length === 1 ? 'intento' : 'intentos'}`
  const cuadricula = intentos
    .map((fila) => fila.celdas.map((c) => EMOJI[c.estado]).join(''))
    .join('\n')

  return `${cabecera} — ${marcador}\n${cuadricula}`
}
