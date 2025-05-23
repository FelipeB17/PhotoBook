"use client"

import { useEffect, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear estrellas con propiedades mejoradas
    const stars: Star[] = []
    const numStars = Math.floor((canvas.width * canvas.height) / (isMobile ? 2000 : 1000))

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        color: getStarColor(),
      })
    }

    // Función para obtener un color aleatorio para las estrellas
    function getStarColor() {
      const colors = [
        "255, 255, 255", // blanco
        "255, 255, 240", // blanco cálido
        "240, 240, 255", // blanco frío
        "255, 240, 230", // amarillo suave
        "230, 240, 255", // azul suave
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Animación de las estrellas
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Dibujar estrellas
      stars.forEach((star) => {
        // Hacer que las estrellas parpadeen
        star.brightness += star.twinkleSpeed * star.twinkleDirection
        if (star.brightness > 1) {
          star.brightness = 1
          star.twinkleDirection = -1
        } else if (star.brightness < 0.3) {
          star.brightness = 0.3
          star.twinkleDirection = 1
        }

        // Dibujar la estrella
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${star.color}, ${star.brightness})`
        ctx.fill()

        // Añadir brillo alrededor de algunas estrellas
        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${star.color}, ${star.brightness * 0.2})`
          ctx.fill()

          // Añadir destellos a las estrellas más grandes
          if (star.size > 1.5 && Math.random() > 0.97) {
            drawStarSparkle(ctx, star)
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Función para dibujar destellos en las estrellas
    function drawStarSparkle(ctx: CanvasRenderingContext2D, star: Star) {
      const sparkleLength = star.size * (Math.random() * 3 + 2)
      const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]

      ctx.save()
      ctx.translate(star.x, star.y)
      ctx.rotate(Math.random() * Math.PI * 2)

      angles.forEach((angle) => {
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(Math.cos(angle) * sparkleLength, Math.sin(angle) * sparkleLength)
        ctx.strokeStyle = `rgba(${star.color}, ${star.brightness * 0.7})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      ctx.restore()
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
    </>
  )
}

interface Star {
  x: number
  y: number
  size: number
  brightness: number
  twinkleSpeed: number
  twinkleDirection: number
  color: string
}
