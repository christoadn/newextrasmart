    "use client";

    import React, { useEffect, useState, useMemo } from "react";
    import { 
      AreaChart, Area, XAxis, YAxis, CartesianGrid, 
      Tooltip, ResponsiveContainer 
    } from "recharts";
    import { Users, Mail, Image as ImageIcon, Monitor, TrendingUp } from "lucide-react";

    interface DashboardResponse {
      traffic: number[];
      admin: {
        name: string;
        role: string;
      };
      counts: {
        partners: number;
        gallery: number;
        hero: number;
        about: number;
        messages: number;
      };
    }

    interface StatCardProps {
      title: string;
      value: number;
      icon: React.ReactNode;
    }

    export default function DashboardPage() {
      const [data, setData] = useState<DashboardResponse | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetch("/api/admin/dashboard")
          .then((res) => res.json())
          .then((res) => {
            setData(res);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, []);

      const chartData = useMemo(() => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const traffic = data?.traffic || [0, 0, 0, 0, 0, 0, 0];

        return days.map((day, i) => ({
          name: day,
          visitors: traffic[i] || 0,
        }));
      }, [data]);

      if (loading)
        return (
          <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Loading ExtraSmart...
              </p>
            </div>
          </div>
        );

      return (
        <div className="flex-1 p-6 md:p-10 overflow-x-hidden bg-[#F8FAFC] min-h-screen">
          {/* HEADER */}
          <header className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              System Statistics
            </h1>
            <p className="text-sm text-slate-500 italic">
              Connected to:{" "}
              <span className="text-indigo-600 font-semibold">
                db_new_extra_smart
              </span>
            </p>
          </header>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Partners"
              value={data?.counts?.partners || 0}
              icon={<Users size={18} />}
            />
            <StatCard
              title="Gallery Photos"
              value={data?.counts?.gallery || 0}
              icon={<ImageIcon size={18} />}
            />
            <StatCard
              title="Page Sections"
              value={(data?.counts?.hero || 0) + (data?.counts?.about || 0)}
              icon={<Monitor size={18} />}
            />
            <StatCard
              title="Inquiries"
              value={data?.counts?.messages || 0}
              icon={<Mail size={18} />}
            />
          </div>

          {/* CHART */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="mb-8">
              <h3 className="font-bold text-slate-800 text-lg">
                Traffic Visitors
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                +12.5% increase from last week
              </p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="100%">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow:
                        "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVis)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      );
    }

    function StatCard({ title, value, icon }: StatCardProps) {
      return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors group">
          <div className="p-2.5 bg-slate-50 rounded-xl text-indigo-600 w-fit mb-4 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {title}
          </p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {value}
          </h4>
        </div>
      );
    }