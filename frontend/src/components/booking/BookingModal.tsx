"use client";

import { useState } from "react";
import api from "@/lib/api";
import { ServiceType } from "@/types";

interface Props {
    service: ServiceType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function BookingModal({ service, isOpen, onClose, onSuccess }: Props) {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/bookings", {
                serviceId: service.id,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data || "Booking failed. Slot might be taken.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-2">Book Service</h2>
                <p className="text-slate-400 mb-6">{service.title}</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Start Time</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">End Time</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
