"use client";


import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] // cubic premium
      }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-lg ${
        scrolled 
          ? "bg-black/80 shadow-lg py-3" 
          : "bg-black/40 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-8 flex items-center justify-between">

        {/* LEFT - Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="New Extra Smart Logo"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            New Extra <span className="text-orange-500">Smart</span>
          </h1>
        </Link>

        {/* CENTER - Menu */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="group relative inline-block"
            >
              {/* Background fill - Yellow on Hover */}
              <span
                className="
                absolute inset-0 rounded-full bg-yellow-400
                scale-x-0 origin-left
                transition-transform duration-300
                [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-x-100
                "
              ></span>

              {/* Text - Berubah jadi Putih/Terang agar kontras dengan BG Gelap */}
              <span
                className={`
                relative z-10 px-4 py-2 text-[15px] font-medium transition-colors duration-300
                group-hover:text-black
                ${pathname === item.path ? "text-yellow-400" : "text-white"}
                `}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* RIGHT - Button */}
        <Link href="https://www.instagram.com/newextrasmart?igsh=MWxwdGplZGZnb3BqMw==">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden lg:inline-block bg-orange-500 text-white 
          px-6 py-2 rounded-full font-semibold 
          shadow-md hover:bg-orange-600 transition-all
          duration-300"
        >
          Get Started
        </motion.button>
        </Link>

        {/* MOBILE TOGGLE */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Tambahan agar menu mobile juga transparan) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col p-6 gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-block w-fit"
                >
                  {/* Background fill */}
                  <span
                    className="
                    absolute inset-0 rounded-full bg-yellow-400
                    scale-x-0 origin-left
                    transition-transform duration-300
                    [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]
                    group-hover:scale-x-100
                    active:scale-x-100
                    "
                  ></span>

                  {/* Text */}
                  <span
                    className={`
                    relative z-10 px-4 py-2 text-lg font-medium transition-colors duration-300
                    group-hover:text-black
                    active:text-black
                    ${pathname === item.path ? "text-yellow-400" : "text-white"}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}