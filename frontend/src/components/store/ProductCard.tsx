"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { useCart } from "@/app/store/cart-context";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const hasDiscount =
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Link href={`/store/${product.id}`} className="relative block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-3.5 py-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {product.price.toLocaleString("ar-EG")} جم
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-zinc-400 line-through">
                {product.oldPrice?.toLocaleString("ar-EG")} جم
              </span>
            )}
          </div>
          {hasDiscount && product.oldPrice && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              -
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              %
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>إضافة للسلة</span>
        </button>
      </div>
    </motion.article>
  );
}

