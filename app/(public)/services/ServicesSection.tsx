"use client"

import { useEffect, useState } from "react";
import Image from "next/image"
import { CheckCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface PackageService {
  id?: number | string;
  title: string;
  category: string;
  items: string[];
  image_url: string;
}

interface PageData {
  packages: PackageService[];
  intro: {
    content_title: string;
    content_text: string;
  };
}

export default function ServicesPage() {
  const [data, setData] = useState<PageData>({
    packages: [],
    intro: { content_title: "Our Services", content_text: "" }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const res = await fetch("/api/admin/packages");
        const json = await res.json();
        
        if (json.packages || json.intro) {
          setData({
            packages: json.packages || [],
            intro: json.intro || { content_title: "Our Services", content_text: "" }
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const displayPackages = data.packages;

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-20 overflow-hidden">
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-100 opacity-50 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-orange-100 opacity-50 blur-[150px] rounded-full"></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-6">
          <h2 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">What We Do</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">Services</span>
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-cyan-500 mx-auto rounded-full"></div>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 italic text-gray-800">
            {data.intro.content_title}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {data.intro.content_text}
          </p>
        </motion.div>
      </section>

      <div className="space-y-24 pb-24">
        {displayPackages.map((pkg, index) => (
          <section key={index} className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="relative h-[400px] group overflow-hidden">
                <Image
                  src={pkg.image_url || "/jeep.jpg"}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
              </div>

              <div className="p-10">
                <h3 className="text-3xl font-bold mb-3 text-gray-900 uppercase">
                  {pkg.title}
                </h3>
                <p className="text-orange-500 font-semibold mb-6">
                  {pkg.category}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                      <CheckCircle className="text-cyan-500 shrink-0" size={18} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </section>
        ))}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={30} />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Synchronizing...</p>
          </div>
        )}

        {!loading && displayPackages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 italic">No services published yet.</p>
          </div>
        )}
      </div>
    </main>
  )
}