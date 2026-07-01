'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LuUserPlus, LuX } from "react-icons/lu";

const API_URL = "http://localhost:4000";

type User = { id: string; fullName: string; phone: string; gymId: string };
type Gym = { id: string; name: string };
type AdminSession = { id: string; login: string; gymId: string };

export default function AdminPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) return;
    const session: AdminSession = JSON.parse(stored);
    setAdmin(session);
    getGym(session.gymId);
    getUsers(session.gymId);
  }, []);

  const getGym = async (gymId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/gym/${gymId}`);
      setGym(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async (gymId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/users?gymId=${gymId}`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/admin`);
      const found = data.find(
        (item: { login: string; password: string }) =>
          item.login === login && item.password === password
      );
      if (found) {
        const session = { id: found.id, login: found.login, gymId: found.gymId };
        localStorage.setItem("adminUser", JSON.stringify(session));
        setAdmin(session);
        window.dispatchEvent(new Event("adminAuthChange"));
        getGym(found.gymId);
        getUsers(found.gymId);
        setLogin("");
        setPassword("");
      } else {
        alert("Login yoki parol xato");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!fullName.trim() || !phone.trim()) {
      alert("Ism va telefon raqamini kiriting");
      return;
    }
    if (!admin) return;
    try {
      setLoading(true);
      await axios.post(`${API_URL}/users`, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        gymId: admin.gymId,
      });
      setFullName("");
      setPhone("");
      setIsOpen(false);
      getUsers(admin.gymId);
    } catch (error) {
      console.log(error);
      alert("Foydalanuvchi qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm disabled:opacity-70"
            >
              {loading ? "Kirish..." : "Kirish"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">{gym?.name || "Gym Name"}</h1>
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
        {users.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">Foydalanuvchilar yo&apos;q</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-zinc-100">{user.fullName}</p>
                <p className="text-sm text-zinc-400">{user.phone}</p>
              </div>
            </div>
          ))
        )}
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
                <input type="text" placeholder="Ism Familiya" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Phone Number</label>
                <input type="text" placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={handleAddUser} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/10 disabled:opacity-70">{loading ? "Saving..." : "Qo'shish"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
