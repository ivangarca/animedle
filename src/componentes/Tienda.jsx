import { useState } from 'react'
import Carta from './Carta.jsx'
import {
  CARTAS_POR_SOBRE,
  COSTE_SOBRE,
  MONEDAS_POR_ACIERTO,
  ORDEN_RAREZAS,
  RAREZAS,
  SOBRES_PARA_GARANTIA,
} from '../logica/cartas.js'
import { comprarSobre } from '../logica/cartera.js'

/** Tienda: gastar monedas en sobres. */
export default function Tienda({ personajes, cartera, onCartera, onVolver }) {
  const [ultimoSobre, setUltimoSobre] = useState(null)
  const puedeComprar = cartera.monedas >= COSTE_SOBRE

  function abrir() {
    const resultado = comprarSobre(personajes)
    if (!resultado) return
    onCartera(resultado.cartera)
    setUltimoSobre(resultado.cartas)
  }

  const sobresParaGarantia = SOBRES_PARA_GARANTIA - cartera.sobresSinLegendaria

  return (
    <div className="pantalla">
      <div className="barra">
        <button className="volver" onClick={onVolver}>
          ← Menú
        </button>
        <span className="monedas">{cartera.monedas} monedas</span>
      </div>

      <div className="sobre">
        <h2>Sobre de cartas</h2>
        <p>
          {CARTAS_POR_SOBRE} cartas por {COSTE_SOBRE} monedas. Acierta un reto y
          ganas {MONEDAS_POR_ACIERTO}.
        </p>

        <button className="grande" disabled={!puedeComprar} onClick={abrir}>
          {puedeComprar
            ? `Abrir sobre · ${COSTE_SOBRE} monedas`
            : `Te faltan ${COSTE_SOBRE - cartera.monedas} monedas`}
        </button>

        <ul className="probabilidades">
          {ORDEN_RAREZAS.map((id) => (
            <li key={id}>
              <span className="punto" style={{ background: RAREZAS[id].color }} />
              {RAREZAS[id].nombre}
              <b>{Math.round(RAREZAS[id].probabilidad * 100)}%</b>
            </li>
          ))}
        </ul>

        {sobresParaGarantia <= SOBRES_PARA_GARANTIA && cartera.sobresAbiertos > 0 && (
          <p className="garantia">
            {sobresParaGarantia <= 1
              ? 'El próximo sobre trae legendaria garantizada'
              : `Legendaria garantizada en ${sobresParaGarantia} sobres`}
          </p>
        )}
      </div>

      {ultimoSobre && (
        <div className="apertura">
          <h3>Has conseguido</h3>
          <div className="cartas-rejilla">
            {ultimoSobre.map((carta, i) => (
              <Carta
                key={`${carta.personaje.n}-${carta.rareza}-${i}`}
                personaje={carta.personaje}
                rareza={carta.rareza}
                nueva
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
