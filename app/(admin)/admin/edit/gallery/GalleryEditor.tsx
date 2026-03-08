"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { Baloo_2 } from "next/font/google";
import { 
  Trash2, 
  Plus, 
  ImageIcon, 
  Save, 
  X, 
  FilePlus, 
  AlertCircle, 
  ChevronRight 
} from "lucide-react";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// --- FUNGSI KOMPRESI IMAGE ---
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000; 
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.5));
      };
    };
  });
};

interface GalleryItem {
  id?: number;
  title: string;
  category: string;
  cover: string; 
  images: string[];
}

export default function GalleryEditor() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fileInputDocsRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      if (Array.isArray(data)) {
        const formattedData = data.map(item => ({
          ...item,
          images: typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || [])
        }));
        setItems(formattedData);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCoverChange = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    const newItems = [...items];
    newItems[index].cover = compressed;
    setItems(newItems);
  };

  const handleDocsChange = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const files = e.target.files;
    if (!files) return;

    const currentImagesCount = items[index].images.length;
    const newFilesCount = files.length;

    if (currentImagesCount + newFilesCount > 10) {
      alert(`⚠️ Maksimal 10 foto per moment!`);
      return;
    }

    const compressedPromises = Array.from(files).map(file => compressImage(file));
    const compressedImages = await Promise.all(compressedPromises);

    setItems(prev => {
      const newItems = [...prev];
      newItems[index].images = [...newItems[index].images, ...compressedImages];
      return newItems;
    });
  };

  const removeDocImage = (momentIdx: number, imgIdx: number) => {
    const newItems = [...items];
    newItems[momentIdx].images = newItems[momentIdx].images.filter((_, i) => i !== imgIdx);
    setItems(newItems);
  };

  const addNewMoment = () => {
    const newItem: GalleryItem = { title: "Event Baru", category: "Outdoor", cover: "", images: [] };
    setItems([newItem, ...items]);
    setSelectedIndex(0);
  };

  const deleteMoment = (index: number) => {
    if (window.confirm("Hapus moment ini dari daftar? (Perubahan akan permanen setelah Anda klik Save All)")) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      
      // Mengatur ulang index agar tidak out of bounds
      if (index >= newItems.length) {
        setSelectedIndex(Math.max(0, newItems.length - 1));
      }
    }
  };

  const saveAll = async () => {
    const isAnyOverLimit = items.some(item => item.images.length > 10);
    if (isAnyOverLimit) {
      alert("Gagal simpan! Ada moment yang melebihi 10 foto.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      });
      if (res.ok) alert("✅ Gallery Berhasil Disinkronkan ke MariaDB!");
      else alert("Gagal menyimpan data.");
    } catch (err) {
      alert("Koneksi Error: Data terlalu besar atau server sibuk.");
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="p-20 text-center italic text-orange-600 animate-pulse font-bold tracking-widest uppercase">Initializing MariaDB...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Gallery Dashboard</h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Management System for NEW EXTRA SMART</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addNewMoment} className="bg-white border shadow-sm px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-2 hover:bg-orange-50 transition-all">
            <Plus size={14}/> Tambah Moment
          </button>
          <button onClick={saveAll} disabled={saving} className="bg-orange-600 text-white px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest hover:bg-orange-700 disabled:bg-gray-300 shadow-lg shadow-orange-200 transition-all">
            {saving ? "SYNCING..." : "SAVE ALL CHANGES"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* EDITOR SECTION */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            
            {/* TABS NAVIGATION WITH DELETE BUTTON */}
            <div className="flex gap-2 overflow-x-auto pb-4 border-b scrollbar-hide">
                {items.map((item, i) => (
                <div key={i} className="relative flex-shrink-0 group">
                  <button 
                    onClick={() => setSelectedIndex(i)} 
                    className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap pr-10 ${
                      selectedIndex === i ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {item.title.substring(0, 15)}{item.title.length > 15 ? '...' : ''}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteMoment(i); }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all p-1 rounded-full ${
                      selectedIndex === i ? 'text-orange-200 hover:text-white' : 'text-gray-300 hover:text-red-500'
                    }`}
                  >
                    <X size={12} strokeWidth={4} />
                  </button>
                </div>
                ))}
            </div>

            {items.length > 0 ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Judul Event</label>
                        <input type="text" value={items[selectedIndex].title} onChange={e => {const n = [...items]; n[selectedIndex].title = e.target.value; setItems(n);}} className="w-full border-gray-200 border rounded-xl p-3 text-sm font-bold outline-orange-400 bg-gray-50/50" placeholder="Contoh: LDKS SMPN 1 Bogor" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Kategori</label>
                        <input type="text" value={items[selectedIndex].category} onChange={e => {const n = [...items]; n[selectedIndex].category = e.target.value; setItems(n);}} className="w-full border-gray-200 border rounded-xl p-3 text-xs font-bold text-orange-600 outline-orange-400 bg-gray-50/50" placeholder="Contoh: Outdoor" />
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-b pb-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 block tracking-widest">Cover Image (Thumbnail)</label>
                            <input type="file" accept="image/*" onChange={e => handleCoverChange(e, selectedIndex)} className="text-[10px] file:bg-gray-100 file:border-0 file:rounded-full file:px-4 file:py-2 file:font-black file:text-gray-600 file:mr-4 file:cursor-pointer" />
                        </div>
                        <button onClick={() => deleteMoment(selectedIndex)} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-[9px] font-black uppercase tracking-tighter transition-all mb-1">
                           <Trash2 size={14}/> Hapus Moment
                        </button>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                              <label className="text-[10px] font-black uppercase text-gray-800 tracking-widest">Dokumentasi Event</label>
                              <p className="text-[9px] text-gray-400 font-bold italic">Maksimal 10 foto terbaik untuk performa web</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black ${items[selectedIndex].images.length >= 10 ? 'text-red-500' : 'text-orange-500'}`}>
                                    {items[selectedIndex].images.length} / 10
                                </span>
                                <button 
                                  disabled={items[selectedIndex].images.length >= 10}
                                  onClick={() => fileInputDocsRef.current?.click()} 
                                  className="text-white disabled:bg-gray-200 bg-gray-900 text-[10px] font-black flex items-center gap-2 uppercase tracking-widest px-4 py-2 rounded-lg transition-all active:scale-95"
                                >
                                    <FilePlus size={14}/> Upload Foto
                                </button>
                            </div>
                        </div>
                        
                        <input type="file" multiple accept="image/*" ref={fileInputDocsRef} onChange={e => handleDocsChange(e, selectedIndex)} className="hidden" />
                        
                        <div className="grid grid-cols-5 gap-3">
                            {items[selectedIndex].images.map((img, imgIdx) => (
                                <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-50 group bg-gray-100 shadow-sm transition-transform hover:scale-95">
                                    <img src={img} className="w-full h-full object-cover" alt="doc" />
                                    <button onClick={() => removeDocImage(selectedIndex, imgIdx)} className="absolute inset-0 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={18} strokeWidth={2.5}/>
                                    </button>
                                </div>
                            ))}
                            {/* Empty Slots */}
                            {Array.from({ length: 10 - items[selectedIndex].images.length }).map((_, i) => (
                              <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200">
                                <ImageIcon size={20} opacity={0.3}/>
                              </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Plus size={32}/>
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Belum ada data galeri</p>
                    <button onClick={addNewMoment} className="text-orange-600 font-black text-[10px] uppercase underline">Klik untuk menambah moment pertama</button>
                </div>
            )}
        </div>

        {/* PREVIEW SECTION (MOBILE FRAME) */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl overflow-hidden border-[8px] border-gray-800">
              <div className="bg-gray-800 py-3 text-center mb-2">
                 <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-2"></div>
                 <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em]">Live Mobile Preview</span>
              </div>
              <div className="bg-white rounded-[2.2rem] p-6 min-h-[550px] flex flex-col relative overflow-y-auto max-h-[700px] scrollbar-hide">
                  {items.length > 0 ? (
                      <div className="max-w-xs mx-auto space-y-6 w-full animate-in slide-in-from-bottom-4 duration-700">
                          {/* Main Card Preview */}
                          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 border-4 border-white">
                              {items[selectedIndex].cover ? (
                                <img src={items[selectedIndex].cover} className="w-full h-full object-cover" alt="cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                    <ImageIcon size={32}/>
                                    <span className="italic text-[10px]">No Cover Image</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                              <div className="absolute bottom-7 left-7 text-white pr-6">
                                  <p className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] mb-2 drop-shadow-md">
                                    {items[selectedIndex].category || "Category Name"}
                                  </p>
                                  <h3 className={`${baloo.className} text-2xl leading-tight drop-shadow-lg`}>
                                    {items[selectedIndex].title || "Moment Title Goes Here"}
                                  </h3>
                              </div>
                          </div>

                          {/* Dots & Small Thumbs */}
                          <div className="space-y-3">
                              <div className="flex justify-between items-center px-2">
                                  <span className="text-[10px] font-black uppercase text-gray-800 tracking-tighter">Documentation</span>
                                  <ChevronRight size={14} className="text-orange-500"/>
                              </div>
                              <div className="grid grid-cols-3 gap-2 px-1">
                                 {items[selectedIndex].images.length > 0 ? (
                                     items[selectedIndex].images.slice(0, 3).map((img, i) => (
                                       <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-md border-2 border-white bg-gray-50">
                                         <img src={img} className="w-full h-full object-cover" alt="doc-thumb" />
                                       </div>
                                     ))
                                 ) : (
                                     [1,2,3].map(i => (
                                         <div key={i} className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                                             <ImageIcon size={12} className="text-gray-200"/>
                                         </div>
                                     ))
                                 )}
                              </div>
                          </div>
                      </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                       <AlertCircle size={48} className="mb-4 opacity-10"/>
                       <p className="italic text-xs font-medium uppercase tracking-widest">No Data to Preview</p>
                    </div>
                  )}
              </div>
          </div>
          
          {/* HOSTING NOTE */}
          <div className="mt-8 p-5 bg-orange-50 rounded-3xl border border-orange-100 flex gap-4 items-start shadow-sm">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <AlertCircle size={20}/>
              </div>
              <div className="text-[11px] text-orange-800 leading-relaxed font-bold uppercase tracking-tight">
                <strong>Hosting Management:</strong> 
                <p className="mt-1 font-medium lowercase opacity-80 leading-normal">
                  sistem mengompres gambar ke format jpeg (kualitas 0.5) secara otomatis untuk menghemat ruang MariaDB Anda. maksimal 10 foto per event sangat disarankan.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}