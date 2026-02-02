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
    <div className="min-h-screen bg-brand-light text-gray-900 font-sans selection:bg-brand-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-brand-warm/30 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-500">
        <div className="text-3xl font-black tracking-tighter text-gray-900 flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-2xl rotate-12 flex items-center justify-center text-white text-xl">✨</div>
          ETERNAL VOWS
        </div>
        <div className="hidden lg:flex gap-10 text-sm font-black uppercase tracking-widest text-gray-500">
          <Link href="/vendors" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">Find Vendors</Link>
          <Link href="#" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">How it Works</Link>
          <Link href="#" className="hover:text-brand-primary hover:-translate-y-0.5 transition-all">Stories</Link>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-black text-gray-600 hover:text-brand-primary transition-colors">Sign In</Link>
          <Link href="/register" className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-3.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 active:scale-95">
            Join the Club
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 md:pt-64 md:pb-48 overflow-hidden bg-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-light rounded-full -mr-96 -mt-96 opacity-40 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-warm rounded-full -ml-72 -mb-72 opacity-30 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 mb-10 rounded-full border-2 border-brand-warm bg-white text-brand-primary text-[10px] font-black tracking-[0.3em] uppercase shadow-lg shadow-brand-warm/20 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            #1 Rated Wedding Platform
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tight mb-12 leading-[0.9] text-gray-950">
            Design Your <br />
            <span className="text-brand-primary italic font-serif">Perfect Day.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-500 mb-16 leading-relaxed font-medium">
            Connect with curated artisans, manage every detail of your timeline, and focus on the love while we handle the logistics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link href="/register" className="px-12 py-5 bg-brand-primary text-white font-black rounded-3xl hover:bg-brand-accent transition-all text-xl shadow-2xl shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:-translate-y-1">
              Start Your Journey
            </Link>
            <Link href="/vendors" className="px-12 py-5 bg-white border-2 border-brand-warm text-gray-900 font-black rounded-3xl hover:bg-brand-light transition-all text-xl shadow-xl shadow-brand-warm/20 hover:-translate-y-1">
              Find Your Vendors
            </Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-32 bg-brand-light relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon="💖"
              title="Curated Marketplace"
              desc="Hand-picked photographers, florists, and venues that match your unique vision and budget."
            />
            <FeatureCard
              icon="📈"
              title="Real-Time Insights"
              desc="Smart analytics for vendors and deep planning tools for couples. Every metric at your fingertips."
            />
            <FeatureCard
              icon="🕊️"
              title="Seamless Flow"
              desc="Real-time messaging and conflict-free booking scheduling to keep your planning stress-free."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-brand-warm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="text-3xl font-black mb-4">ETERNAL VOWS</div>
            <p className="text-gray-400 font-medium max-w-sm">Elevating the way the world celebrates love, one wedding at a time.</p>
          </div>
          <div className="text-gray-400 text-sm font-bold tracking-widest uppercase">
            © 2026 ETERNAL VOWS. CRAFTED WITH LOVE.
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-gray-400 hover:text-brand-primary transition-all font-black uppercase text-xs tracking-widest">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-brand-primary transition-all font-black uppercase text-xs tracking-widest">Pinterest</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="group p-12 rounded-[2.5rem] bg-white border-2 border-brand-warm hover:border-brand-primary transition-all duration-500 shadow-xl shadow-brand-warm/10 hover:shadow-2xl hover:shadow-brand-primary/10 hover:-translate-y-4 cursor-pointer">
      <div className="text-6xl mb-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 origin-center inline-block">{icon}</div>
      <h3 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium">“{desc}”</p>
    </div>
  );
}
