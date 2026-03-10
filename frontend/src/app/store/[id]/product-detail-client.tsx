"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingCart } from "lucide-react";
import type { Product, ProductColor, ProductSize } from "@/types/product";
import { useCart } from "@/app/store/cart-context";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] ?? product.image
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product.sizes[0] ?? null
  );
  const [added, setAdded] = useState(false);

  const hasDiscount =
    typeof product.oldPrice === "number" &&
    product.oldPrice > product.price;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt={product.name}
            className="h-[380px] w-full object-cover sm:h-[460px]"
          />
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition ${
                  selectedImage === img
                    ? "border-emerald-500"
                    : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-5"
      >
        <div className="space-y-2">
          {product.badge && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {product.badge}
            </span>
          )}
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:text-xl">
            {product.name}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
        </div>

        <div className="space-y-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              السعر بعد الخصم
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {product.price.toLocaleString("ar-EG")} جم
            </span>
          </div>
          {hasDiscount && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="line-through">
                {product.oldPrice?.toLocaleString("ar-EG")} جم
              </span>
              {product.oldPrice && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  خصم{" "}
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )}
                  %
                </span>
              )}
            </div>
          )}
        </div>

        {product.colors.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              اللون
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isActive = selectedColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-zinc-300"
                      style={{ backgroundColor: color.value }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              المقاس
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 min-w-[44px] rounded-full border text-xs font-semibold transition ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-200"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span>تمت الإضافة للسلة</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>إضافة للسلة الآن</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            * عند تفعيل الداتا الفعلية سيتم ربط هذه الصفحة بمنتجات Firestore
            مع إتاحة اختيار الكمية واحتساب توافر المخزون.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

