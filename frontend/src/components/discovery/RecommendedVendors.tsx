"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Vendor } from "@/types";
import Link from "next/link";

interface RecommendedVendorsProps {
    vendorId: number;
}

export default function RecommendedVendors({ vendorId }: RecommendedVendorsProps) {
    const [recommendations, setRecommendations] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get(`/discovery/recommendations/${vendorId}?k=3`);
                setRecommendations(response.data);
            } catch (err) {
                console.error("Failed to fetch recommendations", err);
            } finally {
                setLoading(false);
            }
        };

        if (vendorId) {
            fetchRecommendations();
        }
    }, [vendorId]);

    if (loading || recommendations.length === 0) return null;

    return (
        <div className="mt-16 bg-slate-900/40 rounded-3xl p-8 border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.map((vendor) => (
                    <Link
                        key={vendor.id}
                        href={`/vendors/${vendor.id}`}
                        className="group bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 transition-all"
                    >
                        <div className="h-32 bg-slate-900 rounded-xl mb-4 flex items-center justify-center text-3xl font-bold text-slate-800">
                            {vendor.businessName[0]}
                        </div>
                        <h4 className="text-white font-bold group-hover:text-indigo-400 transition">{vendor.businessName}</h4>
                        <p className="text-slate-500 text-sm mt-1">{vendor.category} • {vendor.location}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
