"use client"

import { 
  Instagram, 
  Facebook, 
  ChevronUp,
  MessageCircle // Digunakan sebagai alternatif WhatsApp yang elegan
} from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-[#0d3330] text-gray-200 pt-16 pb-24 px-6 md:px-20 overflow-hidden font-sans">

      {/* Background Watermark Logo */}
      <div className="absolute right-[-20%] md:right-[-5%] bottom-[-10%] md:bottom-[-20%] 
        opacity-10 md:opacity-20 pointer-events-none select-none">
        <img 
          src="/logo.png" 
          alt="watermark" 
          className="w-[320px] md:w-[600px] h-auto grayscale brightness-200 mix-blend-overlay"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between gap-14">

          {/* Brand Section */}
          <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
              New Extra Smart
            </h2>

            <p className="text-sm md:text-lg leading-relaxed text-gray-300 max-w-md">
              Empowering events with advanced creative concepts and professional 
              execution to improve brand presence and memorable experiences.
            </p>

            {/* Social Icons */}
            <div className="flex gap-6 mt-4">
              <a href="https://wa.me/yournumber" target="_blank"
                className="text-white hover:text-[#e4a853] transition-all transform hover:scale-110">
                <MessageCircle size={22} />
              </a>

              <a href="https://www.instagram.com/newextrasmart?igsh=MWxwdGplZGZnb3BqMw==" 
                className="text-white hover:text-[#e4a853] transition-all transform hover:scale-110">
                <Instagram size={22} />
              </a>

              <a href="#" 
                className="text-white hover:text-[#e4a853] transition-all transform hover:scale-110">
                <Facebook size={22} />
              </a>
            </div>
          </div>

          {/* Back to Top Section */}
          <div className="flex justify-center md:justify-end md:items-start">
            <button 
              onClick={scrollToTop}
              className="group flex items-center gap-3 
              border border-gray-500 
              px-5 py-3 
              text-xs font-bold tracking-widest uppercase
              w-fit
              hover:bg-white hover:text-[#0d3330] hover:border-white 
              transition-all duration-500"
            >
              <ChevronUp size={18} 
                className="group-hover:-translate-y-1 transition-transform" />
              Back to Top
            </button>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-0 left-0 w-full bg-[#e4a853] py-3">
        <p className="text-center text-[#0d3330] text-[9px] md:text-xs font-black uppercase tracking-[0.3em]">
          Copyright © {new Date().getFullYear()}, newextrasmart.com, All Rights Reserved.
        </p>
      </div>

    </footer>
  )
}