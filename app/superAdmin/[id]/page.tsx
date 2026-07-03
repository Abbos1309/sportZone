"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type AdminData = {
    id: string;
    login: string;
    password: string;
    gymId: string;
    fullname?: string;
};

export default function AdminGymPage() {
    const router = useRouter();
    const { id } = useParams();

    const [fullname, setFullname] = useState("");
    const [login, setLogin] = useState("");
    const [parol, setParol] = useState("");
    const [gymName, setGymName] = useState("Loading Gym...");

    const [admins, setAdmins] = useState<AdminData[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [superAdminLogin, setSuperAdminLogin] = useState("Super Admin");

    useEffect(() => {
        const savedLogin = localStorage.getItem("superAdminLogin");
        if (savedLogin) {
            setSuperAdminLogin(savedLogin);
        }

        if (id) {
            getGymDetails();
            getGymAdmins();
        }
    }, [id]);

    const getGymDetails = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4000/gym/${id}`);
            setGymName(data.name);
        } catch (error) {
            console.log("Error loading gym profile:", error);
            setGymName("Gym Profile");
        }
    };

    const getGymAdmins = async () => {
        try {
            const { data } = await axios.get(`http://localhost:4000/admin?gymId=${id}`);
            setAdmins(data);
        } catch (error) {
            console.log("Error fetching targeted gym admins:", error);
        }
    };

    const handleSave = async () => {
        if (!login.trim() || !parol.trim()) {
            alert("Please fill in the Login and Parol fields");
            return;
        }

        try {
            const payload = {
                login,
                password: parol,
                gymId: id,
                fullname: fullname || login
            };

            if (editingId) {
                await axios.put(`http://localhost:4000/admin/${editingId}`, payload);
                setEditingId(null);
            } else {
                await axios.post("http://localhost:4000/admin", payload);
            }

            setFullname("");
            setLogin("");
            setParol("");
            getGymAdmins();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (admin: AdminData) => {
        setEditingId(admin.id);
        setFullname(admin.fullname || admin.login);
        setLogin(admin.login);
        setParol(admin.password);
    };

    const handleDelete = async (adminId: string) => {
        if (confirm("Are you sure?")) {
            try {
                await axios.delete(`http://localhost:4000/admin/${adminId}`);
                getGymAdmins();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <main className="min-h-screen bg-white p-8 text-black font-sans">
            <header className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold text-sm">
                        👤
                    </div>
                    <span className="font-semibold text-gray-700">
                        {superAdminLogin}
                    </span>
                </div>

                <div className="flex gap-8 font-medium">
                    <button onClick={() => router.push("/")} className="font-bold border-b-2 border-black pb-1">Gym</button>
                    <span className="text-red-800 cursor-pointer hover:text-red-600 transition">Settings</span>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem("superAdminLogin");
                        router.push("/");
                    }}
                    className="bg-red-600 text-white px-6 py-1.5 rounded-full font-semibold shadow hover:bg-red-500 transition"
                >
                    Log out
                </button>
            </header>

            <h1 className="text-center text-3xl font-normal my-6">{gymName}</h1>

            <section className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Fullname"
                    className="border border-gray-400 bg-gray-100 px-4 py-2 w-64 rounded outline-none"
                />
                <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Login"
                    className="border border-gray-400 bg-gray-100 px-4 py-2 w-64 rounded outline-none"
                />
                <input
                    type="text"
                    value={parol}
                    onChange={(e) => setParol(e.target.value)}
                    placeholder="Parol"
                    className="border border-gray-400 bg-gray-100 px-4 py-2 w-64 rounded outline-none"
                />
                <button
                    onClick={handleSave}
                    className="bg-[#786fa6] text-white font-medium px-8 py-2 rounded shadow-md hover:bg-[#574b90] transition"
                >
                    {editingId ? "Update" : "Save"}
                </button>
            </section>

            <hr className="border-gray-300 my-4" />

            <section className="max-w-4xl mx-auto mt-6">
                {admins.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 italic">
                        No admins configured for this specific gym.
                    </div>
                ) : (
                    admins.map((admin) => (
                        <div key={admin.id} className="flex justify-between items-center py-3 px-2 border-b border-gray-100">
                            <div className="grid grid-cols-3 gap-16 text-gray-800 text-base w-3/4">
                                <div className="truncate font-medium">{admin.fullname || admin.login}</div>
                                <div className="truncate text-gray-600">{admin.login}</div>
                                <div className="truncate text-gray-400">••••••••</div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEdit(admin)}
                                    className="bg-yellow-400 text-black px-6 py-1 rounded-full text-xs font-bold shadow-sm hover:bg-yellow-300 transition uppercase"
                                >
                                    edit
                                </button>
                                <button
                                    onClick={() => handleDelete(admin.id)}
                                    className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-bold hover:bg-red-200 transition uppercase"
                                >
                                    delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}