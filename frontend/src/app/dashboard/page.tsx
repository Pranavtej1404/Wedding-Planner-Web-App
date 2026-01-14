"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Booking, DashboardStats } from "@/types";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import UserDashboard from "@/components/dashboard/UserDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [activeChatRoom, setActiveChatRoom] = useState<number | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        const fetchDashboardData = async () => {
            if (user?.role === "ADMIN") {
                setDataLoading(false);
                return;
            }

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

    const renderDashboard = () => {
        switch (user?.role) {
            case "ADMIN":
                return <AdminDashboard />;
            case "VENDOR":
                return <VendorDashboard stats={stats} bookings={bookings} onOpenChat={setActiveChatRoom} />;
            case "USER":
            default:
                return <UserDashboard stats={stats} bookings={bookings} onOpenChat={setActiveChatRoom} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
            {renderDashboard()}

            {activeChatRoom && (
                <ChatWindow
                    roomId={activeChatRoom}
                    onClose={() => setActiveChatRoom(null)}
                />
            )}
        </div>
    );
}
