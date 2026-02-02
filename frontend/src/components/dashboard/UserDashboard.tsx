"use client";

import { Booking, DashboardStats } from "@/types";
import { useRouter } from "next/navigation";

interface UserDashboardProps {
    stats: DashboardStats | null;
    bookings: Booking[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onOpenChat: (roomId: number) => void;
}

export default function UserDashboard({ stats, bookings, page, totalPages, onPageChange, onOpenChat }: UserDashboardProps) {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white rounded-3xl border border-brand-warm shadow-xl shadow-brand-warm/20">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Your Wedding Planning Hub
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Track your bookings and discover new vendors for your big day.</p>
                </div>
                <button
                    onClick={() => router.push("/vendors")}
                    className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 active:scale-95"
                >
                    Browse Vendors
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon="📅" color="brand" />
                <StatCard title="Confirmed" value={stats?.confirmedBookings || 0} icon="✅" color="emerald" />
                <StatCard title="Upcoming" value={stats?.confirmedBookings || 0} icon="🚀" color="rose" />
            </div>

            <BookingTable bookings={bookings} onOpenChat={onOpenChat} role="USER" />

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12">
                    <button
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                        className="px-6 py-3 bg-white border-2 border-brand-warm text-gray-700 font-bold rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all active:scale-90"
                    >
                        Previous
                    </button>
                    <span className="text-gray-900 font-extrabold px-4 py-2 bg-brand-warm/30 rounded-xl">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => onPageChange(page + 1)}
                        className="px-6 py-3 bg-white border-2 border-brand-warm text-gray-700 font-bold rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all active:scale-90"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

// Reusable components (Internal to this file or moved later)
function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        brand: "border-brand-primary/20 text-brand-primary bg-white shadow-brand-primary/5 hover:border-brand-primary/50",
        emerald: "border-emerald-500/20 text-emerald-600 bg-white shadow-emerald-500/5 hover:border-emerald-500/50",
        rose: "border-rose-500/20 text-rose-600 bg-white shadow-rose-500/5 hover:border-rose-500/50",
    };

    return (
        <div className={`p-8 border-2 ${colors[color]} rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-default group`}>
            <div className="flex justify-between items-start mb-6">
                <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{icon}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-black uppercase tracking-widest mb-2">{title}</h3>
            <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
        </div>
    );
}

function BookingTable({ bookings, onOpenChat, role }: { bookings: Booking[], onOpenChat: (id: number) => void, role: string }) {
    return (
        <div className="bg-white border boundary border-brand-warm rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-warm/10">
            <div className="p-8 border-b border-brand-warm bg-gray-50/50">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                            <th className="px-8 py-6">Service</th>
                            <th className="px-8 py-6">{role === "VENDOR" ? "Customer" : "Vendor"}</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-warm/30">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-brand-light/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-bold text-gray-900 text-lg group-hover:text-brand-primary transition-colors">{booking.serviceTitle}</div>
                                    <div className="text-xs text-gray-400 font-bold">INV-{booking.id}</div>
                                </td>
                                <td className="px-8 py-6 text-gray-700 font-medium">
                                    {role === "VENDOR" ? booking.userName : booking.vendorName}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-4 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase border-2 shadow-sm bg-white border-brand-primary/20 text-brand-primary">
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    {booking.chatRoomId && (
                                        <button
                                            onClick={() => onOpenChat(booking.chatRoomId!)}
                                            className="bg-brand-warm/20 text-brand-primary hover:bg-brand-primary hover:text-white px-5 py-2 rounded-xl font-bold transition-all duration-300"
                                        >
                                            Message
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
