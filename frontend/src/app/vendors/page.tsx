"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Vendor } from "@/types";
import Link from "next/link";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await api.get("/vendors");
                setVendors(response.data);
            } catch (err) {
                console.error("Failed to fetch vendors", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Discover Premium Vendors
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vendors.map((vendor) => (
                        <div key={vendor.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group">
                            <div className="h-48 bg-slate-800 flex items-center justify-center">
                                <span className="text-slate-700 font-bold text-4xl">{vendor.businessName[0]}</span>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-xl font-bold text-white">{vendor.businessName}</h2>
                                    {vendor.isVerified && (
                                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/30">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm mb-4">{vendor.category} • {vendor.location}</p>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-indigo-400 font-medium">{vendor.priceRange}</span>
                                    <Link
                                        href={`/vendors/${vendor.id}`}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        View Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {vendors.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                        <p className="text-slate-500 italic">No vendors found. Be the first to join!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
