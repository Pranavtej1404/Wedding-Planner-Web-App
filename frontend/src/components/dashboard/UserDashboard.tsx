"use client";

import { Booking, DashboardStats } from "@/types";
import { useRouter } from "next/navigation";

interface UserDashboardProps {
    stats: DashboardStats | null;
    bookings: Booking[];
    onOpenChat: (roomId: number) => void;
}

export default function UserDashboard({ stats, bookings, onOpenChat }: UserDashboardProps) {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Your Wedding Planning Hub
                    </h1>
                    <p className="text-slate-400 mt-2">Track your bookings and discover new vendors for your big day.</p>
                </div>
                <button
                    onClick={() => router.push("/vendors")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-600/20"
                >
                    Browse Vendors
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon="📅" color="indigo" />
                <StatCard title="Confirmed" value={stats?.confirmedBookings || 0} icon="✅" color="emerald" />
                <StatCard title="Upcoming" value={stats?.confirmedBookings || 0} icon="🚀" color="rose" />
            </div>

            <BookingTable bookings={bookings} onOpenChat={onOpenChat} role="USER" />
        </div>
    );
}

// Reusable components (Internal to this file or moved later)
function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        indigo: "border-indigo-500/20 text-indigo-400 bg-indigo-500/5 shadow-indigo-500/10",
        emerald: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5 shadow-emerald-500/10",
        rose: "border-rose-500/20 text-rose-400 bg-rose-500/5 shadow-rose-500/10",
    };

    return (
        <div className={`p-6 bg-slate-900 border ${colors[color]} rounded-2xl shadow-xl transition hover:scale-[1.02]`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">{icon}</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
    );
}

function BookingTable({ bookings, onOpenChat, role }: { bookings: Booking[], onOpenChat: (id: number) => void, role: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">{role === "VENDOR" ? "Customer" : "Vendor"}</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-800/30 transition">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-200">{booking.serviceTitle}</div>
                                    <div className="text-xs text-slate-500">#{booking.id}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">
                                    {role === "VENDOR" ? booking.userName : booking.vendorName}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-[10px] font-bold border border-indigo-500/30 text-indigo-400">
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {booking.chatRoomId && (
                                        <button onClick={() => onOpenChat(booking.chatRoomId!)} className="text-indigo-400 hover:text-white transition">
                                            Chat
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
