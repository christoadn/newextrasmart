"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Service {
  id?: number | string;
  title: string;
  desc: string;
  icon_name: string; // Menyimpan nama icon seperti "PartyPopper"
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        if (data) setServices(data);
      } catch (error) {
        console.error("Gagal mengambil data services");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Fallback jika database kosong
  const staticServices: Service[] = [
    { title: "Corporate Event", desc: "Professional event management for conferences.", icon_name: "CalendarDays" },
    { title: "Wedding Organizer", desc: "Elegant and unforgettable wedding experiences.", icon_name: "HeartHandshake" },
    { title: "Private Party", desc: "Exclusive private celebrations with premium styling.", icon_name: "PartyPopper" },
  ];

  const displayServices = services.length > 0 ? services : staticServices;

  if (loading) return <div className="py-20 text-center italic text-gray-400">Loading Services...</div>;

  return (
    <section id="services" className="relative py-28 px-6 md:px-16 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl -z-10"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-5xl font-bold mb-4 tracking-tight"
        >
          Our <span className="text-orange-500">Premium</span> Services
        </motion.h2>

        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
          We craft extraordinary experiences with precision, creativity, and attention to every detail.
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {displayServices.map((service, index) => {
            // Logika Mengambil Icon berdasarkan Nama String
            const IconComponent = (LucideIcons as any)[service.icon_name] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white border border-gray-200 p-10 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-orange-400 w-full sm:w-[45%] lg:w-[30%]"
              >
                <div className="mb-6 text-orange-500 group-hover:text-cyan-500 transition-colors duration-300">
                  <IconComponent size={40} />
                </div>

                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}