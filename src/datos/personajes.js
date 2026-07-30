/**
 * Dataset de personajes.
 *
 * Esquema de una ficha:
 *   n         {string}   Nombre canonico que se muestra
 *   a         {string[]} Alias y variantes para la busqueda (romanizaciones, apodos, faltas comunes)
 *   serie     {string}   Serie de origen
 *   temporada {string}   Saga o temporada de su primera aparicion.
 *                        '-' cuando esa serie todavia no esta curada.
 *   anio      {number}   Anio de estreno del anime
 *   rol       {string}   Protagonista | Rival | Antagonista | Secundario
 *   poder     {string}   Tipo de habilidad
 *   gen       {string}   Masculino | Femenino
 *
 * IMPORTANTE sobre `temporada`: un '-' significa "dato no disponible", no
 * un valor real. Por eso el juego nunca lo pinta en verde, ni siquiera
 * cuando los dos personajes lo tienen. Si saliera verde estaria diciendo
 * "coincidis" cuando en realidad no se sabe.
 *
 * Campos previstos para los MODOS FUTUROS (aun sin rellenar).
 * Los dejo documentados aqui a proposito: si el esquema esta pensado
 * desde el principio, cada modo nuevo son dos dias de trabajo en vez
 * de una reescritura.
 *   ojos     {string}   -> modo "adivina por los ojos"
 *   pelo     {string}   -> pistas extra del modo clasico
 *   estudio  {string}   -> modo "adivina por el estilo artistico"
 *   imagenUrl{string}   -> modo imagen. SIEMPRE la URL de la API, nunca
 *                          un archivo dentro del repositorio.
 */
