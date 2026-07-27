/**
 * Dataset de personajes.
 *
 * Esquema de una ficha:
 *   n        {string}   Nombre canonico que se muestra
 *   a        {string[]} Alias y variantes para la busqueda (romanizaciones, apodos, faltas comunes)
 *   serie    {string}   Serie de origen
 *   anio     {number}   Anio de estreno del anime
 *   rol      {string}   Protagonista | Rival | Antagonista | Secundario
 *   afi      {string}   Afiliacion, grupo u organizacion
 *   poder    {string}   Tipo de habilidad
 *   gen      {string}   Masculino | Femenino
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
 *
 * Estos 48 estan escritos a mano para poder jugar desde el minuto uno.
 * El siguiente paso es generar este archivo con `npm run datos`.
 */
export const PERSONAJES = [
  { n: 'Goku', a: ['kakarot', 'kakarotto', 'son goku'], serie: 'Dragon Ball', anio: 1986, rol: 'Protagonista', afi: 'Guerreros Z', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Vegeta', a: [], serie: 'Dragon Ball', anio: 1986, rol: 'Rival', afi: 'Guerreros Z', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Gohan', a: ['son gohan'], serie: 'Dragon Ball', anio: 1986, rol: 'Secundario', afi: 'Guerreros Z', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Piccolo', a: ['picolo'], serie: 'Dragon Ball', anio: 1986, rol: 'Secundario', afi: 'Guerreros Z', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Freezer', a: ['frieza', 'freeza'], serie: 'Dragon Ball', anio: 1986, rol: 'Antagonista', afi: 'Ejercito de Freezer', poder: 'Ki / Artes marciales', gen: 'Masculino' },
  { n: 'Bulma', a: [], serie: 'Dragon Ball', anio: 1986, rol: 'Secundario', afi: 'Guerreros Z', poder: 'Tecnologia', gen: 'Femenino' },

  { n: 'Monkey D. Luffy', a: ['luffy', 'lufi', 'sombrero de paja'], serie: 'One Piece', anio: 1999, rol: 'Protagonista', afi: 'Sombreros de Paja', poder: 'Fruta del Diablo', gen: 'Masculino' },
  { n: 'Roronoa Zoro', a: ['zoro', 'zolo'], serie: 'One Piece', anio: 1999, rol: 'Secundario', afi: 'Sombreros de Paja', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Nami', a: [], serie: 'One Piece', anio: 1999, rol: 'Secundario', afi: 'Sombreros de Paja', poder: 'Arma / Clima', gen: 'Femenino' },
  { n: 'Sanji', a: [], serie: 'One Piece', anio: 1999, rol: 'Secundario', afi: 'Sombreros de Paja', poder: 'Artes marciales', gen: 'Masculino' },
  { n: 'Portgas D. Ace', a: ['ace', 'portgas'], serie: 'One Piece', anio: 1999, rol: 'Secundario', afi: 'Piratas de Barbablanca', poder: 'Fruta del Diablo', gen: 'Masculino' },

  { n: 'Naruto Uzumaki', a: ['naruto'], serie: 'Naruto', anio: 2002, rol: 'Protagonista', afi: 'Aldea de la Hoja', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Sasuke Uchiha', a: ['sasuke'], serie: 'Naruto', anio: 2002, rol: 'Rival', afi: 'Aldea de la Hoja', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Sakura Haruno', a: ['sakura'], serie: 'Naruto', anio: 2002, rol: 'Secundario', afi: 'Aldea de la Hoja', poder: 'Chakra / Ninjutsu', gen: 'Femenino' },
  { n: 'Kakashi Hatake', a: ['kakashi'], serie: 'Naruto', anio: 2002, rol: 'Secundario', afi: 'Aldea de la Hoja', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Itachi Uchiha', a: ['itachi'], serie: 'Naruto', anio: 2002, rol: 'Antagonista', afi: 'Akatsuki', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },
  { n: 'Gaara', a: [], serie: 'Naruto', anio: 2002, rol: 'Rival', afi: 'Aldea de la Arena', poder: 'Chakra / Ninjutsu', gen: 'Masculino' },

  { n: 'Seiya', a: ['seiya de pegaso', 'pegaso'], serie: 'Saint Seiya', anio: 1986, rol: 'Protagonista', afi: 'Caballeros de Atenea', poder: 'Armadura / Cosmos', gen: 'Masculino' },
  { n: 'Ikki', a: ['ikki de fenix', 'fenix'], serie: 'Saint Seiya', anio: 1986, rol: 'Secundario', afi: 'Caballeros de Atenea', poder: 'Armadura / Cosmos', gen: 'Masculino' },
  { n: 'Shiryu', a: ['shiryu de dragon'], serie: 'Saint Seiya', anio: 1986, rol: 'Secundario', afi: 'Caballeros de Atenea', poder: 'Armadura / Cosmos', gen: 'Masculino' },

  { n: 'Mark Evans', a: ['endo mamoru', 'endo', 'mark'], serie: 'Inazuma Eleven', anio: 2008, rol: 'Protagonista', afi: 'Instituto Raimon', poder: 'Supertecnica', gen: 'Masculino' },
  { n: 'Axel Blaze', a: ['gouenji', 'shuya gouenji', 'axel'], serie: 'Inazuma Eleven', anio: 2008, rol: 'Secundario', afi: 'Instituto Raimon', poder: 'Supertecnica', gen: 'Masculino' },

  { n: 'Ichigo Kurosaki', a: ['ichigo'], serie: 'Bleach', anio: 2004, rol: 'Protagonista', afi: 'Shinigami', poder: 'Zanpakuto / Espiritu', gen: 'Masculino' },
  { n: 'Rukia Kuchiki', a: ['rukia'], serie: 'Bleach', anio: 2004, rol: 'Secundario', afi: 'Shinigami', poder: 'Zanpakuto / Espiritu', gen: 'Femenino' },

  { n: 'Edward Elric', a: ['edward', 'ed elric'], serie: 'Fullmetal Alchemist', anio: 2003, rol: 'Protagonista', afi: 'Ejercito de Amestris', poder: 'Alquimia', gen: 'Masculino' },

  { n: 'Eren Yeager', a: ['eren'], serie: 'Attack on Titan', anio: 2013, rol: 'Protagonista', afi: 'Cuerpo de Exploracion', poder: 'Transformacion', gen: 'Masculino' },
  { n: 'Mikasa Ackerman', a: ['mikasa'], serie: 'Attack on Titan', anio: 2013, rol: 'Secundario', afi: 'Cuerpo de Exploracion', poder: 'Equipo de maniobras', gen: 'Femenino' },
  { n: 'Levi Ackerman', a: ['levi'], serie: 'Attack on Titan', anio: 2013, rol: 'Secundario', afi: 'Cuerpo de Exploracion', poder: 'Equipo de maniobras', gen: 'Masculino' },

  { n: 'Tanjiro Kamado', a: ['tanjiro'], serie: 'Demon Slayer', anio: 2019, rol: 'Protagonista', afi: 'Cazadores de Demonios', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Nezuko Kamado', a: ['nezuko'], serie: 'Demon Slayer', anio: 2019, rol: 'Secundario', afi: 'Cazadores de Demonios', poder: 'Demonio', gen: 'Femenino' },

  { n: 'Izuku Midoriya', a: ['deku', 'midoriya'], serie: 'My Hero Academia', anio: 2016, rol: 'Protagonista', afi: 'Academia U.A.', poder: 'Don / Quirk', gen: 'Masculino' },
  { n: 'Katsuki Bakugo', a: ['bakugo', 'bakugou'], serie: 'My Hero Academia', anio: 2016, rol: 'Rival', afi: 'Academia U.A.', poder: 'Don / Quirk', gen: 'Masculino' },

  { n: 'Saitama', a: [], serie: 'One Punch Man', anio: 2015, rol: 'Protagonista', afi: 'Asociacion de Heroes', poder: 'Fuerza bruta', gen: 'Masculino' },

  { n: 'Gon Freecss', a: ['gon'], serie: 'Hunter x Hunter', anio: 2011, rol: 'Protagonista', afi: 'Cazadores', poder: 'Nen', gen: 'Masculino' },
  { n: 'Killua Zoldyck', a: ['killua'], serie: 'Hunter x Hunter', anio: 2011, rol: 'Secundario', afi: 'Familia Zoldyck', poder: 'Nen', gen: 'Masculino' },

  { n: 'Yusuke Urameshi', a: ['yusuke'], serie: 'Yu Yu Hakusho', anio: 1992, rol: 'Protagonista', afi: 'Mundo Espiritual', poder: 'Energia espiritual', gen: 'Masculino' },
  { n: 'Kenshin Himura', a: ['kenshin'], serie: 'Rurouni Kenshin', anio: 1996, rol: 'Protagonista', afi: 'Independiente', poder: 'Espadachin', gen: 'Masculino' },
  { n: 'Spike Spiegel', a: ['spike'], serie: 'Cowboy Bebop', anio: 1998, rol: 'Protagonista', afi: 'Tripulacion Bebop', poder: 'Artes marciales', gen: 'Masculino' },

  { n: 'Light Yagami', a: ['light', 'kira'], serie: 'Death Note', anio: 2006, rol: 'Protagonista', afi: 'Independiente', poder: 'Objeto sobrenatural', gen: 'Masculino' },
  { n: 'L', a: ['ele', 'lawliet'], serie: 'Death Note', anio: 2006, rol: 'Rival', afi: 'Policia / Interpol', poder: 'Intelecto', gen: 'Masculino' },

  { n: 'Lelouch Lamperouge', a: ['lelouch', 'zero'], serie: 'Code Geass', anio: 2006, rol: 'Protagonista', afi: 'Caballeros Negros', poder: 'Poder ocular', gen: 'Masculino' },
  { n: 'Yugi Muto', a: ['yugi'], serie: 'Yu-Gi-Oh!', anio: 1998, rol: 'Protagonista', afi: 'Independiente', poder: 'Objeto sobrenatural', gen: 'Masculino' },
  { n: 'Ash Ketchum', a: ['ash', 'satoshi'], serie: 'Pokemon', anio: 1997, rol: 'Protagonista', afi: 'Independiente', poder: 'Companeros / Criaturas', gen: 'Masculino' },
  { n: 'Inuyasha', a: [], serie: 'Inuyasha', anio: 2000, rol: 'Protagonista', afi: 'Independiente', poder: 'Espadachin', gen: 'Masculino' },

  { n: 'Shinji Ikari', a: ['shinji'], serie: 'Neon Genesis Evangelion', anio: 1995, rol: 'Protagonista', afi: 'NERV', poder: 'Mecha', gen: 'Masculino' },
  { n: 'Asuka Langley', a: ['asuka'], serie: 'Neon Genesis Evangelion', anio: 1995, rol: 'Secundario', afi: 'NERV', poder: 'Mecha', gen: 'Femenino' },

  { n: 'Yuji Itadori', a: ['yuji', 'itadori'], serie: 'Jujutsu Kaisen', anio: 2020, rol: 'Protagonista', afi: 'Escuela de Jujutsu', poder: 'Energia maldita', gen: 'Masculino' },
  { n: 'Satoru Gojo', a: ['gojo'], serie: 'Jujutsu Kaisen', anio: 2020, rol: 'Secundario', afi: 'Escuela de Jujutsu', poder: 'Energia maldita', gen: 'Masculino' },

  { n: 'Vash the Stampede', a: ['vash'], serie: 'Trigun', anio: 1998, rol: 'Protagonista', afi: 'Independiente', poder: 'Arma de fuego', gen: 'Masculino' },
]
