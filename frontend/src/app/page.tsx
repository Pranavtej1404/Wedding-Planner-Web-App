"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            ETERNAL VOWS
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <Link href="/vendors" className="hover:text-white transition">Find Vendors</Link>
            <Link href="#" className="hover:text-white transition">How it Works</Link>
            <Link href="#" className="hover:text-white transition">Premium</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">Sign In</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/5 blur-[100px] rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase">
            #1 Wedding Planning Platform
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Plan Your Forever, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
              Without the Stress.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            Connect with top-tier vendors, manage your budget, and track every detail of your special day in one beautiful, integrated workspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition text-lg shadow-xl">
              Start Planning Now
            </Link>
            <Link href="/vendors" className="px-8 py-4 bg-slate-900 border border-slate-800 font-bold rounded-2xl hover:bg-slate-800 transition text-lg">
              Browse All Vendors
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-slate-900/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon="💍"
              title="Vendor Marketplace"
              desc="Book the best photographers, venues, and caterers with one click. Real-time availability checks included."
            />
            <FeatureCard
              icon="📊"
              title="Smart Dashboard"
              desc="A unified interface for both couples and vendors to track progress, payments, and deadlines."
            />
            <FeatureCard
              icon="✉️"
              title="Real-time Chat"
              desc="Message vendors directly without leaving the platform. Seamless collaboration for every detail."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-black opacity-50">ETERNAL VOWS</div>
          <div className="text-slate-500 text-sm">
            © 2026 Eternal Vows Platform. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white transition">Twitter</a>
            <a href="#" className="text-slate-500 hover:text-white transition">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-2xl">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 leading-relaxed italic">{desc}</p>
    </div>
  );
}
