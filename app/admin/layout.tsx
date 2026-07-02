'use client';
import Link from 'next/link'; 
import { useEffect, useState } from 'react';
import { LuUsers } from "react-icons/lu";
import { CgGym } from "react-icons/cg";
import { FiLayers } from "react-icons/fi";
import { BsCalculator } from "react-icons/bs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem("adminUser"));
    checkAuth();
    window.addEventListener("adminAuthChange", checkAuth);
    return () => window.removeEventListener("adminAuthChange", checkAuth);
  }, []);

  const disabledClass = "opacity-40 cursor-not-allowed pointer-events-none";
  const linkClass = "flex items-center gap-3.5 px-4 py-3 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 hover:translate-x-1 transition-all duration-200 group relative";
  return (
    <div className="flex min-h-screen bg-zinc-900 text-zinc-100">
      
      <div className="w-64 bg-zinc-950 text-zinc-100 flex flex-col justify-between p-5 min-h-screen border-r border-zinc-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div>
          <div className="flex items-center gap-3 mb-10 mt-2 px-2 group">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-2 rounded-xl text-xl shadow-lg shadow-blue-500/20 transform group-hover:rotate-6 transition-transform">
              <CgGym/>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">SPORTZONE</span>
              <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
          </div>

          <p className="text-[11px] font-bold text-zinc-500 tracking-widest uppercase px-3 mb-4">Admin Menu</p>

          <nav className="space-y-1.5">
            {isLoggedIn ? (
              <Link href="/admin/foydalanuvchilar" className={linkClass}>
                <span className="text-xl text-zinc-500 group-hover:text-blue-400 transition-colors"><LuUsers/></span>
                <span className="font-medium text-sm tracking-wide">Foydalanuvchilar</span>
              </Link>
            ) : (
              <span className={`${linkClass} ${disabledClass}`}>
                <span className="text-xl text-zinc-500"><LuUsers/></span>
                <span className="font-medium text-sm tracking-wide">Foydalanuvchilar</span>
              </span>
            )}
            {isLoggedIn ? (
              <Link href="/admin/create-job" className={linkClass}>
                <span className="text-xl text-zinc-500 group-hover:text-blue-400 transition-colors"><FiLayers/></span>
                <span className="font-medium text-sm tracking-wide">Ta'riflar</span>
              </Link>
            ) : (
              <span className={`${linkClass} ${disabledClass}`}>
                <span className="text-xl text-zinc-500"><FiLayers/></span>
                <span className="font-medium text-sm tracking-wide">Ta'riflar</span>
              </span>
            )}
            {isLoggedIn ? (
              <Link href="/admin/applies" className={linkClass}>
                <span className="text-xl text-zinc-500 group-hover:text-blue-400 transition-colors"><BsCalculator/></span>
                <span className="font-medium text-sm tracking-wide">Hisobot</span>
              </Link>
            ) : (
              <span className={`${linkClass} ${disabledClass}`}>
                <span className="text-xl text-zinc-500"><BsCalculator/></span>
                <span className="font-medium text-sm tracking-wide">Hisobot</span>
              </span>
            )}
          </nav>
        </div>
        <div className="mt-auto px-2 pt-4 border-t border-zinc-900">
          <button disabled={!isLoggedIn} className={`w-full bg-zinc-900 border border-zinc-800 text-zinc-400 py-3 rounded-xl font-medium transition-all duration-200 text-sm shadow-inner ${isLoggedIn ? "hover:bg-red-950/40 hover:border-red-900/40 hover:text-red-400" : "opacity-40 cursor-not-allowed"}`}>Logout</button>
        </div>
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}