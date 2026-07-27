import { useEffect, useMemo, useRef, useState } from 'react'
import Retrato from './Retrato.jsx'
import { buscar } from '../logica/busqueda.js'

/**
 * Buscador con autocompletado y navegacion por teclado.
 *
 * Manda hacia arriba el personaje elegido (onElegir) y no guarda nada
 * del juego: solo se ocupa de que elegir un personaje sea agradable.
 */
export default function Buscador({ personajes, usados, onElegir, deshabilitado }) {
  const [texto, setTexto] = useState('')
  const [seleccionado, setSeleccionado] = useState(0)
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)

  const sugerencias = useMemo(
    () => (texto.trim() ? buscar(texto, personajes, usados) : []),
    [texto, personajes, usados],
  )

  // Al cambiar lo escrito, vuelve a marcar la primera sugerencia.
  useEffect(() => {
    setSeleccionado(0)
    setAbierto(true)
  }, [texto])

  // Cierra el desplegable al clicar fuera.
  useEffect(() => {
    const fuera = (e) => {
      if (contenedor.current && !contenedor.current.contains(e.target)) setAbierto(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  function elegir(personaje) {
    if (!personaje) return
    onElegir(personaje)
    setTexto('')
    setAbierto(false)
  }

  function alPulsarTecla(e) {
    if (!sugerencias.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSeleccionado((i) => (i + 1) % sugerencias.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSeleccionado((i) => (i - 1 + sugerencias.length) % sugerencias.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      elegir(sugerencias[seleccionado])
    } else if (e.key === 'Escape') {
      setAbierto(false)
    }
  }

  const visible = abierto && sugerencias.length > 0 && !deshabilitado

  return (
    <div className="buscador" ref={contenedor}>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={alPulsarTecla}
        onFocus={() => setAbierto(true)}
        disabled={deshabilitado}
        placeholder='Escribe un personaje… (prueba "lufi" o "kakarot")'
        autoComplete="off"
        aria-label="Buscar personaje"
        aria-expanded={visible}
      />

      {visible && (
        <ul className="sugerencias" role="listbox">
          {sugerencias.map((p, i) => (
            <li
              key={p.n}
              role="option"
              aria-selected={i === seleccionado}
              className={i === seleccionado ? 'sel' : ''}
              onMouseEnter={() => setSeleccionado(i)}
              onClick={() => elegir(p)}
            >
              <Retrato personaje={p} tamano="mini" />
              {p.n}
              <small>{p.serie}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
