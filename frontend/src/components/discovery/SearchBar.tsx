"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface SearchResult {
    id: number;
    name: string;
    type: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await api.get(`/discovery/search?q=${query}`);
                setSuggestions(response.data);
                setIsOpen(true);
            } catch (err) {
                console.error("Search failed", err);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto mb-12">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-xl">🔍</span>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search for photographers, venues, or caterers..."
                    className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-xl"
                />
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                    {suggestions.map((res, idx) => (
                        <Link
                            key={`${res.id}-${idx}`}
                            href={`/vendors/${res.id}`}
                            className="block px-6 py-4 hover:bg-slate-800 transition flex items-center justify-between group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div>
                                <p className="text-white font-medium group-hover:text-indigo-400 transition">{res.name}</p>
                                <p className="text-slate-500 text-xs uppercase tracking-wider mt-0.5">{res.type}</p>
                            </div>
                            <span className="text-slate-600 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
