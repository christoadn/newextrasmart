"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600"],
});

// Tipe data agar konsisten dengan AboutSection
interface HeroData {
  title: string;
  subtitle: string;
  image_url: string;
}

export default function Hero() {
  // --- LOGIKA DINAMIS (Identik dengan AboutSection) ---
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Asumsi endpoint API untuk hero
        const res = await fetch('/api/admin/hero');
        const result = await res.json();
        if (result.content) setData(result.content);
      } catch (error) {
        console.error("Koneksi API gagal, menggunakan data template statis.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Data Display dengan Fallback (Default tampilan sebelum diedit di admin)
  const displayData = {
    title: data?.title || "Yuk Mulai Petualangan Seru Bersama Kami",
    subtitle: data?.subtitle || "New Extra Smart adalah tim kreatif yang berdedikasi untuk mengubah ide biasa menjadi pengalaman yang luar biasa.",
    image_url: data?.image_url || "/Pemandangan_Gunung_Bromo.jpg"
  };

  if (loading) return (
    <div className="min-h-[90vh] flex items-center justify-center italic text-gray-400">
      Loading experience...
    </div>
  );

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-white text-gray-900 pt-28 md:pt-[120px] pb-16">

      {/* BACKGROUND GLOW (Sama dengan AboutSection style) */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-[-150px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-orange-100 opacity-50 blur-[140px] md:blur-[180px] rounded-full"></div>
        <div className="absolute top-[-150px] right-[-150px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-cyan-100 opacity-50 blur-[160px] md:blur-[200px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 grid lg:grid-cols-2 items-center gap-14">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <h1 className={`${baloo.className} text-3xl sm:text-4xl md:text-6xl xl:text-7xl leading-[1.1] tracking-tight`}>
            {displayData.title.split(" ").map((word, i) => {
              // Menentukan kata mana yang akan diberi gradient
              // Indeks 5 = Institusi, Indeks 6 = Pendidikan
              const isGradient = i === 5 || i === 6;

              return (
                <span key={i}>
                  {isGradient ? (
                    <span className="bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
                      {word}{" "}
                    </span>
                  ) : (
                    <>{word} </>
                  )}
                  {/* Menambahkan break line setelah kata ke-2 agar mirip layout gambar */}
                  {i === 1 && <br />}
                </span>
              );
            })}
          </h1>

          <p className="mt-6 text-gray-600 text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            {displayData.subtitle}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/gallery">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-cyan-500 text-white hover:scale-105 transition duration-300 shadow-lg shadow-orange-500/20 active:scale-95">
                Explore Portfolio
              </button>
            </Link>

            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full transition duration-300 border border-gray-300 text-gray-900 hover:bg-gray-900 hover:text-white active:scale-95">
                Book Consultation
              </button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT IMAGE (Dengan Animasi Floating seperti AboutSection) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-12 md:mt-0 flex justify-center"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">

            {/* Menggunakan Next.js Image agar performa sama dengan AboutSection */}
            <div className="relative w-[300px] sm:w-[400px] md:w-[500px] h-[280px] sm:h-[350px] md:h-[500px]">
              <Image
                src={displayData.image_url}
                alt="Hero Visual"
                fill
                className="object-cover transition-transform duration-[4000ms] ease-linear group-hover:scale-110"
                priority
              />
            </div>

            {/* SHINE EFFECT */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000"></div>

            {/* GLASS CARD (Identik style dengan AboutSection card) */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg">
              <p className="text-xs md:text-sm text-white font-medium">
                Sukses Lebih Dari 150+ Event
              </p>
              <p className="text-sm md:text-xl font-bold text-white mt-1">
                Dipercaya Top Event
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}