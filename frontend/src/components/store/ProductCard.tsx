"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  // Extract a specific brand or use a default one like "Diesel Men"
  const brand = "Diesel Men";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col overflow-hidden rounded-[30px] bg-[#f8f8f8] dark:bg-zinc-900 border border-transparent shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/store/${product.id}`} className="relative block overflow-hidden aspect-[4/5] bg-zinc-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 ease-in-out group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-[#ef0000] px-4 py-1.5 text-xs font-bold text-white shadow-lg uppercase tracking-wider z-10">
            NEW
          </span>
        )}
      </Link>

      <div className="flex flex-col items-end p-5 w-full">
        <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-1">
          {brand}
        </span>
        <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mb-4 tracking-tighter">
          {product.name}
        </h3>

        <div className="flex items-center justify-end gap-1.5 font-black" dir="ltr">
          <span className="text-[#d8a32a] text-xl font-bold">جنيه</span>
          <span className="text-[#d8a32a] text-4xl">{product.price.toLocaleString("ar-EG")}</span>
        </div>
      </div>
    </motion.article>
  );
}

