"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Navbar } from "@/components/store/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Chatbot } from "@/components/store/Chatbot";
import { CartProvider } from "./cart-context";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-50">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-zinc-200 bg-white/80 px-4 py-4 text-xs text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} iCloth. جميع الحقوق محفوظة.</p>
            <p className="hidden sm:block">
              متجر ملابس أونلاين لرجال ونساء وأطفال.
            </p>
          </div>
        </footer>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <Chatbot />
      </div>
    </CartProvider>
  );
}

