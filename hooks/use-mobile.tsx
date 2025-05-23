"use client"

import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 640

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Verificar al cargar
    checkMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkMobile)

    // Limpiar listener
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
