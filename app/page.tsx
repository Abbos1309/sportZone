"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { useRouter } from "next/navigation";

type SuperAdmin = {
  id: string;
  login: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSuperAdmin();
  }, []);

  const getSuperAdmin = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/superAdmin");
      setSuperAdmin(data);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModals = () => {
    setOpenLogin(false);
    setOpenRegister(false);
    setLogin("");
    setPassword("");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const found = superAdmin.find(
        (item) => item.login === login && item.password === password
      );

      if (found) {
        closeModals();
        router.push("/superAdmin");
        localStorage.setItem("superAdminLogin", found.login);
      } else {
        alert("Login yoki parol xato");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      if (!login.trim() || !password.trim()) {
        alert("Login va parol kiriting");
        return;
      }

      await axios.post("http://localhost:4000/superAdmin", {
        login,
        password,
      });

      alert("Ro'yxatdan o'tdi");
      closeModals();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111a] text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/img.svg"
            alt="Gym background"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#07111a]" />
        </div>

        <div className="relative z-10">
          <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-md md:px-12">
            <div className="text-xl font-bold tracking-[0.3em] text-white">
              GYM SOFT
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenRegister(true)}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium transition hover:bg-white/20"
              >
                Registration
              </button>
              <button
                onClick={() => setOpenLogin(true)}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Log In
              </button>
            </div>
          </header>

          <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-10 md:grid-cols-2 md:px-12">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                Premium fitness management system
              </p>
              <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                Manage your gym with <span className="text-red-500">power</span>{" "}
                and style.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/75 md:text-lg">
                Super admin dashboard, member control, training plans, and smart
                registration flow — all in one place.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
                <img
                  src="/img.svg"
                  alt="Gym interior"
                  className="h-[520px] w-full rounded-[22px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <Rodal
          visible={openLogin}
          onClose={closeModals}
          width={520}
          height={420}
          customStyles={{
            background: "linear-gradient(180deg, #0b1c29 0%, #08131d 100%)",
            borderRadius: "18px",
            padding: "28px",
          }}
        >
          <div className="flex h-full flex-col justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">Super Admin Login</h2>
              <div className="mt-6 space-y-4">
                <input
                  placeholder="Login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="mt-8 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-70"
            >
              {loading ? "Checking..." : "Sign In"}
            </button>
          </div>
        </Rodal>

        <Rodal
          visible={openRegister}
          onClose={closeModals}
          width={520}
          height={420}
          customStyles={{
            background: "linear-gradient(180deg, #0b1c29 0%, #08131d 100%)",
            borderRadius: "18px",
            padding: "28px",
          }}
        >
          <div className="flex h-full flex-col justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold">Super Admin Registration</h2>
              <div className="mt-6 space-y-4">
                <input
                  placeholder="Login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="mt-8 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-70"
            >
              {loading ? "Saving..." : "Register"}
            </button>
          </div>
        </Rodal>
      </section>
    </main>
  );
}