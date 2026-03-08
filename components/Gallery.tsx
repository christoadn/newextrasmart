"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  cover: string;
  images: string | string[];
}

export default function Gallery() {
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        if (Array.isArray(data)) setGalleryData(data);
      } catch (error) {
        console.error("Gagal memuat gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const parseImages = (imgData: any): string[] => {
    if (Array.isArray(imgData)) return imgData;
    try {
      return JSON.parse(imgData || "[]");
    } catch {
      return [];
    }
  };

  if (loading)
    return (
      <div className="py-24 text-center text-orange-500 font-bold animate-pulse">
        Menyinkronkan Moment...
      </div>
    );

  return (
    <section
      id="gallery"
      className="relative py-28 px-6 md:px-16 bg-white overflow-hidden"
    >
      {/* decorative gradient */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-orange-200 blur-[120px] opacity-40"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-200 blur-[120px] opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-4 uppercase italic tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500 bg-clip-text text-transparent">
              Moments
            </span>
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Jelajahi dokumentasi kegiatan kami. Setiap foto menangkap semangat
            kolaborasi, tantangan yang terlewati, dan keceriaan tim dalam setiap
            event yang kami selenggarakan.
          </p>

          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[180px]">
          {/* Kita batasi hanya 10 data pertama yang muncul */}
          {galleryData.slice(0, 10).map((item, index) => (
            <motion.div
              key={item.id || index}
              whileHover={{ y: -12 }}
              onClick={() => setSelectedEvent(item)}
              className={`group relative overflow-hidden rounded-[2.5rem] shadow-xl cursor-pointer border-4 border-white
              
              ${index % 5 === 0 ? "md:row-span-2" : ""}
              `}
            >
              <img
                src={item.cover || "/placeholder.png"}
                alt={item.title}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />

              {/* glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-tr from-orange-500/20 via-transparent to-blue-500/20"></div>

              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-8">
                <span className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                  {item.category}
                </span>

                <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-4">
                  {item.title}
                </h3>

                <div className="w-fit px-6 py-2.5 bg-white text-black text-[10px] font-black rounded-full uppercase italic hover:bg-orange-500 hover:text-white transition">
                  View Moment →
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Gallery Button */}
        {galleryData.length > 10 && (
          <div className="text-center mt-16">
            <Link href="/gallery">
              <button className="relative px-10 py-4 font-black text-sm uppercase tracking-widest text-white rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-blue-500 hover:scale-105 transition">
                More Gallery
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-50 bg-black text-white p-3 rounded-full hover:bg-orange-500 transition"
              >
                <X size={20} />
              </button>

              {/* hero */}
              <div className="relative h-[45vh] w-full">
                <img
                  src={selectedEvent.cover}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-6">
                  <div className="px-4 py-1 bg-orange-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                    {selectedEvent.category}
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* content */}
              <div className="p-10 md:p-16">
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <div className="flex justify-center gap-6 mb-8 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} /> Event Done
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={14} /> Outdoor Location
                    </span>
                  </div>

                  <p className="text-gray-500 leading-relaxed italic text-sm md:text-base">
                    "Momen kebersamaan dalam{" "}
                    <strong>{selectedEvent.title}</strong> merupakan bagian dari
                    komitmen kami untuk terus membangun sinergi."
                  </p>
                </div>

                {/* photo grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {parseImages(selectedEvent.images).map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-3xl overflow-hidden shadow-md"
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="Documentation"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-10 border-t text-center">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-10 py-3 bg-gray-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition"
                >
                  Close Gallery
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}