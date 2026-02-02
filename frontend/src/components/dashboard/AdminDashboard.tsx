"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AnalyticsDashboard from "./AnalyticsDashboard";

interface AdminStats {
    totalUsers: number;
    totalVendors: number;
    totalBookings: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/stats");
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in zoom-in duration-700">
            <header className="p-10 bg-white rounded-[2.5rem] border-2 border-brand-warm shadow-2xl shadow-brand-warm/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                    System Administration
                </h1>
                <p className="text-gray-500 mt-2 font-bold uppercase tracking-[0.2em] text-xs">Global platform metrics and ecosystem health.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AdminStatCard title="Global Users" value={stats?.totalUsers || 0} icon="👥" color="#FD7979" />
                <AdminStatCard title="Active Vendors" value={stats?.totalVendors || 0} icon="🏪" color="#FDACAC" />
                <AdminStatCard title="Platform Bookings" value={stats?.totalBookings || 0} icon="📈" color="#10b981" />
                <AdminStatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon="💎" color="#8b5cf6" />
            </div>

            <AnalyticsDashboard />

            <div className="bg-white border-2 border-brand-warm rounded-[3rem] p-16 text-center shadow-xl shadow-brand-warm/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-light opacity-30 -skew-y-6 transform origin-top-left -z-10"></div>
                <div className="text-6xl mb-8">🛡️</div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Management Console</h2>
                <p className="text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                    Global management features for users, vendors, and marketplace moderation are being currently initialized for deployment.
                </p>
                <div className="mt-10 flex justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                    <span className="w-2 h-2 rounded-full bg-brand-primary opacity-50"></span>
                </div>
            </div>
        </div>
    );
}

function AdminStatCard({ title, value, icon, color }: any) {
    return (
        <div className="p-8 bg-white border-2 border-brand-warm rounded-[2rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
            style={{ borderTop: `6px solid ${color}` }}>
            <div className="flex justify-between items-center mb-6">
                <div className="text-4xl group-hover:scale-125 transition-transform duration-500">{icon}</div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Global</span>
            </div>
            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-2">{title}</h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
    );
}
