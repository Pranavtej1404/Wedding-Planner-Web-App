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
        <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto mb-12 animate-in slide-in-from-top-4 duration-1000">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-xl group-focus-within:rotate-12 transition-transform">🔍</span>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="Search for photographers, venues, or caterers..."
                    className="block w-full pl-14 pr-6 py-5 bg-white border-2 border-brand-warm rounded-[2rem] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-xl shadow-brand-warm/10"
                />
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-4 bg-white border-2 border-brand-warm rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                    {suggestions.map((res, idx) => (
                        <Link
                            key={`${res.id}-${idx}`}
                            href={`/vendors/${res.id}`}
                            className="block px-8 py-5 hover:bg-brand-light transition flex items-center justify-between group"
                            onClick={() => setIsOpen(false)}
                        >
                            <div>
                                <p className="text-gray-900 font-bold group-hover:text-brand-primary transition-colors text-lg">{res.name}</p>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{res.type}</p>
                            </div>
                            <span className="text-brand-warm group-hover:text-brand-primary group-hover:translate-x-2 transition-all font-black text-xl">→</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
