"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

interface Partner {
  id?: number;
  name: string;
  image_url: string;
}

export default function PartnersEditor() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // State untuk Live Preview Animation
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      if (data.partners) {
        setPartners(data.partners);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Animasi Preview (Sama dengan tampilan user)
  useAnimationFrame((_, delta) => {
    if (!trackRef.current || partners.length === 0) return;
    const moveBy = (50 * delta) / 1000;
    let nextX = x.get() - moveBy;
    const trackWidth = trackRef.current.offsetWidth;
    if (nextX <= -(trackWidth / 2)) {
      nextX = 0;
    }
    x.set(nextX);
  });

  const handleAddPartner = () => {
    const newPartner: Partner = { name: "New Partner", image_url: "" };
    setPartners([...partners, newPartner]);
  };

  const handleRemovePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const updated = [...partners];
      updated[index].image_url = result;
      setPartners(updated);
    };
    reader.readAsDataURL(file);
  };

  const savePartners = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partners })
      });
      if (res.ok) alert("✅ Partners berhasil diperbarui!");
      else alert("Gagal menyimpan Partners.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center italic text-orange-600">Sinkronisasi Database MariaDB...</div>;

  // Duplikasi logo untuk preview animasi seamless
  const previewLogos = [...partners, ...partners, ...partners];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Partners Dashboard</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Database Linked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: EDITING FORMS */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
               <h2 className="text-xl font-black text-gray-700 uppercase italic">Manage Partners</h2>
               <div className="flex gap-2">
                 <button 
                   onClick={handleAddPartner}
                   className="bg-gray-900 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-black transition-all"
                 >
                   + ADD LOGO
                 </button>
                 <button 
                   onClick={savePartners} 
                   disabled={saving} 
                   className="bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-orange-700 disabled:bg-gray-300 transition-all"
                 >
                   {saving ? "SAVING..." : "SAVE CHANGES"}
                 </button>
               </div>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {partners.map((partner, index) => (
                <div key={index} className="p-4 border rounded-2xl bg-gray-50 flex items-center gap-4 relative group">
                  <div className="w-16 h-16 bg-white rounded-xl border flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {partner.image_url ? (
                      <img src={partner.image_url} className="max-h-12 w-auto object-contain" alt="preview" />
                    ) : (
                      <span className="text-[8px] font-bold text-gray-300">NO IMG</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text"
                      placeholder="Partner Name"
                      value={partner.name}
                      onChange={(e) => {
                        const updated = [...partners];
                        updated[index].name = e.target.value;
                        setPartners(updated);
                      }}
                      className="w-full text-xs font-bold border-none bg-transparent focus:ring-0 p-0"
                    />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(index, e)} 
                      className="text-[9px] block w-full file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-orange-100 file:text-orange-700 file:font-bold"
                    />
                  </div>
                  <button 
                    onClick={() => handleRemovePartner(index)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                </div>
              ))}

              {partners.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-3xl text-gray-400 text-xs font-bold uppercase tracking-widest">
                  No partners added yet.
                </div>
              )}
            </div>
          </section>

          <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 italic text-[10px] text-orange-700 uppercase font-black tracking-widest text-center">
            Tip: Gunakan file SVG atau PNG transparan untuk hasil logo yang terlihat lebih profesional.
          </div>
        </div>

        {/* RIGHT: LIVE INTERACTIVE PREVIEW */}
        <div className="lg:sticky lg:top-6 h-fit bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 text-white p-4 text-center text-[10px] font-black tracking-[0.3em] uppercase italic">Live User Preview</div>
          
          <div className="relative py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden min-h-[400px] flex flex-col justify-center">
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none"></div>

             <div className="relative z-10 text-center mb-8 px-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Partner With</h2>
                <p className="text-[10px] text-gray-500 mt-2 max-w-xs mx-auto">
                  Trusted by leading brands & organizations worldwide to deliver extraordinary results.
                </p>
             </div>

             <div className="relative overflow-hidden">
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white via-white/40 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white via-white/40 to-transparent z-20 pointer-events-none" />

                <motion.div
                  ref={trackRef}
                  style={{ x }} 
                  className="flex gap-12 w-max items-center py-4"
                >
                  {previewLogos.length > 0 ? (
                    previewLogos.map((partner, index) => (
                      <div key={index} className="flex-shrink-0">
                        {partner.image_url ? (
                          <img
                            src={partner.image_url}
                            alt="partner"
                            className="h-8 md:h-10 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">Logo Appear Here</div>
                  )}
                </motion.div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Logo partner akan ditampilkan dalam bentuk running slider di halaman utama.</p>
      </div>
    </div>
  );
}