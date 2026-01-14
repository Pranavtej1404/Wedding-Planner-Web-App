"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Vendor, ServiceType } from "@/types";
import BookingModal from "@/components/booking/BookingModal";
import Link from "next/link";
import RecommendedVendors from "@/components/discovery/RecommendedVendors";

export default function VendorDetailPage() {
    const { id } = useParams();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vRes, sRes] = await Promise.all([
                    api.get(`/vendors/${id}`),
                    api.get(`/vendors/${id}/services`),
                ]);
                setVendor(vRes.data);
                setServices(sRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error || !vendor) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Vendor not found</h1>
                <Link href="/vendors" className="text-indigo-400 hover:underline">Return to browse vendors</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-12 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/20">
                            {vendor.businessName[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-white">{vendor.businessName}</h1>
                                {vendor.isVerified && (
                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/30">
                                        Premium Partner
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400 text-lg">{vendor.category} • {vendor.location}</p>
                        </div>
                    </div>
                </div>

                {/* Services List */}
                <h2 className="text-2xl font-bold text-white mb-6 px-2">Offered Services</h2>
                <div className="space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition flex justify-between items-center group">
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-1">{service.title}</h3>
                                <p className="text-slate-500 text-sm max-w-lg">{service.description}</p>
                                <p className="text-indigo-400 mt-2 font-medium">{service.durationMinutes} mins</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white mb-4">${service.price}</div>
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="bg-white text-slate-900 font-bold px-6 py-2 rounded-xl hover:bg-indigo-50 transition shadow-lg active:scale-95"
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                        <p className="text-slate-500">This vendor hasn't listed any services yet.</p>
                    </div>
                )}

                {selectedService && (
                    <BookingModal
                        service={selectedService}
                        isOpen={!!selectedService}
                        onClose={() => setSelectedService(null)}
                        onSuccess={() => alert("Booking request sent successfully!")}
                    />
                )}

                <RecommendedVendors vendorId={Number(id)} />
            </div>
        </div>
    );
}
