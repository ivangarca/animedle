# Animedle

Juego diario de adivinar personajes de anime. Escribes un personaje y el juego te dice, atributo por atributo, qué coincide con el personaje del día: verde si acierta, amarillo si está cerca, rojo si no.

**[Jugar](#)** · *(pon aquí la URL cuando lo despliegues)*

<!-- Sustituye esto por un GIF de 5-10 segundos jugando una partida.
     Es lo primero que mira quien entra al repositorio: sin captura,
     la mayoría se va sin leer nada. -->

![Captura del juego](docs/captura.png)

## Qué tiene

- **Reto diario sin servidor.** El personaje del día se deriva de un hash de la fecha, así que todo el mundo juega el mismo sin base de datos, sin API y sin sincronización.
- **Búsqueda difusa.** Encuentra el personaje aunque escribas mal o uses otro nombre: `lufi`, `zolo`, `kakarot`, `deku`, `atack`.
- **Comparación de atributos** con tres estados, y flecha ↑ ↓ en el año para orientar la siguiente jugada.
- **Resultado compartible** en cuadrícula de emojis, sin spoilers.
- **Estadísticas y racha** persistidas en `localStorage`.
- **Tests unitarios** de toda la lógica del juego.
- **Web estática.** Cero backend, cero coste de hosting.

## Cómo funciona

### Búsqueda difusa

Es la pieza que decide si el juego se siente bien o mal: nadie quiere pelearse con un buscador para poder jugar. Cada consulta se normaliza (minúsculas, sin acentos, sin signos) y se puntúa contra el nombre canónico, los alias y las palabras sueltas del nombre. Para tolerar faltas de ortografía se usa **distancia de Levenshtein**, implementada con programación dinámica y una sola fila en memoria, con un umbral que crece según lo largo que sea lo escrito: en una palabra de tres letras no se perdona ninguna falta, en una de ocho se perdonan dos.

Como último recurso también se busca por serie, para que escribir `atack` devuelva personajes de *Attack on Titan*.

Ver [`src/logica/busqueda.js`](src/logica/busqueda.js).

### Reto diario determinista

En lugar de guardar en un servidor qué personaje toca cada día, se calcula:

```js
personaje = personajes[hash(fechaDeHoy) % personajes.length]
```

Con un hash **djb2** sobre la fecha en formato `YYYY-MM-DD`. Consecuencias prácticas: la misma respuesta para todos los jugadores, ningún backend, ninguna llamada de red y coste de hosting cero. La contrapartida es que el calendario es predecible si alguien lee el código, lo cual para un juego de este tipo es un intercambio razonable.

Ver [`src/logica/juego.js`](src/logica/juego.js).

### Lógica separada de la interfaz

Todo lo que decide el resultado de una partida vive en `src/logica/` en forma de funciones puras: entra un dato, sale un dato, sin estado escondido y sin React. Por eso se puede verificar sin navegador y sin clicar nada.

```bash
npm test
```

## Stack

React 18 · Vite · CSS plano (sin framework) · Vitest

Sin librería de estado ni de estilos a propósito: el proyecto no las necesita y añadirlas solo sumaría peso y dependencias.

## Ejecutar en local

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # tests de la lógica
npm run build      # build de producción en dist/
npm run preview    # sirve el build para comprobarlo
```

## Estructura

```
src/
  componentes/
    Buscador.jsx        input con autocompletado y teclado
    Tabla.jsx           filas de intentos
    PanelFinal.jsx      resultado, estadísticas y compartir
  logica/
    busqueda.js         normalización, Levenshtein, búsqueda difusa
    juego.js            reto diario, comparación de atributos, resumen
    estadisticas.js     persistencia de racha y estadísticas
    juego.test.js       tests
  datos/
    personajes.js       dataset
  App.jsx               estado de la partida
scripts/
  descargar-personajes.mjs   genera el dataset desde la API de AniList
```

## Datos

El dataset incluido son 48 personajes escritos a mano para poder jugar desde el primer momento. Para generar uno grande:

```bash
npm run datos          # 300 personajes
npm run datos -- 500   # 500
```

El script consulta la [API pública de AniList](https://docs.anilist.co/) (GraphQL, sin clave, 90 peticiones/minuto), ordena por número de favoritos y guarda un JSON en el repositorio. La web nunca llama a la API en producción: carga instantánea y ninguna dependencia de que el servicio esté disponible.

AniList aporta nombre, alias, género, serie, año y estudio. El rol, la afiliación y el tipo de poder no existen en la API y hay que curarlos a mano; el script los deja a `null` y avisa de cuántos faltan.

## Hoja de ruta

- [ ] Dataset ampliado a 300-500 personajes
- [ ] Guardar la partida del día en curso para poder recargar sin perderla
- [ ] **Orden de pistas por entropía**: revelar primero el atributo que descarta más candidatos
- [ ] Atributos marcados como spoiler, desactivables por el jugador
- [ ] Modo *adivina por los ojos*
- [ ] Modo *adivina por el estilo artístico* (a partir del estudio y la década)
- [ ] Modo imagen, detrás de un flag para poder desactivarlo sin tocar el resto
- [ ] Filtro por serie o por década

Los modos nuevos no son juegos distintos: son vistas distintas sobre el mismo dataset. Por eso el esquema de la ficha de personaje ya contempla `ojos`, `estudio` e `imagenUrl`.

## Nota sobre los datos y las imágenes

Proyecto personal, sin ánimo de lucro y sin publicidad. Los nombres y datos de los personajes se usan con finalidad informativa y lúdica; los derechos pertenecen a sus respectivos titulares. Este proyecto no está afiliado ni respaldado por ninguno de ellos.

Las imágenes **no se alojan en este repositorio**: cuando el modo imagen esté disponible, se enlazarán desde la URL que devuelve la API de origen.

## Licencia

MIT para el código. Ver [LICENSE](LICENSE).
