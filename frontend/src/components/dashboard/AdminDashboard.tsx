"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

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

    if (loading) return <div>Loading System Health...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                    System Administration
                </h1>
                <p className="text-slate-400 mt-2">Global platform metrics and ecosystem health.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <AdminStatCard title="Global Users" value={stats?.totalUsers || 0} icon="👥" color="blue" />
                <AdminStatCard title="Active Vendors" value={stats?.totalVendors || 0} icon="🏪" color="indigo" />
                <AdminStatCard title="Platform Bookings" value={stats?.totalBookings || 0} icon="📈" color="emerald" />
                <AdminStatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon="💎" color="rose" />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h2 className="text-xl font-bold text-white mb-2">Management Console</h2>
                <p className="text-slate-500 italic max-w-md mx-auto">
                    Global management features for users, vendors, and marketplace moderation are being initialized.
                </p>
            </div>
        </div>
    );
}

function AdminStatCard({ title, value, icon, color }: any) {
    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl border-t-2" style={{ borderTopColor: color }}>
            <div className="flex justify-between items-center mb-4">
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Global</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    );
}
