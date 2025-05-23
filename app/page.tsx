"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react"
import { HandwritingText } from "@/components/handwriting-text"
import { ReasonsGrid } from "@/components/reasons-grid"
import { StarryBackground } from "@/components/starry-background"
import { EasterEggs } from "@/components/easter-eggs"
import { useMobile } from "@/hooks/use-mobile"

export default function PhotoAlbum() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 16 // cantidad a 16 páginas, modificar si se van agregar mas
  const bookRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const isMobile = useMobile()

  useEffect(() => {
    if (bookRef.current) {
      setDimensions({
        width: bookRef.current.offsetWidth,
        height: bookRef.current.offsetHeight,
      })
    }

    const handleResize = () => {
      if (bookRef.current) {
        setDimensions({
          width: bookRef.current.offsetWidth,
          height: bookRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      controls
        .start({
          rotateY: [0, -10],
          transition: { duration: 0.3 },
        })
        .then(() => {
          setCurrentPage(currentPage + 1)
          controls.start({
            rotateY: [10, 0],
            transition: { duration: 0.3 },
          })
        })
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      controls
        .start({
          rotateY: [0, 10],
          transition: { duration: 0.3 },
        })
        .then(() => {
          setCurrentPage(currentPage - 1)
          controls.start({
            rotateY: [-10, 0],
            transition: { duration: 0.3 },
          })
        })
    }
  }

 
  const particles = Array.from({ length: isMobile ? 10 : 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isMobile ? 5 : 10) + (isMobile ? 2 : 5),
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 

    if (diff > threshold) {
      nextPage()
    } else if (diff < -threshold) {
      prevPage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Fondo de estrellas y partículas */}
      <StarryBackground />

      {/* Easter Eggs */}
      <EasterEggs currentPage={currentPage} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Book container */}
      <div className="relative w-full max-w-4xl mx-auto perspective">
        {}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[15px] sm:w-[30px] h-[80%] bg-gradient-to-b from-purple-900 to-indigo-800 rounded-l-lg shadow-inner z-0 book-spine hidden xs:block">
          <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] border-t-2 border-b-2 border-yellow-300/30"></div>
        </div>

        {/* Book */}
        <motion.div
          ref={bookRef}
          animate={controls}
          className="w-full aspect-[2/3] xs:aspect-[3/4] sm:aspect-[4/3] relative rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden book"
          style={{
            transformStyle: "preserve-3d",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left navigation area */}
          <div
            className="absolute left-0 top-0 w-1/4 sm:w-1/5 h-full z-10 cursor-w-resize flex items-center justify-start"
            onClick={prevPage}
          >
            {currentPage > 0 && (
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-1 sm:p-2 rounded-r-full ml-1 sm:ml-2"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
              </motion.div>
            )}
          </div>

          {/* Right navigation area */}
          <div
            className="absolute right-0 top-0 w-1/4 sm:w-1/5 h-full z-10 cursor-e-resize flex items-center justify-end"
            onClick={nextPage}
          >
            {currentPage < totalPages - 1 && (
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-1 sm:p-2 rounded-l-full mr-1 sm:mr-2"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
              </motion.div>
            )}
          </div>

          {/* Pages */}
          <AnimatePresence mode="wait">
            {/* PÁGINA 1: PORTADA */}
            {currentPage === 0 && (
              <motion.div
                key="cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-700 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-8 text-white book-cover"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Gold frame */}
                <div className="absolute inset-[10px] xs:inset-[15px] sm:inset-[20px] border-[2px] xs:border-[3px] border-yellow-300/50 rounded-lg"></div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center z-10 w-full px-2"
                >
                  <motion.h1
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold mb-2 xs:mb-4 sm:mb-6 text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(255,255,255,0.1)",
                        "0 0 15px rgba(255,255,255,0.3)",
                        "0 0 5px rgba(255,255,255,0.1)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {/* PERSONALIZA: Cambia el título del álbum */}
                    Nuestros Momentos
                  </motion.h1>

                  {/* Texto con animación de escritura a mano */}
                  <div className="h-6 xs:h-8 sm:h-12 mb-3 xs:mb-4 sm:mb-8">
                    <HandwritingText
                      text="Un viaje a través de nuestros recuerdos juntos"
                      className="text-sm xs:text-lg sm:text-xl md:text-2xl text-yellow-50"
                    />
                  </div>

                  <motion.div
                    className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 mx-auto relative rounded-full overflow-hidden border-2 xs:border-4 border-yellow-200/70 shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 mix-blend-overlay z-10"></div>
                    {}
                    <Image src="/img1.jpeg" alt="Nosotros" fill className="object-cover" />
                  </motion.div>

                  <motion.p
                    className="mt-4 xs:mt-6 sm:mt-8 text-sm xs:text-base sm:text-lg md:text-xl italic text-yellow-100"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {isMobile ? "Desliza para comenzar" : "Haz clic en el lado derecho para comenzar"}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {/* PÁGINA 2: PRIMEROS MOMENTOS */}
            {currentPage === 1 && (
              <motion.div
                key="page1"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: -2, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=400&width=400" alt="Recuerdo 1" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 2, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=400&width=400" alt="Recuerdo 2" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="col-span-2 text-center text-white mt-2 xs:mt-3 sm:mt-4"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-1 xs:mb-2 text-yellow-100">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestros Primeros Momentos
                    </h2>
                    <div className="h-6 xs:h-8">
                      {/* PERSONALIZA: Cambia este texto */}
                      <HandwritingText
                        text="Donde todo comenzó..."
                        className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 3: AVENTURAS */}
            {currentPage === 2 && (
              <motion.div
                key="page2"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: -5 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 0, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo transform -rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=300&width=300" alt="Aventura 1" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 0, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=300&width=300" alt="Aventura 2" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 5 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 0, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo transform rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=300&width=300" alt="Aventura 3" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="col-span-3 text-center text-white mt-2 xs:mt-3 sm:mt-4"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-1 xs:mb-2 text-yellow-100">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestras Aventuras
                    </h2>
                    <div className="h-6 xs:h-8">
                      {/* PERSONALIZA: Cambia este texto */}
                      <HandwritingText
                        text="Cada viaje es mejor cuando estamos juntos"
                        className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 4: MOMENTO ESPECIAL */}
            {currentPage === 3 && (
              <motion.div
                key="page3"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-800 to-blue-800 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    }}
                    className="w-full aspect-video relative rounded-lg overflow-hidden shadow-lg mb-3 xs:mb-4 sm:mb-6 book-photo"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 border-[2px] xs:border-[3px] border-yellow-200/20 rounded-lg z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image
                      src="/placeholder.svg?height=400&width=700"
                      alt="Momento especial"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center text-white"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-1 xs:mb-2 text-yellow-100">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestro Momento Especial
                    </h2>
                    <div className="h-6 xs:h-8">
                      {/* PERSONALIZA: Cambia este texto */}
                      <HandwritingText
                        text="Ese día que nunca olvidaremos..."
                        className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 5: TE AMO */}
            {currentPage === 4 && (
              <motion.div
                key="page4"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-700 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {}
                <div className="absolute top-8 left-8 w-12 xs:w-16 sm:w-20 h-12 xs:h-16 sm:h-20 border-t-2 border-l-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute top-8 right-8 w-12 xs:w-16 sm:w-20 h-12 xs:h-16 sm:h-20 border-t-2 border-r-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute bottom-8 left-8 w-12 xs:w-16 sm:w-20 h-12 xs:h-16 sm:h-20 border-b-2 border-l-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute bottom-8 right-8 w-12 xs:w-16 sm:w-20 h-12 xs:h-16 sm:h-20 border-b-2 border-r-2 border-yellow-300/30 hidden xs:block"></div>

                <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      rotate: 3,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                    }}
                    className="w-40 h-40 xs:w-48 xs:h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden border-2 xs:border-4 border-yellow-200/50 shadow-lg mb-4 xs:mb-6 sm:mb-8 book-photo"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 mix-blend-overlay z-10"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image src="/placeholder.svg?height=320&width=320" alt="Nosotros" fill className="object-cover" />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center text-white"
                  >
                    <motion.h2
                      className="text-2xl xs:text-3xl md:text-4xl font-bold mb-2 xs:mb-4 text-yellow-100"
                      animate={{
                        textShadow: [
                          "0 0 5px rgba(255,255,255,0.1)",
                          "0 0 15px rgba(255,255,255,0.3)",
                          "0 0 5px rgba(255,255,255,0.1)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {/* PERSONALIZA: Cambia este título */}
                      Te Amo
                    </motion.h2>
                    <div className="h-8 xs:h-10 sm:h-12">
                      {/* PERSONALIZA: Cambia este texto */}
                      <HandwritingText
                        text="Por todos los momentos que hemos compartido y los que nos esperan..."
                        className="text-sm xs:text-base sm:text-xl md:text-2xl italic text-yellow-50"
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 6: 100 RAZONES */}
            {currentPage === 5 && (
              <motion.div
                key="page5"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 flex flex-col items-center justify-start p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-2 sm:mb-4 z-10"
                >
                  <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-100 mb-1 sm:mb-2">
                    {/* PERSONALIZA: Cambia este título si lo deseas */}
                    100 Razones Por Las Que Te Amo
                  </h2>
                  <div className="h-5 xs:h-6 sm:h-8">
                    <HandwritingText
                      text="Haz clic en las tarjetas para descubrir cada razón..."
                      className="text-xs xs:text-sm sm:text-lg text-yellow-50"
                    />
                  </div>
                </motion.div>

                {}
                <div className="w-full max-w-4xl overflow-y-auto max-h-[calc(100%-80px)] xs:max-h-[calc(100%-90px)] sm:max-h-[calc(100%-120px)] z-10 p-1 sm:p-2 custom-scrollbar">
                  <ReasonsGrid isMobile={isMobile} />
                </div>
              </motion.div>
            )}

            {/* PÁGINA 7: MURO DE RECUERDOS (MEJORADO) */}
            {currentPage === 6 && (
              <motion.div
                key="page6"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Título */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-4 xs:top-5 sm:top-6 left-0 right-0 text-center z-20"
                >
                  <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-0 xs:mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {/* PERSONALIZA: Cambia este título */}
                    Nuestro Muro de Recuerdos
                  </h2>
                  <div className="h-5 xs:h-6 sm:h-8">
                    <HandwritingText
                      text="Momentos capturados para siempre..."
                      className="text-xs xs:text-sm sm:text-lg text-yellow-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </motion.div>

                {/* Muro de recuerdos con polaroids y notas */}
                <div className="relative w-full h-full max-w-4xl max-h-[65vh] xs:max-h-[70vh] sm:max-h-[75vh] mt-10 xs:mt-12 sm:mt-16 z-10">
                  {/* Polaroid 1 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: -5 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    className="absolute top-[5%] left-[5%] sm:left-[10%] w-[35%] sm:w-[30%] md:w-[25%] bg-white rounded-md shadow-xl p-1 sm:p-2 pb-4 xs:pb-6 sm:pb-8 transform -rotate-6"
                  >
                    <div className="relative w-full pb-[100%] bg-gray-200 rounded">
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Recuerdo 1"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <p className="text-center mt-1 sm:mt-2 text-gray-800 font-handwriting text-[10px] xs:text-xs sm:text-sm">
                      {/* PERSONALIZA: Cambia este texto */}
                      Nuestro primer viaje
                    </p>
                    {}
                    <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 rotate-3 w-4 xs:w-6 sm:w-8 h-6 xs:h-8 sm:h-12 bg-yellow-100/70"></div>
                  </motion.div>

                  {/* Polaroid 2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: 8 }}
                    animate={{ opacity: 1, y: 0, rotate: 8 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    className="absolute top-[15%] right-[5%] xs:right-[10%] sm:right-[15%] w-[35%] md:w-[28%] bg-white rounded-md shadow-xl p-1 xs:p-1.5 sm:p-2 pb-4 xs:pb-6 sm:pb-8 transform rotate-8"
                  >
                    <div className="relative w-full pb-[75%] bg-gray-200 rounded">
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=300&width=400"
                        alt="Recuerdo 2"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <p className="text-center mt-1 sm:mt-2 text-gray-800 font-handwriting text-[10px] xs:text-xs sm:text-sm">
                      {/* PERSONALIZA: Cambia este texto */}
                      Nuestra cena especial
                    </p>
                    {/* Clip decorativo */}
                    <div className="absolute -top-3 xs:-top-4 right-2 xs:right-3 sm:right-4 w-4 xs:w-5 sm:w-6 h-6 xs:h-8 sm:h-10 bg-gray-400/80 rounded-t-full"></div>
                  </motion.div>

                  {/* Nota adhesiva */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -3 }}
                    animate={{ opacity: 1, rotate: -3 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    className="absolute top-[40%] left-[10%] xs:left-[15%] sm:left-[20%] w-[35%] xs:w-[30%] sm:w-[25%] h-auto bg-yellow-200 p-1.5 xs:p-2 sm:p-3 shadow-md transform -rotate-3"
                  >
                    <p className="text-[10px] xs:text-xs sm:text-sm md:text-base text-gray-800 font-handwriting leading-tight">
                      {}
                      Recordar estos momentos contigo me hace sonreír cada día. ¡Te amo!
                    </p>
                  </motion.div>

                  {/* Polaroid 3 - Circular */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05, zIndex: 30 }}
                    className="absolute bottom-[15%] left-[15%] w-[30%] md:w-[22%] aspect-square bg-white rounded-full shadow-xl p-1.5 xs:p-2 overflow-hidden border-2 xs:border-4 border-white"
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Recuerdo 3"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Cinta washi decorativa */}
                    <div className="absolute -top-2 -right-2 -left-2 h-3 xs:h-4 bg-pink-300/70 -rotate-6"></div>
                  </motion.div>

                  {/* Polaroid 4 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotate: -7 }}
                    animate={{ opacity: 1, y: 0, rotate: -7 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                    className="absolute bottom-[10%] right-[10%] w-[40%] md:w-[32%] bg-white rounded-md shadow-xl p-1 xs:p-1.5 sm:p-2 pb-4 xs:pb-6 sm:pb-8 transform -rotate-7"
                  >
                    <div className="relative w-full pb-[56.25%] bg-gray-200 rounded">
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Recuerdo 4"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <p className="text-center mt-1 sm:mt-2 text-gray-800 font-handwriting text-[10px] xs:text-xs sm:text-sm">
                      {/* PERSONALIZA: Cambia este texto */}
                      Nuestro lugar favorito
                    </p>
                    {/* Cinta adhesiva decorativa */}
                    <div className="absolute -top-3 left-4 xs:left-5 sm:left-6 w-5 xs:w-6 sm:w-8 h-8 xs:h-10 sm:h-12 bg-blue-100/70 rotate-12"></div>
                  </motion.div>

                  {/* Polaroid 5 - Hexagonal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.05, zIndex: 30 }}
                    className="absolute top-[45%] right-[25%] w-[25%] md:w-[20%] aspect-square bg-white shadow-xl p-1.5 xs:p-2 overflow-hidden"
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden bg-gray-200"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    >
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Recuerdo 5"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>

                  {/* Elementos decorativos */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="absolute top-[30%] right-[5%] w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-yellow-200"
                  >
                    <Star className="w-full h-full drop-shadow-lg" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute bottom-[25%] left-[5%] w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-pink-200"
                  >
                    <Heart className="w-full h-full drop-shadow-lg" />
                  </motion.div>

                  {/* Cinta washi horizontal */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.7 }}
                    className="absolute top-[65%] left-0 right-0 h-4 xs:h-5 sm:h-6 bg-purple-300/30 -rotate-1 origin-left z-[5]"
                  ></motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 8: MOMENTOS DIVERTIDOS */}
            {currentPage === 7 && (
              <motion.div
                key="page7"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-3 xs:mb-4 sm:mb-6 z-10"
                >
                  <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                    {/* PERSONALIZA: Cambia este título */}
                    Momentos Divertidos
                  </h2>
                  <div className="h-5 xs:h-6 sm:h-8">
                    <HandwritingText
                      text="Porque contigo la vida es más alegre..."
                      className="text-xs xs:text-sm sm:text-lg md:text-xl text-yellow-50"
                    />
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-3 xs:gap-4 sm:gap-6 w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ x: -50, opacity: 0, rotate: -5 }}
                    animate={{ x: 0, opacity: 1, rotate: -5 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo transform -rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Momento divertido 1"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0, rotate: 5 }}
                    animate={{ x: 0, opacity: 1, rotate: 5 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                    className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo transform rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Momento divertido 2"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="col-span-2 text-center text-white mt-2 xs:mt-3 sm:mt-4"
                  >
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50 italic">
                      {/* PERSONALIZA: Cambia este texto */}
                      "La risa es el lenguaje del alma, y contigo mi alma habla sin parar."
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 9: CITAS FAVORITAS */}
            {currentPage === 8 && (
              <motion.div
                key="page8"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-800 to-pink-700 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Decorative elements - hidden on very small screens */}
                <div className="absolute top-12 left-12 w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 border-t-2 border-l-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute top-12 right-12 w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 border-t-2 border-r-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute bottom-12 left-12 w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 border-b-2 border-l-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute bottom-12 right-12 w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 border-b-2 border-r-2 border-yellow-300/30 hidden xs:block"></div>

                <div className="flex flex-col items-center w-full max-w-3xl relative z-10 space-y-4 xs:space-y-6 sm:space-y-8">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-1 xs:mb-2"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestras Frases Favoritas
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 sm:p-6 rounded-lg border border-white/20 shadow-lg"
                  >
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50 italic mb-2 xs:mb-3 sm:mb-4">
                      {/* PERSONALIZA: Cambia esta cita */}
                      "El amor no se trata de mirarse el uno al otro, sino de mirar juntos en la misma dirección."
                    </p>
                    <p className="text-right text-xs sm:text-sm text-yellow-100">— Antoine de Saint-Exupéry</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 sm:p-6 rounded-lg border border-white/20 shadow-lg"
                  >
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50 italic mb-2 xs:mb-3 sm:mb-4">
                      {/* PERSONALIZA: Cambia esta cita */}
                      "En tus ojos encontré mi hogar, en tu corazón hallé mi lugar en el mundo."
                    </p>
                    <p className="text-right text-xs sm:text-sm text-yellow-100">— Nuestra historia</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 sm:p-6 rounded-lg border border-white/20 shadow-lg"
                  >
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl text-yellow-50 italic mb-2 xs:mb-3 sm:mb-4">
                      {/* PERSONALIZA: Cambia esta cita */}
                      "Contigo, cada día ordinario se convierte en un recuerdo extraordinario."
                    </p>
                    <p className="text-right text-xs sm:text-sm text-yellow-100">— Tú y yo</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 10: SUEÑOS JUNTOS */}
            {currentPage === 9 && (
              <motion.div
                key="page9"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-blue-700 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="flex flex-col md:flex-row items-center w-full max-w-4xl relative z-10 gap-4 xs:gap-6 sm:gap-8">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full md:w-1/2"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg book-photo">
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                      <div className="absolute inset-0 border-[2px] xs:border-[3px] border-yellow-200/20 rounded-lg z-10 pointer-events-none"></div>
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=500&width=500"
                        alt="Nuestros sueños"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="w-full md:w-1/2 text-white"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-2 xs:mb-3 sm:mb-4 text-yellow-100">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestros Sueños Juntos
                    </h2>
                    <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-200 text-base xs:text-lg sm:text-xl">✦</div>
                        <p className="text-xs xs:text-sm sm:text-base text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          Viajar por el mundo y conocer nuevas culturas
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-200 text-base xs:text-lg sm:text-xl">✦</div>
                        <p className="text-xs xs:text-sm sm:text-base text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          Construir nuestro hogar soñado
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-200 text-base xs:text-lg sm:text-xl">✦</div>
                        <p className="text-xs xs:text-sm sm:text-base text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          Aprender a cocinar juntos platos de todo el mundo
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-200 text-base xs:text-lg sm:text-xl">✦</div>
                        <p className="text-xs xs:text-sm sm:text-base text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          Crear recuerdos inolvidables en cada aniversario
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-200 text-base xs:text-lg sm:text-xl">✦</div>
                        <p className="text-xs xs:text-sm sm:text-base text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          Envejecer juntos, siempre enamorados como el primer día
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 11: MOMENTOS ROMÁNTICOS */}
            {currentPage === 10 && (
              <motion.div
                key="page10"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-pink-800 to-purple-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 w-full max-w-4xl relative z-10">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center text-white col-span-1 md:col-span-2"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold mb-1 xs:mb-2 text-yellow-100">
                      {/* PERSONALIZA: Cambia este título */}
                      Momentos Románticos
                    </h2>
                    <div className="h-6 xs:h-7 sm:h-8 mb-2 xs:mb-3 sm:mb-4">
                      <HandwritingText
                        text="Porque cada instante contigo es mágico..."
                        className="text-xs xs:text-sm sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
                    animate={{ scale: 1, opacity: 1, rotate: -3 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                    className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg book-photo transform -rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image
                      src="/placeholder.svg?height=600&width=450"
                      alt="Momento romántico 1"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 xs:p-3 text-white text-center">
                      {/* PERSONALIZA: Cambia este texto */}
                      <p className="text-xs sm:text-sm">Nuestra primera cita</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotate: 3 }}
                    animate={{ scale: 1, opacity: 1, rotate: 3 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                    className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg book-photo transform rotate-3"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen */}
                    <Image
                      src="/placeholder.svg?height=600&width=450"
                      alt="Momento romántico 2"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 xs:p-3 text-white text-center">
                      {/* PERSONALIZA: Cambia este texto */}
                      <p className="text-xs sm:text-sm">Nuestro aniversario</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 12: LUGARES ESPECIALES */}
            {currentPage === 11 && (
              <motion.div
                key="page11"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-blue-800 to-indigo-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="flex flex-col items-center w-full max-w-4xl relative z-10">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-3 xs:mb-4 sm:mb-6"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestros Lugares Especiales
                    </h2>
                    <div className="h-5 xs:h-6 sm:h-8">
                      <HandwritingText
                        text="Cada rincón guarda una historia nuestra..."
                        className="text-xs xs:text-sm sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-4 w-full">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo mb-2 xs:mb-3">
                        <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=300&width=300"
                          alt="Lugar 1"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                        {/* PERSONALIZA: Cambia este texto */}
                        El parque donde nos conocimos
                      </h3>
                    </motion.div>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo mb-2 xs:mb-3">
                        <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=300&width=300"
                          alt="Lugar 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                        {/* PERSONALIZA: Cambia este texto */}
                        Nuestro restaurante favorito
                      </h3>
                    </motion.div>

                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo mb-2 xs:mb-3">
                        <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=300&width=300"
                          alt="Lugar 3"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                        {/* PERSONALIZA: Cambia este texto */}
                        La playa de nuestras vacaciones
                      </h3>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 13: CANCIONES ESPECIALES */}
            {currentPage === 12 && (
              <motion.div
                key="page12"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-4 xs:mb-6 sm:mb-8"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                      {/* PERSONALIZA: Cambia este título */}
                      Nuestras Canciones
                    </h2>
                    <div className="h-5 xs:h-6 sm:h-8">
                      <HandwritingText
                        text="La banda sonora de nuestra historia..."
                        className="text-xs xs:text-sm sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>

                  <div className="w-full space-y-3 xs:space-y-4 sm:space-y-6">
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 rounded-lg border border-white/20 shadow-lg flex items-center"
                    >
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 relative rounded-full overflow-hidden mr-2 xs:mr-3 sm:mr-4 flex-shrink-0">
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Canción 1"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                          {/* PERSONALIZA: Cambia este texto */}
                          Nuestra primera canción
                        </h3>
                        <p className="text-xs sm:text-sm text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          "La que sonaba cuando nos conocimos"
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 rounded-lg border border-white/20 shadow-lg flex items-center"
                    >
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 relative rounded-full overflow-hidden mr-2 xs:mr-3 sm:mr-4 flex-shrink-0">
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Canción 2"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                          {/* PERSONALIZA: Cambia este texto */}
                          La canción de nuestro primer baile
                        </h3>
                        <p className="text-xs sm:text-sm text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          "Esa que siempre nos hace bailar"
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-sm p-3 xs:p-4 rounded-lg border border-white/20 shadow-lg flex items-center"
                    >
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 relative rounded-full overflow-hidden mr-2 xs:mr-3 sm:mr-4 flex-shrink-0">
                        {/* PERSONALIZA: Reemplaza esta imagen */}
                        <Image
                          src="/placeholder.svg?height=64&width=64"
                          alt="Canción 3"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-yellow-100">
                          {/* PERSONALIZA: Cambia este texto */}
                          Nuestra canción favorita
                        </h3>
                        <p className="text-xs sm:text-sm text-yellow-50">
                          {/* PERSONALIZA: Cambia este texto */}
                          "La que siempre nos recuerda lo especial que es nuestro amor"
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 14: CARTA DE AMOR */}
            {currentPage === 13 && (
              <motion.div
                key="page13"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-pink-900 to-purple-800 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Decorative elements - hidden on very small screens */}
                <div className="absolute top-10 left-10 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 border-t-2 border-l-2 border-yellow-300/30 hidden xs:block"></div>
                <div className="absolute bottom-10 right-10 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 border-b-2 border-r-2 border-yellow-300/30 hidden xs:block"></div>

                <div className="flex flex-col items-center w-full max-w-2xl relative z-10">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-3 xs:mb-4 sm:mb-6"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                      {/* PERSONALIZA: Cambia este título */}
                      Mi Carta Para Ti
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm p-4 xs:p-6 sm:p-8 rounded-lg border border-white/20 shadow-lg w-full"
                  >
                    <div className="space-y-2 xs:space-y-3 sm:space-y-4 text-yellow-50">
                      <p className="text-sm xs:text-base sm:text-lg italic">
                        {/* PERSONALIZA: Cambia este texto */}
                        Querida mía,
                      </p>
                      <p className="text-xs xs:text-sm sm:text-base">
                        {/* PERSONALIZA: Cambia este texto */}
                        Desde que entraste en mi vida, todo ha cambiado. Los colores son más brillantes, las risas más
                        sinceras y los momentos más especiales. Contigo he aprendido lo que significa amar de verdad.
                      </p>
                      <p className="text-xs xs:text-sm sm:text-base">
                        {/* PERSONALIZA: Cambia este texto */}
                        Cada día a tu lado es un regalo que atesoro. Tu sonrisa ilumina mis mañanas, tu voz calma mis
                        inquietudes y tu amor me hace sentir el hombre más afortunado del mundo.
                      </p>
                      <p className="text-xs xs:text-sm sm:text-base">
                        {/* PERSONALIZA: Cambia este texto */}
                        Gracias por compartir tu vida conmigo, por soñar juntos y por construir esta historia que apenas
                        comienza. Te prometo estar siempre a tu lado, en los buenos y malos momentos, celebrando cada
                        logro y superando cada obstáculo juntos.
                      </p>
                      <p className="text-right text-sm xs:text-base sm:text-lg italic">
                        {/* PERSONALIZA: Cambia este texto */}
                        Con todo mi amor,
                      </p>
                      <p className="text-right text-xs xs:text-sm sm:text-base">
                        {/* PERSONALIZA: Cambia este texto */}
                        Tu amor
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 15: MOMENTOS COTIDIANOS */}
            {currentPage === 14 && (
              <motion.div
                key="page14"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-blue-900 flex items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                <div className="flex flex-col items-center w-full max-w-4xl relative z-10">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-3 xs:mb-4 sm:mb-6"
                  >
                    <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-yellow-100 mb-1 xs:mb-2">
                      {/* PERSONALIZA: Cambia este título */}
                      Pequeños Momentos, Grandes Recuerdos
                    </h2>
                    <div className="h-5 xs:h-6 sm:h-8">
                      <HandwritingText
                        text="Porque lo cotidiano también es mágico..."
                        className="text-xs xs:text-sm sm:text-lg md:text-xl text-yellow-50"
                      />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 w-full">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                    >
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Momento cotidiano 1"
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                    >
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Momento cotidiano 2"
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                    >
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Momento cotidiano 3"
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="aspect-square relative rounded-lg overflow-hidden shadow-lg book-photo"
                    >
                      <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] z-10 pointer-events-none"></div>
                      {/* PERSONALIZA: Reemplaza esta imagen */}
                      <Image
                        src="/placeholder.svg?height=200&width=200"
                        alt="Momento cotidiano 4"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-center mt-3 xs:mt-4 sm:mt-6 text-white"
                  >
                    <p className="text-sm xs:text-base sm:text-lg text-yellow-50 italic">
                      {/* PERSONALIZA: Cambia este texto */}
                      "A veces, los momentos más simples son los que crean los recuerdos más hermosos."
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* PÁGINA 16: PÁGINA FINAL */}
            {currentPage === 15 && (
              <motion.div
                key="page15"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-800 to-indigo-700 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-8 book-page"
              >
                <div className="absolute inset-0 bg-[url('/paper-texture.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                {/* Gold frame */}
                <div className="absolute inset-[10px] xs:inset-[15px] sm:inset-[20px] border-[2px] xs:border-[3px] border-yellow-300/50 rounded-lg"></div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center z-10"
                >
                  <motion.h1
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-bold mb-2 xs:mb-4 sm:mb-6 text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(255,255,255,0.1)",
                        "0 0 15px rgba(255,255,255,0.3)",
                        "0 0 5px rgba(255,255,255,0.1)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {/* PERSONALIZA: Cambia este título */}
                    Nuestro Amor Continúa...
                  </motion.h1>

                  {/* Texto con animación de escritura a mano */}
                  <div className="h-6 xs:h-8 sm:h-12 mb-3 xs:mb-6 sm:mb-8">
                    <HandwritingText
                      text="Cada día escribimos un nuevo capítulo juntos"
                      className="text-sm xs:text-base sm:text-xl md:text-2xl text-yellow-50"
                    />
                  </div>

                  <motion.div
                    className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 mx-auto relative rounded-full overflow-hidden border-2 xs:border-4 border-yellow-200/70 shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 mix-blend-overlay z-10"></div>
                    {/* PERSONALIZA: Reemplaza esta imagen con una foto tuya y de tu novia */}
                    <Image src="/placeholder.svg?height=240&width=240" alt="Nosotros" fill className="object-cover" />
                  </motion.div>

                  <motion.p
                    className="mt-3 xs:mt-6 sm:mt-8 text-sm xs:text-base sm:text-lg md:text-xl italic text-yellow-100"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {/* PERSONALIZA: Cambia este texto */}
                    Te amo hoy, mañana y siempre
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page indicator */}
          <div className="absolute bottom-1 xs:bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-0.5 xs:gap-1 max-w-[90%] z-20">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.div
                key={index}
                className={`w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 rounded-full ${currentPage === index ? "bg-yellow-200" : "bg-white/40"}`}
                whileHover={{ scale: 1.5 }}
                animate={
                  currentPage === index
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }
                    : {}
                }
                transition={
                  currentPage === index
                    ? {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }
                    : {}
                }
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
