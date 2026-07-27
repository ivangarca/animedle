import { useState } from 'react'
import { colorDeNombre, imagenDe, iniciales } from '../logica/imagenes.js'

/**
 * Retrato de un personaje.
 *
 * Si hay imagen la enlaza desde su servidor de origen (nunca desde este
 * repositorio). Si no hay, o si falla la descarga, dibuja un avatar con
 * las iniciales y un color derivado del nombre.
 *
 * `silueta` lo pinta en negro, para las cartas que aun no tienes.
 */
export default function Retrato({ personaje, silueta = false, tamano = 'normal' }) {
  const [fallo, setFallo] = useState(false)
  const url = imagenDe(personaje)
  const mostrarImagen = url && !fallo

  return (
    <div className={`retrato ${tamano} ${silueta ? 'silueta' : ''}`}>
      {mostrarImagen ? (
        <img
          src={url}
          alt=""
          loading="lazy"
          onError={() => setFallo(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className="retrato-iniciales"
          style={{ background: colorDeNombre(personaje.n) }}
        >
          {iniciales(personaje.n)}
        </span>
      )}
    </div>
  )
}
