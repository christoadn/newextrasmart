"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  image_url?: string;
}

export default function HeroEditor() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      if (data.content) {
        setHero(data.content);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setHero(prev => prev ? { ...prev, image_url: result } : null);
    };
    reader.readAsDataURL(file);
  };

  const saveHero = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero)
      });
      if (res.ok) alert("✅ Hero Section berhasil diperbarui!");
      else alert("Gagal menyimpan Hero Section.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center italic text-orange-600">Sinkronisasi Database MariaDB...</div>;
  if (!hero) return <div className="p-20 text-center text-red-500 font-bold">Data gagal dimuat dari server.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Hero Dashboard</h1>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Database Linked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: EDITING FORMS (Style identik dengan AboutEditor) */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
               <h2 className="text-xl font-black text-gray-700 uppercase italic">Hero Content</h2>
               <button 
                 onClick={saveHero} 
                 disabled={saving} 
                 className="bg-orange-600 text-white px-6 py-2 rounded-full text-[10px] font-black tracking-widest hover:bg-orange-700 disabled:bg-gray-300 transition-all"
               >
                 {saving ? "SAVING..." : "SAVE HERO"}
               </button>
            </div>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Headline (Judul Utama)</label>
                <textarea 
                  value={hero.title} 
                  onChange={e => setHero({...hero, title: e.target.value})} 
                  className="w-full border rounded-xl p-3 mt-1 outline-orange-500 text-sm font-bold"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Subtitle (Deskripsi)</label>
                <textarea 
                  rows={4} 
                  value={hero.subtitle} 
                  onChange={e => setHero({...hero, subtitle: e.target.value})} 
                  className="w-full border rounded-xl p-3 mt-1 outline-orange-500 text-sm leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Change Hero Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 file:font-bold hover:file:bg-orange-100"
                />
              </div>
            </div>
          </section>

          <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 italic text-[10px] text-orange-700 uppercase font-black tracking-widest text-center">
            Tip: Gunakan Headline yang singkat dan padat untuk hasil visual terbaik di perangkat mobile.
          </div>
        </div>

        {/* RIGHT: LIVE INTERACTIVE PREVIEW (Style User Hero) */}
        <div className="lg:sticky lg:top-6 h-fit bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 text-white p-4 text-center text-[10px] font-black tracking-[0.3em] uppercase italic">Live User Preview</div>
          
          {/* Visualisasi Hero Section yang menyerupai Tampilan User */}
          <div className="relative p-8 md:p-12 min-h-[500px] flex items-center bg-white overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>

             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h1 className={`${baloo.className} text-3xl md:text-4xl leading-tight text-gray-900 tracking-tight`}>
                        {hero.title || "Headline Title"}
                    </h1>
                    <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium max-w-sm">
                        {hero.subtitle || "Your subtitle description will appear here. Keep it engaging for your visitors."}
                    </p>
                    <div className="flex gap-3">
                        <div className="px-6 py-2.5 bg-orange-500 rounded-full text-white text-[6px] font-black uppercase tracking-widest shadow-lg shadow-orange-200">
                            Get Started
                        </div>
                        <div className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-400 text-[9px] font-black uppercase tracking-widest">
                            Portfolio
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {/* Frame Gambar Mirip User Hero */}
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 bg-gray-50">
                        {hero.image_url ? (
                            <img src={hero.image_url} key={hero.image_url} className="w-full h-full object-cover" alt="Hero Preview" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-black tracking-widest italic">NO IMAGE</div>
                        )}
                    </div>
                    {/* Floating Badge Preview */}
                    <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 max-w-[120px]">
                        <p className="text-[7px] font-black text-orange-500 uppercase">Trusted Agency</p>
                        <p className="text-[9px] font-bold text-gray-800 leading-tight mt-1">150+ Creative Projects Done</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER MESSAGE */}
      <div className="mt-10 text-center">
          <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Changes applied here will affect the main landing page hero section.</p>
      </div>
    </div>
  );
}