"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Image as ImageIcon,
  Users,
  FileText,
  LayoutDashboard,
  Monitor,
  LogOut,
  Briefcase,
  Menu,
  X
} from "lucide-react";

interface Props {
  adminName?: string;
  role?: string;
}

export default function AdminSidebar({
  adminName = "Admin",
  role = "Staff",
}: Props) {

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { label: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard size={18}/> },
    { label: "Hero Section", href: "/admin/edit/hero", icon: <Monitor size={18}/> },
    { label: "About Section", href: "/admin/edit/about", icon: <FileText size={18}/> },
    { label: "Services Hero", href: "/admin/edit/services", icon: <Briefcase size={18}/> },
    { label: "Services Package", href: "/admin/edit/package", icon: <Briefcase size={18}/> },
    { label: "Gallery Event", href: "/admin/edit/gallery", icon: <ImageIcon size={18}/> },
    { label: "Partners", href: "/admin/edit/partners", icon: <Users size={18}/> },
  ];

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-40">
        <h2 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-600 rounded"></div>
          NewExtraSmart
        </h2>

        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-0 left-0 z-50
        w-64 h-screen bg-white border-r border-slate-200
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        flex flex-col
      `}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <Link href="/admin/dashboard">
            <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2 text-indigo-600">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg"></div>
              NewExtraSmart
            </h2>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Editor Website
          </p>

          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                pathname === item.href
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              {item.icon}
              <span className="text-sm font-bold tracking-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* ADMIN INFO */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {adminName.charAt(0)}
            </div>

            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-800 truncate">
                {adminName}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {role}
              </span>
            </div>
          </div>

          <Link href="/admin/login">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
              <LogOut size={16}/> Logout
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}