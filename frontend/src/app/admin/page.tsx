"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminComingSoon() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] bg-white/[0.04] border border-white/10 rounded-[24px] p-12 text-center backdrop-blur-md relative overflow-hidden group">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c2213a]/20 rounded-full blur-[80px] group-hover:bg-[#c2213a]/30 transition-all duration-700"></div>
        
        {/* Rotating Icon */}
        <div className="mb-8 inline-block animate-[spin_4s_linear_infinite]">
          <svg className="w-20 h-20 text-[#c2213a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-3xl font-black mb-4 tracking-tight">Dashboard Section</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-10">
          This entire administrative module is currently under development. <br/> 
          Experience a new level of control, coming soon.
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
          <div className="w-[35%] h-full bg-[#c2213a] shadow-[0_0_15px_#c2213a] rounded-full"></div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-1.5 bg-[#c2213a]/10 border border-[#c2213a]/30 rounded-full text-[#c2213a] text-[10px] font-black tracking-widest uppercase">
          GAMING SOON
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
            <Link href="/" className="text-white/20 hover:text-white text-xs transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}
