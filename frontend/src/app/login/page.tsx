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
            console.error("Login Error:", err.response?.data);
            const message = err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please check your email and password.";
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light p-4 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white border border-brand-warm rounded-3xl p-8 shadow-2xl hover:shadow-brand-warm/50 transition-shadow duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Login to your wedding planner account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3 animate-bounce">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-primary/30 transform active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing In...
                            </span>
                        ) : "Sign In"}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-brand-primary hover:text-brand-accent font-bold underline decoration-2 underline-offset-4 transition-colors">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
