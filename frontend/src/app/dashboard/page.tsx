"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Booking, DashboardStats } from "@/types";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    api.get("/bookings/stats"),
                    api.get(user?.role === "VENDOR" ? "/bookings/vendor" : "/bookings/my"),
                ]);
                setStats(statsRes.data);
                setBookings(bookingsRes.data);
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            } finally {
                setDataLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user, isLoading, router]);

    if (isLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const isVendor = user?.role === "VENDOR";

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Welcome back, {user?.name?.split(" ")[0] || "User"}!
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {isVendor
                                ? "Manage your services and track your business performance."
                                : "Plan your perfect wedding and track your bookings."}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {isVendor ? (
                            <button
                                onClick={() => router.push("/vendors/my-services")}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
                            >
                                Manage Services
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push("/vendors")}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
                            >
                                Browse Vendors
                            </button>
                        )}
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon="📅" color="indigo" />
                    <StatCard title="Pending" value={stats?.pendingBookings || 0} icon="⏳" color="amber" />
                    <StatCard title="Confirmed" value={stats?.confirmedBookings || 0} icon="✅" color="emerald" />
                    {isVendor ? (
                        <StatCard title="Revenue" value={`$${stats?.totalRevenue || 0}`} icon="💰" color="violet" />
                    ) : (
                        <StatCard title="Upcoming" value={stats?.confirmedBookings || 0} icon="🚀" color="rose" />
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Bookings</h2>
                        <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Service</th>
                                    <th className="px-6 py-4 font-semibold">{isVendor ? "Customer" : "Vendor"}</th>
                                    <th className="px-6 py-4 font-semibold">Date & Time</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-800/30 transition group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200">Wedding Photography</div>
                                            <div className="text-xs text-slate-500">#{booking.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {isVendor ? "John Doe" : "Vivid Moments"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-300">
                                                {new Date(booking.startTime).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.status} />
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        indigo: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5 shadow-indigo-500/10",
        amber: "border-amber-500/20 text-amber-400 bg-amber-500/5 shadow-amber-500/10",
        emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5 shadow-emerald-500/10",
        violet: "border-violet-500/20 text-violet-400 bg-violet-500/5 shadow-violet-500/10",
        rose: "border-rose-500/20 text-rose-400 bg-rose-500/5 shadow-rose-500/10",
    };

    return (
        <div className={`p-6 bg-slate-900 border ${colors[color]} rounded-2xl transition hover:scale-[1.02] cursor-default shadow-xl`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{icon}</span>
                <div className={`h-2 w-2 rounded-full bg-${color}-500 shadow-[0_0_8px] shadow-${color}-500`}></div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        CANCELLED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        COMPLETED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
            {status}
        </span>
    );
}
