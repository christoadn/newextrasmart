"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Instagram, Music2, Phone, X } from "lucide-react"

export default function FloatingSocial() {
  const [open, setOpen] = useState(false)

  // Layout diubah menjadi vertikal ke atas agar tidak melewati batas layar samping
  const items = [
    {
      icon: <Instagram size={18} />,
      label: "Instagram",
      link: "https://www.instagram.com/newextrasmart?igsh=MWxwdGplZGZnb3BqMw==",
      y: -60, // Jarak ke atas
    },
    {
      icon: <Music2 size={18} />,
      label: "TikTok",
      link: "https://tiktok.com",
      y: -120, // Lebih tinggi lagi
    },
    {
      icon: <Phone size={18} />,
      label: "WhatsApp",
      link: "https://wa.me/628123456789",
      y: -180, // Paling atas
    },
  ]

  return (
    /* lg:hidden = Sembunyi di Desktop (Layar Besar)
       flex = Muncul di Mobile & Tablet
    */
    <div className="fixed bottom-6 right-6 z-[999] flex items-center justify-center lg:hidden">

      <AnimatePresence>
        {open &&
          items.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: item.y,
              }}
              exit={{ opacity: 0, scale: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.05 // Efek muncul satu per satu (stagger)
              }}
              className="absolute flex items-center gap-2 bg-white px-4 py-2.5 rounded-full
              shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-100 text-sm font-bold text-gray-700 
              whitespace-nowrap right-0" // "right-0" menjaga agar label tetap sejajar ke kanan
            >
              <span className="text-orange-500">{item.icon}</span>
              {item.label}
            </motion.a>
          ))}
      </AnimatePresence>

      {/* MAIN BUTTON */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 flex items-center justify-center rounded-full shadow-2xl z-10 transition-colors duration-300 ${
          open ? "bg-gray-800" : "bg-orange-500"
        } text-white`}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.div>
      </motion.button>

    </div>
  )
}