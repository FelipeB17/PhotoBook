"use client"

import { useState } from "react"
import { motion } from "framer-motion"

// Lista completa de 100 razones
const allReasons = [
  "Tu sonrisa ilumina mi día",
  "La forma en que me miras",
  "Tu risa contagiosa",
  "Tu inteligencia me inspira",
  "La manera en que me apoyas",
  "Tu paciencia infinita",
  "Cómo me haces sentir especial",
  "Tu creatividad",
  "Tu valentía ante los retos",
  "Tu honestidad",
  "La forma en que me escuchas",
  "Tu generosidad",
  "Cómo me haces reír",
  "Tu pasión por lo que amas",
  "Tu forma de ver el mundo",
  "Tu sensibilidad",
  "Tu determinación",
  "La paz que me transmites",
  "Tu autenticidad",
  "Cómo me cuidas cuando estoy enfermo",
  "Tu capacidad para sorprenderme",
  "Tu forma de bailar",
  "Cómo me abrazas",
  "Tu voz cuando me hablas",
  "Tu forma de cocinar",
  "Cómo me defiendes",
  "Tu lealtad",
  "Tu forma de soñar",
  "Cómo me inspiras a ser mejor",
  "Tu forma de ver lo bueno en todo",
  "Tu optimismo",
  "La forma en que me aceptas tal como soy",
  "Tu sentido del humor",
  "Cómo me haces sentir seguro",
  "Tu forma de expresar amor",
  "Tu capacidad para perdonar",
  "Cómo me entiendes sin palabras",
  "Tu forma de recordar detalles",
  "Tu manera de resolver problemas",
  "Cómo me das espacio cuando lo necesito",
  "Tu forma de celebrar mis logros",
  "Tu empatía con los demás",
  "Cómo me motivas",
  "Tu forma de ver belleza en lo simple",
  "Tu capacidad para adaptarte",
  "Cómo me complementas",
  "Tu forma de expresar tus sentimientos",
  "Tu manera de cuidar a los demás",
  "Cómo me haces sentir en casa",
  "Tu forma de agradecer",
  "La manera en que te emocionas por las pequeñas cosas",
  "Tu forma de apoyar mis sueños",
  "Cómo me das consejos sin juzgar",
  "Tu forma de respetar mis decisiones",
  "La manera en que me miras cuando crees que no te veo",
  "Tu forma de tomar mi mano",
  "Cómo me haces sentir amado cada día",
  "Tu forma de planear sorpresas",
  "La manera en que me defiendes ante otros",
  "Tu forma de compartir tus pensamientos",
  "Cómo me haces sentir importante",
  "Tu forma de apreciar los detalles",
  "La manera en que me apoyas en mis momentos difíciles",
  "Tu forma de celebrar nuestros aniversarios",
  "Cómo me haces sentir fuerte",
  "Tu forma de mostrar interés en mis pasiones",
  "La manera en que me alientas a seguir adelante",
  "Tu forma de recordar nuestros momentos especiales",
  "Cómo me haces sentir comprendido",
  "Tu forma de compartir tus sueños conmigo",
  "La manera en que me haces reír en los momentos difíciles",
  "Tu forma de ver lo mejor de mí",
  "Cómo me ayudas a crecer",
  "Tu forma de escuchar mis problemas",
  "La manera en que me das tu opinión sincera",
  "Tu forma de respetar mi espacio",
  "Cómo me haces sentir valorado",
  "Tu forma de compartir tus miedos conmigo",
  "La manera en que me demuestras tu amor cada día",
  "Tu forma de apoyarme en mis decisiones",
  "Cómo me haces sentir que puedo lograr cualquier cosa",
  "Tu forma de ver nuestro futuro juntos",
  "La manera en que me haces sentir protegido",
  "Tu forma de compartir tus alegrías conmigo",
  "Cómo me haces sentir que soy suficiente",
  "Tu forma de mostrar tu vulnerabilidad",
  "La manera en que me haces sentir respetado",
  "Tu forma de ver lo positivo en las dificultades",
  "Cómo me haces sentir que soy tu prioridad",
  "Tu forma de expresar tus deseos",
  "La manera en que me haces sentir que pertenezco a tu lado",
  "Tu forma de compartir tu vida conmigo",
  "Cómo me haces sentir que juntos podemos con todo",
  "Tu forma de ver nuestro amor",
  "La manera en que me haces sentir completo",
  "Tu forma de decir 'te amo'",
  "Cómo me haces sentir que nuestro amor es único",
  "Tu forma de ser tú misma conmigo",
  "La manera en que me haces sentir que soy el único",
  "Porque cada día a tu lado es un regalo que atesoro",
]

interface ReasonsGridProps {
  isMobile?: boolean
}

export function ReasonsGrid({ isMobile }: ReasonsGridProps) {
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  const toggleCard = (index: number) => {
    if (flippedCards.includes(index)) {
      setFlippedCards(flippedCards.filter((i) => i !== index))
    } else {
      setFlippedCards([...flippedCards, index])
    }
  }

  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1 xs:gap-2 sm:gap-3">
      {allReasons.map((reason, index) => (
        <motion.div
          key={index}
          className="aspect-[3/4] perspective"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * (isMobile ? 0.005 : 0.01), duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
        >
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: flippedCards.includes(index) ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => toggleCard(index)}
          >
            {/* Frente de la tarjeta */}
            <motion.div className="absolute inset-0 backface-hidden rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center p-1 xs:p-1.5 sm:p-2 shadow-lg border border-purple-300/20">
              <div className="text-center">
                <span className="text-sm xs:text-base sm:text-xl font-bold text-yellow-100">{index + 1}</span>
                <div className="mt-0.5 xs:mt-1 sm:mt-2 text-[8px] xs:text-[10px] sm:text-xs text-yellow-50">
                  Haz clic
                </div>
              </div>
            </motion.div>

            {/* Reverso de la tarjeta */}
            <motion.div className="absolute inset-0 backface-hidden rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-1 xs:p-2 sm:p-3 shadow-lg border border-purple-300/20 rotate-y-180">
              <p className="text-center text-[8px] xs:text-xs sm:text-sm text-white font-medium">{reason}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
