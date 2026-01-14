"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await api.post("/auth/signin", { email, password });
            login(response.data, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h1>
                <p className="text-slate-400 text-center mb-8">Login to your wedding planner account</p>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
