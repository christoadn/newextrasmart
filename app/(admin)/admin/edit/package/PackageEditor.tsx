"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { CheckCircle, Plus, Trash2, ImageIcon, Save, Layout, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Package {
  id?: number | string;
  title: string;
  category: string;
  items: string[];
  image_url: string;
  order_index?: number; 
}

export default function PackageEditor() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH DATA SAAT LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/packages");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPackages(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addPackage = () => {
    const newPkg: Package = {
      id: `new-${Date.now()}`, 
      title: "PAKET BARU",
      category: "Outbound & Jeep Experience",
      items: ["Fasilitas 1"],
      image_url: "",
      order_index: packages.length 
    };
    setPackages([...packages, newPkg]);
  };

  const updateField = (id: string | number, field: keyof Package, value: any) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // ==========================================
  // FUNGSI KOMPRESI GAMBAR (SOLUSI TANPA XAMPP)
  // ==========================================
  const handleFileChange = (id: string | number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600; // Ukuran kecil agar aman di MariaDB
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Kompresi ke format JPEG dengan kualitas 0.5 (50%)
          // Ini akan menghasilkan string Base64 yang sangat ringan (< 100KB)
          const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.5);
          updateField(id, "image_url", optimizedBase64);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packages) 
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Dashboard Berhasil Diperbarui!");
        // Refresh data untuk sinkronisasi ID database
        const updatedRes = await fetch("/api/admin/packages");
        const updatedData = await updatedRes.json();
        setPackages(updatedData);
      } else {
        alert(`❌ Gagal: ${result.error || "Terjadi kesalahan pada server"}`);
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan jaringan. Cek koneksi Anda.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
      <p className="italic text-orange-600 font-bold uppercase tracking-widest text-xs">Menghubungkan ke MariaDB...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout className="text-orange-500" size={20} />
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Packages Editor</h1>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kelola detail paket layanan Journey Kemuning</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={addPackage} 
            className="flex-1 md:flex-none bg-cyan-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-cyan-600 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> ADD NEW
          </button>
          <button 
            onClick={saveAll} 
            disabled={saving} 
            className="flex-1 md:flex-none bg-orange-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest hover:bg-orange-700 disabled:bg-gray-300 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
            {saving ? "SAVING..." : "PUBLISH CHANGES"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: EDITING FORMS */}
        <div className="space-y-6">
          <AnimatePresence>
            {packages.map((pkg) => (
              <motion.div 
                key={pkg.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative group"
              >
                <button 
                  onClick={() => setPackages(packages.filter(p => p.id !== pkg.id))}
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Package Name</label>
                      <input 
                        type="text" 
                        value={pkg.title} 
                        onChange={e => updateField(pkg.id!, 'title', e.target.value)}
                        className="w-full border-b-2 border-gray-50 p-2 outline-none focus:border-orange-500 font-bold text-gray-800 transition-all"
                        placeholder="Judul Paket"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Sub-Category</label>
                      <input 
                        type="text" 
                        value={pkg.category} 
                        onChange={e => updateField(pkg.id!, 'category', e.target.value)}
                        className="w-full border-b-2 border-gray-50 p-2 outline-none focus:border-cyan-500 font-semibold text-orange-500 transition-all"
                        placeholder="Kategori"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Fasilitas (Pisahkan dengan koma)</label>
                    <textarea 
                      value={pkg.items.join(", ")} 
                      onChange={e => updateField(pkg.id!, 'items', e.target.value.split(",").map(item => item.trim()))}
                      className="w-full border border-gray-100 rounded-2xl p-4 mt-1 text-sm text-gray-600 focus:ring-2 focus:ring-orange-100 outline-none transition-all" 
                      rows={3}
                      placeholder="Contoh: Makan, Dokumentasi, Guide"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-5 py-2 rounded-full hover:bg-orange-50 transition-all border border-dashed border-gray-300 group/btn">
                      <ImageIcon size={16} className="text-gray-400 group-hover/btn:text-orange-500" />
                      <span className="text-[10px] font-black text-gray-500 uppercase">
                        {pkg.image_url ? "Change Image" : "Upload Image"}
                      </span>
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(pkg.id!, e)} />
                    </label>
                    {pkg.image_url && <span className="text-[9px] text-green-500 font-bold">✓ Image Ready (Optimized)</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {packages.length === 0 && (
            <div className="text-center p-20 border-2 border-dashed border-gray-200 rounded-[3rem]">
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Belum ada paket.</p>
            </div>
          )}
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:sticky lg:top-10 h-fit max-h-[85vh] overflow-hidden bg-gray-900 rounded-[3.5rem] p-3 shadow-2xl border-[10px] border-gray-800">
          <div className="bg-gray-800 text-white/30 p-3 text-center text-[9px] font-black tracking-[0.5em] uppercase rounded-t-[2.5rem]">Interactive Live View</div>
          
          <div className="bg-white h-full overflow-y-auto rounded-b-[2.5rem] p-6 space-y-10 custom-scrollbar pb-20">
            {packages.map((pkg, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden scale-95 origin-top transition-transform">
                <div className="relative h-44 bg-gray-100">
                  {pkg.image_url ? (
                    <img src={pkg.image_url} className="w-full h-full object-cover" alt="preview" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-200 uppercase font-black text-[10px]">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight uppercase">{pkg.title || "Nama Paket"}</h3>
                  <p className="text-orange-500 font-bold text-[11px] mb-4">{pkg.category || "Kategori"}</p>
                  <ul className="space-y-2">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-gray-500">
                        <CheckCircle size={14} className="text-cyan-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}