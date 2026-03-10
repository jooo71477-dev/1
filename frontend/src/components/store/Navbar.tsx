"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, ShoppingCart, Sun, Moon, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/app/store/cart-context";

type NavbarProps = {
  onCartClick: () => void;
};

export function Navbar({ onCartClick }: NavbarProps) {
  const { totalQuantity } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("icloth-theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      window.localStorage.setItem("icloth-theme", next);
      return next;
    });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-30 border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/70 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              iCloth
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              أزياء عصرية لكل يوم
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:flex">
          <Link href="/store" className="hover:text-emerald-600">
            الرئيسية
          </Link>
          <Link href="/store#men" className="hover:text-emerald-600">
            رجالي
          </Link>
          <Link href="/store#women" className="hover:text-emerald-600">
            حريمي
          </Link>
          <Link href="/store#kids" className="hover:text-emerald-600">
            أطفال
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="تبديل الثيم"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-400"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onCartClick}
            className="relative flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">السلة</span>
            {totalQuantity > 0 && (
              <span className="absolute -left-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-emerald-700 shadow-sm dark:bg-zinc-900 dark:text-emerald-300">
                {totalQuantity}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 sm:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 sm:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/store" className="hover:text-emerald-600">
              الرئيسية
            </Link>
            <Link href="/store#men" className="hover:text-emerald-600">
              رجالي
            </Link>
            <Link href="/store#women" className="hover:text-emerald-600">
              حريمي
            </Link>
            <Link href="/store#kids" className="hover:text-emerald-600">
              أطفال
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}

