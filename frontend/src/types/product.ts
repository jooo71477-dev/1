export type ProductColor = {
  name: string;
  value: string; // hex code
};

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  badge?: "جديد" | "الأكثر مبيعًا" | "مميز";
}

