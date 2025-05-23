"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HandwritingTextProps {
  text: string
  className?: string
  speed?: number
}

export function HandwritingText({ text, className = "", speed = 30 }: HandwritingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.substring(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, isAnimating])

  // Reinicia la animación cuando cambia el texto
  useEffect(() => {
    setDisplayedText("")
    setIsComplete(false)
    setIsAnimating(true)
  }, [text])

  return (
    <div className={`relative ${className}`}>
      {/* Texto que se está escribiendo */}
      <motion.span
        className="inline-block relative"
        initial={{ opacity: 1 }}
        animate={isComplete ? { opacity: 1 } : { opacity: 1 }}
      >
        {displayedText}
        {!isComplete && (
          <motion.span
            className="inline-block ml-0.5 w-0.5 h-4 sm:h-5 bg-current align-text-bottom"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </motion.span>
    </div>
  )
}
