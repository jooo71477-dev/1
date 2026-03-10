import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/types/product";

const demoProducts: Product[] = [
  {
    id: "summer-maxi",
    name: "فستان صيفي ماكسي قطن ١٠٠٪",
    description: "قصة واسعة مريحة مع خامة قطنية ناعمة مثالية لأيام الصيف الحارة.",
    price: 750,
    oldPrice: 1000,
    image:
      "https://images.pexels.com/photos/7691086/pexels-photo-7691086.jpeg?auto=compress&cs=tinysrgb&w=800",
    colors: [
      { name: "أبيض", value: "#f9fafb" },
      { name: "بيج", value: "#e5ded0" },
    ],
    sizes: ["S", "M", "L", "XL"],
    badge: "مميز",
  },
  {
    id: "kids-set",
    name: "طقم أطفال قطن برسوم مرحة",
    description: "تيشيرت وبنطال خفيف بلمسة مرحة تناسب الخروج واللعب اليومي.",
    price: 450,
    oldPrice: 650,
    image:
      "https://images.pexels.com/photos/1648374/pexels-photo-1648374.jpeg?auto=compress&cs=tinysrgb&w=800",
    colors: [
      { name: "أزرق", value: "#1d4ed8" },
      { name: "أصفر", value: "#facc15" },
    ],
    sizes: ["XS", "S", "M"],
    badge: "الأكثر مبيعًا",
  },
  {
    id: "mens-shirt",
    name: "قميص رجالي كلاسيك بأكمام طويلة",
    description:
      "قميص أنيق مناسب للعمل والاجتماعات الرسمية مع خامة مريحة على البشرة.",
    price: 620,
    oldPrice: 820,
    image:
      "https://images.pexels.com/photos/15876588/pexels-photo-15876588/free-photo-of-a-man-in-a-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=800",
    colors: [
      { name: "أبيض", value: "#f9fafb" },
      { name: "أزرق فاتح", value: "#bfdbfe" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    badge: "جديد",
  },
];

export default function StoreHomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-l from-emerald-600 via-emerald-500 to-emerald-400 px-4 py-10 text-white shadow-md sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
              iCLOTH EXCLUSIVE
            </p>
            <h1 className="text-3xl font-black leading-snug sm:text-4xl">
              خصم حتى 30٪ على
              <span className="mx-1 rounded-full bg-white/15 px-2 py-1 text-emerald-50">
                الملابس الصيفية
              </span>
              لكل الأسرة
            </h1>
            <p className="max-w-md text-sm text-emerald-50/90">
              اختر إطلالتك المفضلة من تشكيلتنا المختارة بعناية لرجالي، حريمي، وأطفال
              مع توصيل سريع لجميع المحافظات.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
              <span className="rounded-full bg-emerald-700/40 px-3 py-1">
                شحن مخفض لكل المحافظات
              </span>
              <span className="rounded-full bg-emerald-700/40 px-3 py-1">
                استبدال خلال ١٤ يوم
              </span>
            </div>
          </div>
          <div className="hidden flex-1 sm:block">
            <div className="relative mx-auto h-56 max-w-xs overflow-hidden rounded-3xl bg-emerald-300/20 shadow-lg backdrop-blur">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="ملابس صيفية"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-700/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              منتجات مميزة لك
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              مجموعة مختارة من أفضل القطع مبيعًا وتقييمًا.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

