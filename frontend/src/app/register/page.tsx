"use client";

import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/signup", formData);
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light p-4 animate-in fade-in zoom-in duration-700">
            <div className="w-full max-w-md bg-white border border-brand-warm rounded-3xl p-8 shadow-2xl hover:shadow-brand-warm/40 transition-shadow">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join our exclusive wedding community</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-pulse">
                        <span>❌</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400 transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400 transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Role</label>
                            <select
                                name="role"
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all appearance-none"
                            >
                                <option value="USER">User / Couple</option>
                                <option value="VENDOR">Vendor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Phone</label>
                            <input
                                name="phone"
                                type="text"
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-gray-400 transition-all"
                                placeholder="+1 (555) 000"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-brand-primary hover:bg-brand-accent text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-primary/30 transform active:scale-95 transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Complete Registration"}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-brand-primary hover:text-brand-accent font-bold underline decoration-2 underline-offset-4 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
