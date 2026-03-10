"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/app/store/cart-context";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalPrice, increment, decrement, remove } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl dark:bg-zinc-950"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                السلة
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-50"
                aria-label="إغلاق السلة"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-full flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                {items.length === 0 && (
                  <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    السلة فارغة حاليًا.
                  </p>
                )}

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="line-clamp-1 font-medium text-zinc-900 dark:text-zinc-50">
                            {item.product.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                            {item.product.price.toLocaleString("ar-EG")} جم
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="text-zinc-400 hover:text-red-500"
                          aria-label="حذف المنتج من السلة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => decrement(item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            aria-label="تقليل الكمية"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center text-[11px] font-medium text-zinc-800 dark:text-zinc-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => increment(item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            aria-label="زيادة الكمية"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-50">
                          {(item.quantity * item.product.price).toLocaleString(
                            "ar-EG"
                          )}{" "}
                          جم
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 bg-white px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                  <span>الإجمالي</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {totalPrice.toLocaleString("ar-EG")} جم
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-full bg-emerald-600 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:disabled:bg-zinc-700"
                  disabled={items.length === 0}
                >
                  إتمام الطلب
                </button>
                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                  * سيتم نقل العميل لصفحة إتمام الطلب في الخطوة الفعلية.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

