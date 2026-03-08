"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";

interface Service {
  id?: number | string;
  title: string;
  desc: string;
  icon_name: string;
}

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // List icon populer untuk memudahkan admin memilih
  const popularIcons = ["PartyPopper", "CalendarDays", "HeartHandshake", "Music", "Camera", "Mic2", "Utensils", "Lightbulb", "ShieldCheck"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (data) setServices(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    const newService: Service = {
      id: `new-${Date.now()}`,
      title: "",
      desc: "",
      icon_name: "PartyPopper",
    };
    setServices([...services, newService]);
  };

  const deleteService = (id: number | string) => {
    if (confirm("Hapus layanan ini?")) {
      if (typeof id === 'number') {
        setDeletedIds(prev => [...prev, id]);
      }
      setServices(services.filter(s => s.id !== id));
    }
  };

  const updateService = (id: number | string, field: keyof Service, value: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services, deletedIds })
      });
      if (res.ok) {
        alert("✅ Services berhasil diperbarui!");
        fetchData();
        setDeletedIds([]);
      } else {
        alert("Gagal menyimpan data.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center italic text-orange-600">Sinkronisasi Layanan...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen pb-32">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">Services Dashboard Hero</h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Manage your premium offerings</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-orange-600 text-white px-8 py-3 rounded-full text-xs font-black tracking-widest hover:bg-orange-700 disabled:bg-gray-300 shadow-lg transition-all"
        >
          {saving ? "SAVING..." : "SAVE ALL CHANGES"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: FORM EDITOR */}
        <div className="space-y-6">
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group"
              >
                <button 
                  onClick={() => deleteService(service.id!)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Service Title</label>
                    <input 
                      type="text" 
                      value={service.title} 
                      onChange={e => updateService(service.id!, 'title', e.target.value)}
                      className="w-full border rounded-xl p-3 mt-1 outline-orange-500 font-bold text-gray-700"
                      placeholder="Contoh: Wedding Organizer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Icon Name (Lucide)</label>
                    <select 
                      value={service.icon_name}
                      onChange={e => updateService(service.id!, 'icon_name', e.target.value)}
                      className="w-full border rounded-xl p-3 mt-1 outline-orange-500 text-sm"
                    >
                      {popularIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Preview Icon</label>
                    <div className="mt-1 p-2 bg-orange-50 rounded-xl flex items-center justify-center w-12 h-12 text-orange-600">
                      {(() => {
                        const Icon = (LucideIcons as any)[service.icon_name] || LucideIcons.HelpCircle;
                        return <Icon size={24} />;
                      })()}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                    <textarea 
                      rows={3}
                      value={service.desc} 
                      onChange={e => updateService(service.id!, 'desc', e.target.value)}
                      className="w-full border rounded-xl p-3 mt-1 outline-orange-500 text-sm leading-relaxed"
                      placeholder="Jelaskan detail layanan ini..."
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button 
            onClick={addService}
            className="w-full py-6 border-2 border-orange-500 border-dashed text-orange-600 font-black text-[10px] tracking-widest rounded-3xl hover:bg-orange-50 transition-all uppercase"
          >
            + Add New Service
          </button>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:sticky lg:top-6 h-fit bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 text-white p-4 text-center text-[10px] font-black tracking-[0.3em] uppercase italic">Live Interactive Preview</div>
          
          <div className="p-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-[500px]">
            <h2 className="text-3xl font-bold text-center mb-10">Our <span className="text-orange-500">Premium</span> Services</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((s, idx) => {
                const IconComp = (LucideIcons as any)[s.icon_name] || LucideIcons.HelpCircle;
                return (
                  <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                    <div className="text-orange-500 mb-4">
                      <IconComp size={32} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{s.title || "Layanan Baru"}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.desc || "Deskripsi belum diisi..."}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}