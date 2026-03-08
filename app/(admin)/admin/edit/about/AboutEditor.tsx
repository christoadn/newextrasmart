"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

interface AboutContent {
  id: number;
  title: string;
  content: string;
  vision: string;
  mission: string;
  image_url?: string;
  vision_url?: string;
  mission_url?: string;
}

export default function AboutEditor() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/about");
        const data = await res.json();
        if (data.content) setAbout(data.content);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: keyof AboutContent) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAbout(prev => prev ? { ...prev, [field]: result } : null);
    };
    reader.readAsDataURL(file);
  };

  const saveAbout = async () => {
    if (!about) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about)
      });
      if (res.ok) alert("✅ Database About Berhasil Diperbarui!");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center italic text-cyan-600">Menghubungkan ke MariaDB...</div>;
  if (!about) return <div className="p-20 text-center text-red-500 font-bold">Data tidak ditemukan.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">About Editor</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Management System / About Section</p>
        </div>
        <button 
            onClick={saveAbout} 
            disabled={saving} 
            className="bg-cyan-600 text-white px-8 py-3 rounded-2xl text-xs font-black tracking-widest hover:bg-cyan-700 disabled:bg-gray-300 transition-all shadow-xl shadow-cyan-100"
        >
            {saving ? "SAVING..." : "UPDATE DATABASE"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: FORM EDITING */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-sm font-black text-cyan-600 uppercase tracking-widest mb-2">Main Identity</h2>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Section Title</label>
                <input type="text" value={about.title} onChange={e => setAbout({...about, title: e.target.value})} className="w-full border rounded-xl p-3 mt-1 outline-cyan-500 text-sm font-bold" />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">About Content</label>
                <textarea rows={4} value={about.content} onChange={e => setAbout({...about, content: e.target.value})} className="w-full border rounded-xl p-3 mt-1 outline-cyan-500 text-sm leading-relaxed" />
            </div>
            <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Main Lobby Image</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image_url')} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-50 file:text-cyan-700 file:font-bold" />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-2">Vision & Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Vision Text</label>
                    <textarea rows={3} value={about.vision} onChange={e => setAbout({...about, vision: e.target.value})} className="w-full border rounded-xl p-3 outline-orange-500 text-xs italic" />
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Vision Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'vision_url')} className="text-[10px] w-full" />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Mission Points</label>
                    <textarea rows={3} value={about.mission} onChange={e => setAbout({...about, mission: e.target.value})} className="w-full border rounded-xl p-3 outline-orange-500 text-xs" placeholder="Gunakan baris baru untuk setiap poin..." />
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Mission Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'mission_url')} className="text-[10px] w-full" />
                </div>
            </div>
          </section>
        </div>

        {/* RIGHT: LIVE USER PREVIEW */}
        <div className="lg:sticky lg:top-6 h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-y-auto border border-gray-100 custom-scrollbar">
          <div className="sticky top-0 z-20 bg-gray-900 text-white p-3 text-center text-[9px] font-black tracking-[0.3em] uppercase italic">Live UI Preview</div>
          
          <div className="p-10 space-y-12">
            {/* Header Preview */}
            <div className="text-center">
                <h2 className={`${baloo.className} text-3xl text-gray-800`}>About <span className="text-cyan-500">Us</span></h2>
                <div className="w-12 h-1 bg-cyan-500 mx-auto mt-2 rounded-full"></div>
            </div>

            {/* Who We Are Preview */}
            <div className="grid grid-cols-1 gap-6">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                    <img src={about.image_url || "/placeholder.jpg"} className="w-full h-full object-cover" alt="Lobby" />
                </div>
                <div className="text-center px-4">
                    <h3 className="font-bold text-gray-800 italic mb-2">{about.title}</h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed"><span className="text-orange-600 font-bold">New Extra Smart</span> {about.content}</p>
                </div>
            </div>

            {/* Vision Preview (Image Left) */}
            <div className="flex gap-4 items-center">
                <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden rotate-[-3deg] shadow-md border-2 border-white">
                    <img src={about.vision_url || about.image_url} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-2/3 p-5 bg-orange-50 rounded-[1.5rem] border-l-4 border-orange-500">
                    <h4 className="text-[10px] font-black text-gray-700 uppercase mb-1">Our Vision</h4>
                    <p className="text-[10px] italic text-gray-500">"{about.vision}"</p>
                </div>
            </div>

            {/* Mission Preview (Image Right) */}
            <div className="flex gap-4 items-center flex-row-reverse">
                <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden rotate-[3deg] shadow-md border-2 border-white">
                    <img src={about.mission_url || about.image_url} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-2/3 p-5 bg-cyan-50 rounded-[1.5rem] border-l-4 border-cyan-500">
                    <h4 className="text-[10px] font-black text-gray-700 uppercase mb-1">Our Mission</h4>
                    <ul className="space-y-1">
                        {(about.mission || "").split('\n').filter(m => m.trim() !== "").map((m, i) => (
                            <li key={i} className="text-[9px] text-gray-500 flex items-center gap-1">
                                <span className="w-1 h-1 bg-cyan-500 rounded-full" /> {m}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}