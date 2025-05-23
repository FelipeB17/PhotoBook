"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface EasterEggsProps {
  currentPage: number
}

export function EasterEggs({ currentPage }: EasterEggsProps) {
  const [moonVisible, setMoonVisible] = useState(false)
  const [poppyVisible, setPoppyVisible] = useState(false)
  const [moonPosition, setMoonPosition] = useState({ x: 0, y: 0 })
  const [poppyPosition, setPoppyPosition] = useState({ x: 0, y: 0 })

  // Determinar posiciones aleatorias para los easter eggs
  useEffect(() => {
    // Posición para la luna - esquina superior derecha
    setMoonPosition({
      x: Math.random() * 15 + 80, // 80-95% del ancho
      y: Math.random() * 15 + 5, // 5-20% del alto
    })

    // Posición para la amapola - esquina inferior izquierda
    setPoppyPosition({
      x: Math.random() * 15 + 5, // 5-20% del ancho
      y: Math.random() * 15 + 75, // 75-90% del alto
    })
  }, [])

  // Mostrar/ocultar easter eggs según la página
  useEffect(() => {
    // La luna aparece en páginas específicas (4, 8, 12)
    setMoonVisible(currentPage === 4 || currentPage === 8 || currentPage === 12)

    // La amapola aparece en otras páginas (3, 7, 11)
    setPoppyVisible(currentPage === 3 || currentPage === 7 || currentPage === 11)
  }, [currentPage])

  return (
    <>
      {/* Media Luna */}
      {moonVisible && (
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${moonPosition.x}%`,
            top: `${moonPosition.y}%`,
            width: "40px",
            height: "40px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0.2, 0] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            times: [0, 0.3, 0.7, 1],
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="#FFDA85"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(255, 218, 133, 0.2)"
            />
          </svg>
        </motion.div>
      )}

      {/* Amapola */}
      {poppyVisible && (
        <motion.div
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${poppyPosition.x}%`,
            top: `${poppyPosition.y}%`,
            width: "30px",
            height: "30px",
          }}
          initial={{ opacity: 0, rotate: -15 }}
          animate={{
            opacity: [0, 0.3, 0.3, 0],
            rotate: [-15, 0, 0, -15],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            times: [0, 0.3, 0.7, 1],
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C7.58 2 4 5.58 4 10C4 16.08 12 22 12 22C12 22 20 16.08 20 10C20 5.58 16.42 2 12 2Z"
              fill="rgba(255, 80, 80, 0.3)"
              stroke="rgba(255, 80, 80, 0.5)"
              strokeWidth="1"
            />
            <circle cx="12" cy="10" r="3" fill="rgba(80, 0, 0, 0.3)" />
          </svg>
        </motion.div>
      )}
    </>
  )
}
