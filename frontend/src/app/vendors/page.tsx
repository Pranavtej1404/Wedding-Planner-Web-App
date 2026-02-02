"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Vendor } from "@/types";
import Link from "next/link";
import SearchBar from "@/components/discovery/SearchBar";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/vendors?page=${page}&size=6`);
                setVendors(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("Failed to fetch vendors", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, [page]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-brand-warm rounded-full animate-ping opacity-25"></div>
                    <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light p-8 md:p-12 animate-in fade-in duration-1000">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Discover Your <span className="text-brand-primary italic font-serif">Dream Team</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">Curated artisans for your unconventional wedding.</p>
                </header>

                <div className="mb-16">
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {vendors.map((vendor) => (
                        <div key={vendor.id} className="bg-white border-2 border-brand-warm rounded-[2.5rem] overflow-hidden hover:border-brand-primary transition-all duration-500 shadow-xl shadow-brand-warm/10 group hover:-translate-y-4">
                            <div className="h-56 bg-brand-light/50 flex items-center justify-center relative overflow-hidden">
                                <span className="text-brand-warm font-black text-9xl absolute -bottom-8 -left-8 opacity-20 group-hover:scale-150 transition-transform duration-700">{vendor.businessName[0]}</span>
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand-warm z-10 group-hover:rotate-12 transition-transform">
                                    <span className="text-brand-primary font-black text-4xl">{vendor.businessName[0]}</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-brand-primary transition-colors">{vendor.businessName}</h2>
                                    {vendor.isVerified && (
                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">{vendor.category} • {vendor.location}</p>
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-brand-warm/30">
                                    <span className="text-brand-primary font-black tracking-tighter text-lg">{vendor.priceRange}</span>
                                    <Link
                                        href={`/vendors/${vendor.id}`}
                                        className="bg-brand-primary hover:bg-brand-accent text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 active:scale-95"
                                    >
                                        Explore Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-20">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                            className="p-4 bg-white border-2 border-brand-warm text-gray-700 rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all shadow-md active:scale-90"
                        >
                            ←
                        </button>
                        <span className="text-gray-900 font-black px-6 py-2 bg-brand-warm/20 rounded-xl">
                            {page + 1} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                            className="p-4 bg-white border-2 border-brand-warm text-gray-700 rounded-2xl disabled:opacity-30 hover:bg-brand-light transition-all shadow-md active:scale-90"
                        >
                            →
                        </button>
                    </div>
                )}

                {vendors.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-brand-warm">
                        <div className="text-6xl mb-6">🏜️</div>
                        <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Nothing found in this oasis. Try another quest.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
