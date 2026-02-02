"use client";

import { Booking, DashboardStats } from "@/types";
import { useRouter } from "next/navigation";

interface VendorDashboardProps {
    stats: DashboardStats | null;
    bookings: Booking[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onOpenChat: (roomId: number) => void;
}

export default function VendorDashboard({ stats, bookings, page, totalPages, onPageChange, onOpenChat }: VendorDashboardProps) {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-top-4 duration-1000">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-10 bg-white rounded-[2.5rem] border border-brand-warm shadow-2xl shadow-brand-warm/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
                <div className="relative">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Vendor Command Center
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Monitor your inquiries, revenue, and scale your business.</p>
                </div>
                <button
                    onClick={() => router.push("/vendors/my-services")}
                    className="relative bg-brand-primary hover:bg-brand-accent text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 active:scale-95 group overflow-hidden"
                >
                    <span className="relative z-10">Manage Services</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Requests" value={stats?.totalBookings || 0} icon="📊" color="brand" />
                <StatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon="💰" color="violet" />
                <StatCard title="Pending" value={stats?.pendingBookings || 0} icon="⏳" color="amber" />
                <StatCard title="Confirmed" value={stats?.confirmedBookings || 0} icon="✅" color="emerald" />
            </div>

            <BookingTable bookings={bookings} onOpenChat={onOpenChat} role="VENDOR" />

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 bg-white/50 p-4 rounded-3xl border border-brand-warm backdrop-blur-sm self-center">
                    <button
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                        className="p-3 bg-white border-2 border-brand-warm text-gray-700 rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all shadow-sm"
                    >
                        ←
                    </button>
                    <span className="text-gray-900 font-extrabold px-6">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => onPageChange(page + 1)}
                        className="p-3 bg-white border-2 border-brand-warm text-gray-700 rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all shadow-sm"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}

// Reusable components (Internal to this file)
function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        brand: "border-brand-primary/20 text-brand-primary bg-white hover:border-brand-primary",
        violet: "border-violet-500/20 text-violet-600 bg-white hover:border-violet-500",
        amber: "border-amber-500/20 text-amber-600 bg-white hover:border-amber-500",
        emerald: "border-emerald-500/20 text-emerald-600 bg-white hover:border-emerald-500",
    };

    return (
        <div className={`p-8 border-2 ${colors[color]} rounded-[2rem] shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer group`}>
            <div className="flex justify-between items-start mb-6">
                <div className="text-4xl bg-gray-50 p-4 rounded-2xl group-hover:rotate-12 transition-transform duration-300">{icon}</div>
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        </div>
    );
}

function BookingTable({ bookings, onOpenChat, role }: { bookings: Booking[], onOpenChat: (id: number) => void, role: string }) {
    return (
        <div className="bg-white border boundary border-brand-warm rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-warm/10">
            <div className="p-10 border-b border-brand-warm flex justify-between items-center bg-gray-50/30">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Customer Requests</h2>
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-primary animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-brand-warm"></div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <th className="px-10 py-8">Service</th>
                            <th className="px-10 py-8">Customer</th>
                            <th className="px-10 py-8">Status</th>
                            <th className="px-10 py-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-warm/20">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-brand-light/40 transition-all duration-300">
                                <td className="px-10 py-8">
                                    <div className="font-bold text-gray-900 text-lg">{booking.serviceTitle}</div>
                                    <div className="text-[10px] items-center flex gap-1 font-bold text-gray-400 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-warm"></span>
                                        ID-{booking.id}
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-gray-700 font-bold">
                                    {booking.userName}
                                </td>
                                <td className="px-10 py-8">
                                    <span className="px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 bg-white border-brand-warm text-brand-primary shadow-sm">
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    {booking.chatRoomId && (
                                        <button
                                            onClick={() => onOpenChat(booking.chatRoomId!)}
                                            className="bg-brand-primary text-white hover:bg-brand-accent px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 active:scale-90"
                                        >
                                            Chat with Couple
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
