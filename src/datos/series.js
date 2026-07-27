/**
 * Aspecto visual por serie.
 * `fondo` es opcional: si no hay imagen, se usa un degradado con su color.
 */
export const SERIES = {
  'Dragon Ball': { color: '#f39c12' },
  'One Piece': { color: '#e74c3c' },
  Naruto: { color: '#e67e22' },
  'Saint Seiya': { color: '#f1c40f' },
  'Inazuma Eleven': { color: '#2ecc71' },
  Bleach: { color: '#bdc3c7' },
  'Attack on Titan': { color: '#8e6e53' },
  'Demon Slayer': { color: '#16a085' },
  'My Hero Academia': { color: '#27ae60' },
  'Death Note': { color: '#9b59b6' },
  'Jujutsu Kaisen': { color: '#3498db' },
}

const POR_DEFECTO = { color: '#7c5cff' }

export function estiloDeSerie(serie) {
  const { color, fondo } = SERIES[serie] ?? POR_DEFECTO

  if (fondo) {
    return {
      // La capa oscura encima es imprescindible: sin ella el texto no se lee.
      backgroundImage: `linear-gradient(rgba(14,17,23,.72), rgba(14,17,23,.72)), url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderColor: `${color}66`,
    }
  }

  return {
    background: `linear-gradient(135deg, ${color}33, var(--panel2))`,
    borderColor: `${color}66`,
  }
}
