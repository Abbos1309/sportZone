'use client';
import { useState } from 'react';
import { LuUserPlus, LuX } from "react-icons/lu";

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Gym Name</h1>
        </div>
      </div>

      <div className="flex gap-4 items-center mb-6">
        <input 
          type="text" 
          placeholder="Phone number" 
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors w-64"
        />
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95"
        >
          <LuUserPlus className="text-lg"/>
          Add User
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800/60 rounded-2xl overflow-hidden shadow-xl divide-y divide-zinc-800/50">
        
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-900">
              <LuX className="text-xl" />
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-100">Yangi foydalanuvchi qo'shish</h2>
              <p className="text-xs text-zinc-400 mt-1">Mijozning asosiy ma'lumotlarini kiriting</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Full Name</label>
                <input type="text" placeholder="Ism Familiya" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                <input type="text" placeholder="+998901234567" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10">Qo'shish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}