export const PERSONAJES = [
  // DRAGON BALL
  // --- Saiyans ---
  { n: 'Goku', a: ['kakarot', 'kakarotto', 'son goku'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Vegeta', a: [], serie: 'Dragon Ball', temporada: 'Saga Saiyan', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Raditz', a: [], serie: 'Dragon Ball', temporada: 'Saga Saiyan', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Nappa', a: ['napa'], serie: 'Dragon Ball', temporada: 'Saga Saiyan', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Broly', a: [], serie: 'Dragon Ball', temporada: 'Películas', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  // --- Saiyans híbridos ---
  { n: 'Gohan', a: ['son gohan'], serie: 'Dragon Ball', temporada: 'Saga Saiyan', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Goten', a: ['son goten'], serie: 'Dragon Ball', temporada: 'Saga Buu', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Trunks', a: ['trunks del futuro', 'mirai trunks'], serie: 'Dragon Ball', temporada: 'Saga Cell', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  // --- Namekianos ---
  { n: 'Piccolo', a: ['picolo'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  // --- Villanos ---
  { n: 'Freezer', a: ['frieza', 'freeza'], serie: 'Dragon Ball', temporada: 'Saga Freezer', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Cell', a: ['celula', 'célula'], serie: 'Dragon Ball', temporada: 'Saga Cell', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Cell Jr.', a: ['cell jr', 'cellju', 'cell junior'], serie: 'Dragon Ball', temporada: 'Saga Cell', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Majin Buu', a: ['buu', 'boo', 'majin boo'], serie: 'Dragon Ball', temporada: 'Saga Buu', anio: 1986, rol: 'Antagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  // --- Humanos ---
  { n: 'Bulma', a: [], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: '-', gen: 'Femenino' },
  { n: 'Muten Roshi', a: ['muten', 'roshi', 'follet tortuga', 'maestro tortuga', 'mutenroi'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Krilin', a: ['krillin', 'kuririn', 'crilin'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Yamcha', a: ['yamsha', 'yamsha lobo'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Ten Shin Han', a: ['tenshinhan', 'ten', 'tien', 'tien shinhan'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Protagonista', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Chaoz', a: ['chaos', 'chiaotzu', 'chao'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Chi-Chi', a: ['chichi', 'milk'], serie: 'Dragon Ball', temporada: 'Dragon Ball', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Femenino' },
  { n: 'Videl', a: [], serie: 'Dragon Ball', temporada: 'Saga Buu', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Femenino' },
  { n: 'Mr. Satán', a: ['mr satan', 'mister satan', 'satan', 'hercule'], serie: 'Dragon Ball', temporada: 'Saga Cell', anio: 1986, rol: 'Secundario', poder: 'Artes marciales', gen: 'Masculino' },
  { n: 'Ub', a: ['uub', 'oob', 'uub buu'], serie: 'Dragon Ball', temporada: 'Saga Buu', anio: 1986, rol: 'Secundario', poder: 'Ki / Artes marciales', gen: 'Masculino' },

  //ONE PIECE
  { n: 'Monkey D. Luffy', a: ['luffy', 'lufi', 'sombrero de paja'], serie: 'One Piece', temporada: 'East Blue', anio: 1999, rol: 'Protagonista', poder: 'Fruta del Diablo', gen: 'Masculino' },
  { n: 'Roronoa Zoro', a: ['zoro', 'zolo'], serie: 'One Piece', temporada: 'East Blue', anio: 1999, rol: 'Secundario', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Nami', a: [], serie: 'One Piece', temporada: 'East Blue', anio: 1999, rol: 'Secundario', poder: 'Arma / Clima', gen: 'Femenino' },
  { n: 'Sanji', a: [], serie: 'One Piece', temporada: 'East Blue', anio: 1999, rol: 'Secundario', poder: 'Artes marciales', gen: 'Masculino' },
  { n: 'Portgas D. Ace', a: ['ace', 'portgas'], serie: 'One Piece', temporada: 'Alabasta', anio: 1999, rol: 'Secundario', poder: 'Fruta del Diablo', gen: 'Masculino' },

  { n: 'Naruto Uzumaki', a: ['naruto'], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Protagonista', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Sasuke Uchiha', a: ['sasuke'], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Rival', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Sakura Haruno', a: ['sakura'], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Secundario', poder: 'Chakra / Ninjutsu', gen: 'Femenino' },
  { n: 'Kakashi Hatake', a: ['kakashi'], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Secundario', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Itachi Uchiha', a: ['itachi'], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Antagonista', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Gaara', a: [], serie: 'Naruto', temporada: '-', anio: 2002, rol: 'Rival', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },

  { n: 'Seiya', a: ['seiya de pegaso', 'pegaso'], serie: 'Saint Seiya', temporada: '-', anio: 1986, rol: 'Protagonista', poder: 'Armadura / Cosmos', gen: 'Masculino' },
  { n: 'Ikki', a: ['ikki de fenix', 'fenix'], serie: 'Saint Seiya', temporada: '-', anio: 1986, rol: 'Secundario', poder: 'Armadura / Cosmos', gen: 'Masculino' },
  { n: 'Shiryu', a: ['shiryu de dragon'], serie: 'Saint Seiya', temporada: '-', anio: 1986, rol: 'Secundario', poder: 'Armadura / Cosmos', gen: 'Masculino' },

  // INAZUMA ELEVEN
  // Inazuma Eleven 1
  { n: 'Mark Evans', a: ['endo mamoru', 'endo', 'endou', 'mark'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Axel Blaze', a: ['gouenji', 'shuya gouenji', 'gouenji shuuya', 'axel'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Nathan Swift', a: ['kazemaru', 'kazemaru ichirouta', 'nathan'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Kevin Dragonfly', a: ['someoka', 'someoka ryuugo', 'kevin'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Jack Wallside', a: ['kabeyama', 'kabeyama heigorou', 'jack'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Shawn Frost', a: ['fubuki', 'fubuki shirou', 'shawn'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 2', anio: 2009, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Darren LaChance', a: ['tachimukai', 'tachimukai yuuki', 'darren'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 2', anio: 2009, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Austin Hobbes', a: ['toramaru', 'utsunomiya toramaru', 'austin'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 3', anio: 2010, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Nelly Raimon', a: ['natsumi', 'natsumi raimon', 'nelly'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: '-', gen: 'Femenino' },
  { n: 'Silvia Woods', a: ['aki', 'aki kino', 'kino aki', 'silvia'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: '-', gen: 'Femenino' },
  { n: 'Celia Hills', a: ['haruna', 'haruna otonashi', 'celia'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: '-', gen: 'Femenino' },
  // --- Instituto Royal ---
  { n: 'Jude Sharp', a: ['kidou', 'kidou yuuto', 'jude'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'David Samford', a: ['sakuma', 'sakuma jirou', 'david'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Ray Dark', a: ['kageyama', 'kageyama reiji', 'ray'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Antagonista', poder: '-', gen: 'Masculino' },
  // --- Otros equipos ---
  { n: 'Byron Love', a: ['aphrodi', 'afuro terumi', 'aprodi', 'byron'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 1', anio: 2008, rol: 'Rival', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Xavier Foster', a: ['hiroto', 'hiroto kiyama', 'gran', 'xavier'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 2', anio: 2009, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Caleb Stonewall', a: ['burn', 'nagumo haruya', 'nagumo', 'caleb'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 2', anio: 2009, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Jordan Greenway', a: ['gazelle', 'suzuno fuusuke', 'suzuno', 'jordan'], serie: 'Inazuma Eleven', temporada: 'Inazuma Eleven 2', anio: 2009, rol: 'Protagonista', poder: 'Supertecnica', gen: 'Masculino' },

  { n: 'Ichigo Kurosaki', a: ['ichigo'], serie: 'Bleach', temporada: '-', anio: 2004, rol: 'Protagonista', poder: 'Zanpakuto / Espiritu', gen: 'Masculino' },
  { n: 'Rukia Kuchiki', a: ['rukia'], serie: 'Bleach', temporada: '-', anio: 2004, rol: 'Secundario', poder: 'Zanpakuto / Espiritu', gen: 'Femenino' },

  { n: 'Edward Elric', a: ['edward', 'ed elric'], serie: 'Fullmetal Alchemist', temporada: '-', anio: 2003, rol: 'Protagonista', poder: 'Alquimia', gen: 'Masculino' },

  { n: 'Eren Yeager', a: ['eren'], serie: 'Attack on Titan', temporada: '-', anio: 2013, rol: 'Protagonista', poder: 'Transformacion', gen: 'Masculino' },
  { n: 'Mikasa Ackerman', a: ['mikasa'], serie: 'Attack on Titan', temporada: '-', anio: 2013, rol: 'Secundario', poder: 'Equipo de maniobras', gen: 'Femenino' },
  { n: 'Levi Ackerman', a: ['levi'], serie: 'Attack on Titan', temporada: '-', anio: 2013, rol: 'Secundario', poder: 'Equipo de maniobras', gen: 'Masculino' },

  { n: 'Tanjiro Kamado', a: ['tanjiro'], serie: 'Demon Slayer', temporada: '-', anio: 2019, rol: 'Protagonista', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Nezuko Kamado', a: ['nezuko'], serie: 'Demon Slayer', temporada: '-', anio: 2019, rol: 'Secundario', poder: 'Demonio', gen: 'Femenino' },

  { n: 'Izuku Midoriya', a: ['deku', 'midoriya'], serie: 'My Hero Academia', temporada: '-', anio: 2016, rol: 'Protagonista', poder: 'Don / Quirk', gen: 'Masculino' },
  { n: 'Katsuki Bakugo', a: ['bakugo', 'bakugou'], serie: 'My Hero Academia', temporada: '-', anio: 2016, rol: 'Rival', poder: 'Don / Quirk', gen: 'Masculino' },

  { n: 'Saitama', a: [], serie: 'One Punch Man', temporada: '-', anio: 2015, rol: 'Protagonista', poder: 'Fuerza bruta', gen: 'Masculino' },

  { n: 'Gon Freecss', a: ['gon'], serie: 'Hunter x Hunter', temporada: '-', anio: 2011, rol: 'Protagonista', poder: 'Nen', gen: 'Masculino' },
  { n: 'Killua Zoldyck', a: ['killua'], serie: 'Hunter x Hunter', temporada: '-', anio: 2011, rol: 'Secundario', poder: 'Nen', gen: 'Masculino' },

  { n: 'Yusuke Urameshi', a: ['yusuke'], serie: 'Yu Yu Hakusho', temporada: '-', anio: 1992, rol: 'Protagonista', poder: 'Energia espiritual', gen: 'Masculino' },
  { n: 'Kenshin Himura', a: ['kenshin'], serie: 'Rurouni Kenshin', temporada: '-', anio: 1996, rol: 'Protagonista', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Spike Spiegel', a: ['spike'], serie: 'Cowboy Bebop', temporada: '-', anio: 1998, rol: 'Protagonista', poder: 'Artes marciales', gen: 'Masculino' },

  { n: 'Light Yagami', a: ['light', 'kira'], serie: 'Death Note', temporada: '-', anio: 2006, rol: 'Protagonista', poder: 'Objeto sobrenatural', gen: 'Masculino' },
  { n: 'L', a: ['ele', 'lawliet'], serie: 'Death Note', temporada: '-', anio: 2006, rol: 'Rival', poder: 'Intelecto', gen: 'Masculino' },

  { n: 'Lelouch Lamperouge', a: ['lelouch', 'zero'], serie: 'Code Geass', temporada: '-', anio: 2006, rol: 'Protagonista', poder: 'Poder ocular', gen: 'Masculino' },
  { n: 'Yugi Muto', a: ['yugi'], serie: 'Yu-Gi-Oh!', temporada: '-', anio: 1998, rol: 'Protagonista', poder: 'Objeto sobrenatural', gen: 'Masculino' },
  { n: 'Ash Ketchum', a: ['ash', 'satoshi'], serie: 'Pokemon', temporada: '-', anio: 1997, rol: 'Protagonista', poder: 'Companeros / Criaturas', gen: 'Masculino' },
  { n: 'Inuyasha', a: [], serie: 'Inuyasha', temporada: '-', anio: 2000, rol: 'Protagonista', poder: 'Espadachin', gen: 'Masculino' },

  { n: 'Shinji Ikari', a: ['shinji'], serie: 'Neon Genesis Evangelion', temporada: '-', anio: 1995, rol: 'Protagonista', poder: 'Mecha', gen: 'Masculino' },
  { n: 'Asuka Langley', a: ['asuka'], serie: 'Neon Genesis Evangelion', temporada: '-', anio: 1995, rol: 'Secundario', poder: 'Mecha', gen: 'Femenino' },

  { n: 'Yuji Itadori', a: ['yuji', 'itadori'], serie: 'Jujutsu Kaisen', temporada: '-', anio: 2020, rol: 'Protagonista', poder: 'Energia maldita', gen: 'Masculino' },
  { n: 'Satoru Gojo', a: ['gojo'], serie: 'Jujutsu Kaisen', temporada: '-', anio: 2020, rol: 'Secundario', poder: 'Energia maldita', gen: 'Masculino' },

  { n: 'Vash the Stampede', a: ['vash'], serie: 'Trigun', temporada: '-', anio: 1998, rol: 'Protagonista', poder: 'Arma de fuego', gen: 'Masculino' },
]
