"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Tipe data keamanan TypeScript
interface TeamMember {
  id?: number | string;
  name: string;
  role: string;
  color: string;
  desc: string;
  image_url?: string;
}

interface AboutContent {
  title: string;
  content: string;
  vision: string;
  mission: string; // Diubah ke string sesuai database
  image_url?: string;
  vision_url?: string;
  mission_url?: string;
}

export default function AboutSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/about');
        const data = await res.json();
        
        // Memastikan pengambilan data sesuai struktur API
        if (data.team) setTeam(data.team);
        if (data.content) setContent(data.content);
      } catch (error) {
        console.error("Koneksi API gagal.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- LOGIKA PARSING DATA ---
  const displayData = {
    heroSubtitle: "Our Journey",
    whoTitle: content?.title || "Who We Are",
    desc1: content?.content || "New Extra Smart adalah tim kreatif yang berdedikasi untuk mengubah ide biasa menjadi pengalaman yang luar biasa.",
    vision: content?.vision || "Menjadi partner paling cerdas dan inovatif dalam menciptakan kebahagiaan melalui pelayanan yang tulus dan berkualitas.",
    
    // MENGATASI ERROR .MAP: Konversi String ke Array
    mission: content?.mission 
      ? content.mission.split('\n').filter(m => m.trim() !== "")
      : [
          "Memberikan layanan premium yang terjangkau.",
          "Membangun komunitas yang suportif.",
          "Inovasi tanpa henti di setiap detail."
        ],
        
    lobbyImg: content?.image_url || "/lobby.jpg",
    // Gunakan fallback ke lobbyImg jika vision/mission_url kosong
    visionImg: content?.vision_url || content?.image_url || "/lobby.jpg",
    missionImg: content?.mission_url || content?.image_url || "/lobby.jpg"
  };

  const staticTeam: TeamMember[] = [
    { name: "Person 1", role: "Event Lead", color: "bg-orange-400", desc: "Berpengalaman dalam menangani event berskala besar." },
    { name: "Person 2", role: "Senior Coordinator", color: "bg-cyan-400", desc: "Spesialis dalam perencanaan logistik." },
  ];

  const finalTeam = team.length > 0 ? team : staticTeam;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black tracking-widest text-gray-400 animate-pulse uppercase italic">
      Loading Experience...
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900 pt-20 overflow-hidden font-sans">
      
      {/* HERO SECTION */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-cyan-100 opacity-50 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-orange-100 opacity-50 blur-[150px] rounded-full"></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-6">
          <h2 className="text-orange-500 font-bold uppercase tracking-[0.2em] text-sm mb-4">{displayData.heroSubtitle}</h2>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">Us</span>
          </h1>
          <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-cyan-500 mx-auto rounded-full"></div>
        </motion.div>
      </section>

      {/* CONTENT SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-3xl font-bold mb-6 italic text-gray-800">{displayData.whoTitle}</h3>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">
            <span className="text-orange-600 font-semibold">New Extra Smart</span> {displayData.desc1}
          </p>
          <Link href="/services">
            <button className="px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] bg-gray-900 text-white hover:bg-orange-500 transition-all duration-300 shadow-xl active:scale-95">
              Explore Our Services
            </button>
          </Link>
        </motion.div>

        {/* IMAGE LOBBY */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          whileHover={{ scale: 1.02 }} 
          viewport={{ once: true }} 
          className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-gray-50 h-[450px] flex items-center justify-center group cursor-pointer"
        >
          <Image 
            src={displayData.lobbyImg} 
            alt="Main Office" 
            fill 
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
            priority
          />
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl z-10">
             <p className="text-orange-500 font-black text-2xl leading-none">100%</p>
             <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Dedicated</p>
          </div>
        </motion.div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-20">
        {/* VISION */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div whileHover={{ scale: 1.05, rotate: -2 }} className="h-[350px] rounded-[3rem] shadow-2xl relative overflow-hidden group border-4 border-white">
            <Image src={displayData.visionImg} alt="Vision" fill className="object-cover transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent"></div>
          </motion.div>
          <div className="group p-12 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
            <h4 className="text-3xl font-black mb-6 text-gray-800 italic">Our Vision</h4>
            <p className="text-gray-500 leading-relaxed italic text-xl">"{displayData.vision}"</p>
          </div>
        </div>

        {/* MISSION */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="group p-12 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden order-2 md:order-1">
            <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />
            <h4 className="text-3xl font-black mb-6 text-gray-800 italic">Our Mission</h4>
            <ul className="text-gray-500 space-y-4">
              {displayData.mission.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-lg">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mt-2.5 shrink-0" /> 
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <motion.div whileHover={{ scale: 1.05, rotate: 2 }} className="h-[350px] rounded-[3rem] shadow-2xl relative overflow-hidden group border-4 border-white order-1 md:order-2">
            <Image src={displayData.missionImg} alt="Mission" fill className="object-cover transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/40 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-50">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-6">Expert Crew</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            The creative minds <br /> behind <span className="italic bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">NES success</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-24 gap-x-12">
          {finalTeam.map((member, index: number) => (
            <div key={index} className="relative flex flex-col items-center" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <div className="relative w-48 h-48 mb-8 group cursor-pointer">
                <div className={`absolute inset-0 rounded-full ${member.color} opacity-20 transition-all duration-500 group-hover:scale-125 translate-x-4 -translate-y-4`}></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gray-100 z-10">
                  <Image 
                    src={member.image_url || "/lobby.jpg"} 
                    alt={member.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} className="absolute z-[100] top-[-50%] left-[-10%] w-[120%] bg-white rounded-[2rem] shadow-2xl p-6 border border-gray-50 pointer-events-none">
                       <h4 className="font-black text-gray-900 text-xl mb-1">{member.name}</h4>
                       <p className={`text-[9px] font-black uppercase tracking-widest mb-3 inline-block px-3 py-1 rounded-full ${member.color} text-white`}>{member.role}</p>
                       <p className="text-gray-500 text-xs leading-relaxed">{member.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="text-center">
                <div className={`px-8 py-2.5 rounded-full ${member.color} text-white font-black text-sm shadow-lg transform -rotate-3 group-hover:rotate-0 transition-all duration-300`}>{member.name}</div>
                <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}