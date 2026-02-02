"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface TrendData {
    last30Days: number[];
    monthly: number[];
}

export default function AnalyticsDashboard() {
    const [trends, setTrends] = useState<TrendData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const response = await api.get("/analytics/trends");
                setTrends(response.data);
            } catch (err) {
                console.error("Failed to fetch trends", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    if (loading) return <div className="animate-pulse text-indigo-400">Calculating historical projections...</div>;

    const maxMonthly = Math.max(...(trends?.monthly || [1000]), 1);
    const maxDaily = Math.max(...(trends?.last30Days || [100]), 1);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Monthly Revenue Chart */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Annual Revenue Flow</h2>
                        <p className="text-slate-500 text-sm mt-1">Historical monthly breakdown of confirmed bookings.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-indigo-400">${trends?.monthly.reduce((a, b) => a + b, 0).toFixed(0)}</span>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Total YTD</p>
                    </div>
                </div>

                <div className="flex items-end justify-between h-48 gap-2">
                    {trends?.monthly.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div
                                className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-500 hover:brightness-125 relative group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                style={{ height: `${(val / maxMonthly) * 100}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${val.toFixed(0)}
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-600 mt-3 font-bold uppercase truncate w-full text-center">
                                {new Date(2026, i, 1).toLocaleString('default', { month: 'short' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Trends (Sparkline style) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last 30 Days Velocity
                    </h3>
                    <div className="flex items-end h-24 gap-1">
                        {trends?.last30Days.map((val, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/50 transition-colors rounded-sm"
                                style={{ height: `${Math.max((val / maxDaily) * 100, 5)}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-center">
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Algorithm Performance</div>
                    <h4 className="text-2xl font-bold text-white mb-4">O(1) Range Queries Active</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        Using Prefix Sums for historical static windows and Fenwick Trees for O(log N) dynamic updates.
                        Sub-millisecond data aggregation enabled across all platform dimensions.
                    </p>
                </div>
            </div>
        </div>
    );
}
