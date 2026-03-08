"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Pastikan sudah install lucide-react

interface GalleryItem {
  title: string;
  category: string;
  cover: string;
  images: string[] | string;
}

const FALLBACK_GALLERY: GalleryItem[] = [
  {
    title: "Corporate Gathering 2024",
    category: "Outdoor Event",
    cover: "/event1.png",
    images: ["/event1.png", "/event2.png", "/event3.png"],
  },
  // ... tambahkan data dummy lainnya jika perlu untuk testing pagination
];

export default function GallerySection() {
  const [selectedEvent, setSelectedEvent] = useState<GalleryItem | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>(FALLBACK_GALLERY);
  
  // --- LOGIKA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah kartu per halaman
  
  const totalPages = Math.ceil(gallery.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = gallery.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll otomatis ke judul galeri saat ganti halaman
    const section = document.getElementById("gallery-content");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/admin/gallery");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setGallery(data);
        }
      } catch (error) {
        console.error("Gagal memuat gallery dinamis, menggunakan data statis.", error);
      }
    }
    fetchGallery();
  }, []);

  const parseImages = (imagesData: string[] | string): string[] => {
    if (Array.isArray(imagesData)) return imagesData;
    try {
      return JSON.parse(imagesData || "[]");
    } catch (e) {
      return [];
    }
  };

  return (
    <>
      <section id="gallery" className="relative py-28 px-6 bg-white overflow-hidden">
        <div id="gallery-content" className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4">
              Our Moments
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              Adventure in <span className="bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">Action</span>
            </h2>
          </div>

          {/* GRID GALLERY - Menggunakan currentItems */}
          <div className="grid md:grid-cols-3 gap-10">
            <AnimatePresence mode="wait">
              {currentItems.map((item, index) => (
                <motion.div
                  key={item.title + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedEvent(item)}
                  className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 group cursor-pointer"
                >
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={item.cover || "/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-2">{item.category}</p>
                    <h3 className="text-xl font-black mb-4 text-gray-800">{item.title}</h3>
                    <button className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-orange-500 transition">
                      Lihat Detail →
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* NOMOR HALAMAN (PAGINATION UI) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 gap-4">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                      currentPage === i + 1 
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MODAL DETAIL (Tetap Sama Seperti Sebelumnya) */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ y: 60, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 z-50 bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-500 transition"
              >
                Close ✕
              </button>

              <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <Image src={selectedEvent.cover} alt={selectedEvent.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-6">
                  <p className="uppercase tracking-widest text-sm mb-3">{selectedEvent.category}</p>
                  <h2 className="text-4xl md:text-5xl font-black">{selectedEvent.title}</h2>
                </div>
              </div>

              <div className="px-6 md:px-10 py-12 md:py-16">
                <p className="text-gray-600 text-lg mb-12 text-center max-w-3xl mx-auto italic">
                  "Menciptakan pengalaman luar biasa melalui kolaborasi tim yang solid."
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {parseImages(selectedEvent.images).map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-[250px] rounded-3xl overflow-hidden shadow-md border-4 border-gray-50"
                    >
                      <Image
                        src={img}
                        alt={`Dokumentasi ${i}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}