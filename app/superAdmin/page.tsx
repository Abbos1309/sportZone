"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

type Gym = {
  id: string;
  name: string;
  location: string;
};

type SuperAdmin = {
  id: string;
  login: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"gym" | "settings">("gym");
  const [gym, setGym] = useState<Gym[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [superAdmin, setSuperAdmin] = useState<SuperAdmin[]>([]);
  const [adminId, setAdminId] = useState<string>("");
  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    getGym();
    getSuperAdmin();
  }, []);

  const getGym = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/gym");
      setGym(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSuperAdmin = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/superAdmin");
      setSuperAdmin(data);
      if (data.length > 0) {
        setAdminId(data[0].id);
        setAdminLogin(data[0].login);
        setAdminPassword(data[0].password);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveGym = async () => {
    try {
      setLoading(true);

      if (!name.trim() || !location.trim()) {
        alert("Name va location kiriting");
        return;
      }

      if (editingId) {
        await axios.put(`http://localhost:4000/gym/${editingId}`, {
          name,
          location,
        });
      } else {
        await axios.post("http://localhost:4000/gym", {
          name,
          location,
        });
      }

      setName("");
      setLocation("");
      setEditingId(null);
      getGym();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGym = (item: Gym) => {
    setName(item.name);
    setLocation(item.location);
    setEditingId(item.id);
    setActiveTab("gym");
  };

  const handleDeleteGym = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/gym/${id}`);
      getGym();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const handleUpdateSuperAdmin = async () => {
    try {
      if (!adminId) return;

      await axios.put(`http://localhost:4000/superAdmin/${adminId}`, {
        login: adminLogin,
        password: adminPassword,
      });

      alert("SuperAdmin ma'lumotlari yangilandi");
      setSettingsOpen(false);
      getSuperAdmin();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111a] text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <div className="flex items-center gap-4">
            <img
              src="/img.svg"
              alt="logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <div className="text-xl font-bold tracking-[0.3em]">GYM SOFT</div>
              <div className="text-sm text-white/50">
                {superAdmin[0]?.login || "Super Admin"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("gym")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === "gym"
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              GYM
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              SETTINGS
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12">
        {activeTab === "gym" ? (
          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Gym" : "Add Gym"}
              </h2>

              <div className="mt-6 space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="GYM name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
                />

                <button
                  onClick={handleSaveGym}
                  disabled={loading}
                  className="w-full rounded-xl bg-red-600 py-3 font-semibold hover:bg-red-500 disabled:opacity-70"
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Save"}
                </button>

                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setLocation("");
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-semibold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold">Gyms</h2>

              <div className="mt-6 grid gap-4">
                {gym.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/50">
                    No gyms yet
                  </div>
                ) : (
                  gym.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center"
                    >
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-white/60">{item.location}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditGym(item)}
                          className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 font-medium text-blue-200 hover:bg-blue-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteGym(item.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-medium text-red-200 hover:bg-red-500/20"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => router.push(`/superAdmin/${item.id}`)}
                          className="rounded-xl border  bg-sky-500/10 px-4 py-2 font-medium text-sky-200 hover:bg-sky-500/20"
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <Rodal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        width={520}
        height={360}
        customStyles={{
          background: "linear-gradient(180deg, #0b1c29 0%, #08131d 100%)",
          borderRadius: "18px",
          padding: "28px",
        }}
      >
        <div className="flex h-full flex-col justify-between text-white">
          <div>
            <h2 className="text-2xl font-bold">Super Admin Settings</h2>
            <div className="mt-6 space-y-4">
              <input
                value={adminLogin}
                onChange={(e) => setAdminLogin(e.target.value)}
                placeholder="Login"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
              />
              <input
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40 focus:border-red-500"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateSuperAdmin}
            className="mt-8 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Save Changes
          </button>
        </div>
      </Rodal>
    </main>
  );
}