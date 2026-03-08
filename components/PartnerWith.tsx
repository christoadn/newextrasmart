"use client"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"

export default function PartnerWith() {
  // 1. Ubah state menjadi dynamic dari API
  const [partners, setPartners] = useState<{ image_url: string }[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)

  // 2. Ambil data dari database saat halaman dibuka
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const res = await fetch("/api/admin/partners", {
          cache: 'no-store' // Memastikan data tidak di-cache browser
        });
        const data = await res.json();
        if (data.partners) {
          setPartners(data.partners);
        }
      } catch (err) {
        console.error("Gagal mengambil data partner:", err);
      }
    };
    loadPartners();
  }, []);

  // 3. Gandakan array hanya jika data sudah ada
  const duplicatedLogos = partners.length > 0 
    ? [...partners, ...partners, ...partners, ...partners] 
    : [];

  useAnimationFrame((_, delta) => {
    // Jangan jalankan animasi jika data kosong atau sedang hover
    if (!trackRef.current || isHovered || partners.length === 0) return

    const moveBy = (50 * delta) / 1000 
    let nextX = x.get() - moveBy

    const trackWidth = trackRef.current.offsetWidth
    if (nextX <= -(trackWidth / 2)) {
      nextX = 0
    }

    x.set(nextX)
  })

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Partner With
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Trusted by leading brands & organizations worldwide to deliver extraordinary results.
        </p>
      </div>

      <div 
        className="relative overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none" />

        <motion.div
          ref={trackRef}
          style={{ x }} 
          className="flex gap-16 md:gap-24 w-max items-center py-8"
        >
          {duplicatedLogos.map((partner, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={partner.image_url} // Mengambil dari image_url database
                alt={`partner-${index}`}
                className="h-10 md:h-14 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500 ease-in-out"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}