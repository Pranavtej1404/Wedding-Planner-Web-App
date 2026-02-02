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
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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
                const statsPromise = api.get("/bookings/stats");
                const bookingsPromise = api.get(
                    `${user?.role === "VENDOR" ? "/bookings/vendor" : "/bookings/my"}?page=${page}&size=5`
                );

                const [statsRes, bookingsRes] = await Promise.all([statsPromise, bookingsPromise]);

                setStats(statsRes.data);
                setBookings(bookingsRes.data.content);
                setTotalPages(bookingsRes.data.totalPages);
            } catch (err) {
                console.error("Dashboard data fetch failed", err);
            } finally {
                setDataLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user, isLoading, router, page]);

    if (isLoading || dataLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-brand-warm rounded-full animate-ping opacity-25"></div>
                    <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    const renderDashboard = () => {
        switch (user?.role) {
            case "ADMIN":
                return <AdminDashboard />;
            case "VENDOR":
                return <VendorDashboard
                    stats={stats}
                    bookings={bookings}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onOpenChat={setActiveChatRoom}
                />;
            case "USER":
            default:
                return <UserDashboard
                    stats={stats}
                    bookings={bookings}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onOpenChat={setActiveChatRoom}
                />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-light text-gray-900 p-6 md:p-10 transition-colors duration-500 animate-in fade-in">
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
