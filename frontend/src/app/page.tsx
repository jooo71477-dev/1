"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [lang, setLang] = useState("ar");

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-white font-sans pb-24" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* ── SKETCH HEADER ── */}
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-[#050505]">
        {/* Header Top */}
        <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-full px-4 py-1.5 w-[140px] sm:w-[200px]">
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'بحث عن منتجات...' : 'Search...'} 
              className="bg-transparent border-none outline-none text-[11px] sm:text-[13px] w-full"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold">
            <Link href="/store?tag=sale" className="text-red-600 hover:text-red-500 underline underline-offset-4">تخفيضات</Link>
            <Link href="/store?sort=newest" className="text-white/40 hover:text-white underline underline-offset-4 decoration-transparent hover:decoration-white">وصل حديثاً</Link>
            <Link href="/store?cat=women" className="text-white/40 hover:text-white underline underline-offset-4 decoration-transparent hover:decoration-white">نساء</Link>
            <Link href="/store?cat=men" className="text-white/40 hover:text-white underline underline-offset-4 decoration-transparent hover:decoration-white">رجال</Link>
            <Link href="/store?cat=kids" className="text-white/40 hover:text-white underline underline-offset-4 decoration-transparent hover:decoration-white">أطفال</Link>
          </nav>

          <div className="flex gap-4 text-[11px] font-bold text-white/40">
            <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-white' : ''}>English</button>
            <span>|</span>
            <button onClick={() => setLang('ar')} className={lang === 'ar' ? 'text-white' : ''}>العربية</button>
          </div>
        </div>

        {/* Header Main */}
        <div className="flex items-center justify-between px-6 py-4 relative">
          <div className="flex gap-6">
            <a href="#" className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-[10px] uppercase font-medium">{lang === 'ar' ? 'مفضلة' : 'Wishlist'}</span>
            </a>
            <a href="#" className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-[10px] uppercase font-medium">{lang === 'ar' ? 'سلة' : 'Cart'}</span>
            </a>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img src="/logo/logo2..png" alt="ICLOTH" className="h-10 w-auto" />
          </Link>

          <div className="w-[100px] md:hidden"></div>
        </div>
      </header>

      {/* ── SKETCH HERO ── */}
      <main className="flex-1 flex flex-col items-center px-6 py-12 text-center">
        <div className="w-full max-w-[600px] border-2 border-white/5 py-16 px-10 rounded-sm relative bg-gradient-to-br from-red-600/5 to-transparent">
          <span className="block text-[13px] tracking-[0.4em] text-white/40 uppercase mb-6">
            {lang === 'ar' ? 'إعلان مثال' : 'Example Ad'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            {lang === 'ar' ? 'إشترى قطعتين واحصل على هدية' : 'Buy 2 Get 1 Free'}
          </h1>
          <div className="mt-8">
            <svg width="100" height="20" viewBox="0 0 100 20" className="mx-auto">
              <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="#c2213a" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Ad Box inner border effect */}
          <div className="absolute inset-[-10px] border border-white/[0.03] pointer-events-none" />
        </div>

        <div className="mt-12 text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent italic">
          {lang === 'ar' ? 'أقوى خصومات' : 'BIGGEST OFFERS'}
        </div>
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d]/95 backdrop-blur-xl border-t border-white/5 flex justify-around py-3 pb-8 z-[1100]">
        <Link href="/" className="flex flex-col items-center gap-1.5 text-red-600 flex-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-bold">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </Link>
        <Link href="/store" className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors flex-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-[10px] font-bold">{lang === 'ar' ? 'الأقسام' : 'Categories'}</span>
        </Link>
        <Link href="/store?tag=offers" className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors flex-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z" />
          </svg>
          <span className="text-[10px] font-bold">{lang === 'ar' ? 'العروض' : 'Offers'}</span>
        </Link>
        <button className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors flex-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="text-[10px] font-bold">{lang === 'ar' ? 'السلة' : 'Cart'}</span>
        </button>
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors flex-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'EN' : 'AR'}</span>
        </button>
      </nav>
    </div>
  );
}
