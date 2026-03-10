import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-detail-client";

const demoProducts: Product[] = [
  {
    id: "summer-maxi",
    name: "فستان صيفي ماكسي قطن ١٠٠٪",
    description:
      "فستان صيفي واسع بملمس ناعم، مثالي للخروج اليومي والإطلالات الكاجوال.",
    price: 750,
    oldPrice: 1000,
    image:
      "https://images.pexels.com/photos/7691086/pexels-photo-7691086.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/7691086/pexels-photo-7691086.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/7691095/pexels-photo-7691095.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
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
    description:
      "خامة قطنية لطيفة على بشرة الأطفال مع ألوان ورسوم تناسب اللعب والخروج.",
    price: 450,
    oldPrice: 650,
    image:
      "https://images.pexels.com/photos/1648374/pexels-photo-1648374.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1648374/pexels-photo-1648374.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
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
      "قميص كلاسيكي بأكمام طويلة يناسب العمل والإطلالات الرسمية مع خامة مريحة.",
    price: 620,
    oldPrice: 820,
    image:
      "https://images.pexels.com/photos/15876588/pexels-photo-15876588/free-photo-of-a-man-in-a-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/15876588/pexels-photo-15876588/free-photo-of-a-man-in-a-white-shirt.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    colors: [
      { name: "أبيض", value: "#f9fafb" },
      { name: "أزرق فاتح", value: "#bfdbfe" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    badge: "جديد",
  },
];

type ProductDetailPageProps = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = demoProducts.find((p) => p.id === params.id);

  if (!product) {
    return notFound();
  }

  return <ProductDetailClient product={product} />;
}

