"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AnimatedLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const eyeX = Math.min(Math.max(email.length * 0.5 - 5, -6), 6);
  const eyeY = email.length > 0 ? 2 : 0;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⭐ PENTING: supaya cookie dari server tersimpan
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login gagal");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">

      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-300/20 blur-[160px]" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-300/20 blur-[160px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        <motion.div
          animate={{
            boxShadow: isSuccess
              ? "0 0 0 4px rgba(34,197,94,0.3), 0 40px 120px -20px rgba(0,0,0,0.15)"
              : "0 40px 120px -20px rgba(0,0,0,0.15)",
          }}
          className="relative overflow-hidden rounded-[40px] border border-white/40 bg-white/70 p-10 backdrop-blur-3xl transition-all duration-500"
        >

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-2xl font-bold text-slate-800"
                >
                  Login Berhasil
                </motion.h2>

                <p className="text-sm text-slate-500 mt-2">
                  Mengalihkan ke dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-white to-slate-100 shadow-inner ring-4 ring-white/80">
            <div className="relative flex h-20 w-24 items-center justify-center gap-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isPasswordFocused ? (
                      <motion.div
                        key="closed"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className="h-[3px] w-4 bg-slate-800 rounded-full"
                      />
                    ) : (
                      <motion.div
                        key="open"
                        animate={{ x: eyeX, y: eyeY }}
                        transition={{ type: "spring", stiffness: 150, damping: 15 }}
                        className="h-3.5 w-3.5 rounded-full bg-slate-900"
                      />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <motion.div
              animate={{ width: email.length > 0 ? 14 : 8 }}
              className="absolute bottom-6 h-1 bg-slate-300 rounded-full"
            />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-500">Akses aman ke dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@newextrasmart.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white/70 py-4 pl-12 pr-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/70 py-4 pl-12 pr-12 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={isLoading || isSuccess}
              className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-indigo-600 disabled:opacity-70"
            >
              <div className="flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Masuk ke Dashboard"
                )}
              </div>
            </motion.button>

          </form>

          <div className="mt-8 flex items-center justify-center gap-2 pt-6 border-t border-slate-100">
            <ShieldCheck size={14} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Secure Login System
            </span>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}