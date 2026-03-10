"use client";

import { useState } from "react";
import { X, Truck, Gift } from "lucide-react";
import type { Product, ProductColor, ProductSize } from "@/types/product";
import { useCart } from "@/app/store/cart-context";
import { useRouter } from "next/navigation";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
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

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-2 sm:px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-[#08080a] rounded-[24px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] border border-white/5 relative">
        
        {/* Right side in RTL (First child) - Image */}
        <div className="w-full md:w-[50%] relative bg-zinc-900 border-l border-white/5">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src={selectedImage} 
             alt={product.name} 
             className="w-full h-full object-cover min-h-[400px] md:min-h-[700px]" 
           />
           <button 
             onClick={() => router.back()} 
             className="absolute top-6 right-6 z-10 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Left side in RTL (Second child) - Details */}
        <div className="w-full md:w-[50%] p-8 md:p-14 flex flex-col text-right justify-center">
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter">
            {product.name}
          </h1>

          <div className="bg-[#111113] rounded-[20px] p-6 mb-10 flex flex-col gap-5 border border-white/5 shadow-inner">
            <div className="flex items-center justify-end gap-2 font-black mb-3" dir="ltr">
               <span className="text-[#d8a32a] text-3xl">جنيه</span>
               <span className="text-[#d8a32a] text-7xl leading-none">{product.price.toLocaleString("ar-EG")}</span>
            </div>

            <div className="flex flex-col gap-4 text-sm text-zinc-300 font-bold">
               <div className="flex items-center justify-end gap-3">
                 <span>شحن سريع لكل المحافظات</span>
                 <Truck className="w-5 h-5 text-[#ef0000]" />
               </div>
               <div className="flex items-center justify-end gap-3">
                 <span>العدد محدود – إلحق قبل ما يخلص</span>
                 <Gift className="w-5 h-5 text-[#ef0000]" />
               </div>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors.length > 0 && (
            <div className="mb-10">
               <p className="text-xl font-black text-white mb-5">اللون المتوفر:</p>
               <div className="flex flex-wrap items-center justify-end gap-3">
                  {product.colors.map(color => {
                    const isActive = selectedColor?.name === color.name;
                    return (
                       <button 
                         key={color.name}
                         onClick={() => setSelectedColor(color)}
                         className={`px-8 py-3 rounded-full border border-white/10 font-bold text-sm transition-all duration-300 ${
                           isActive 
                             ? "bg-[#ef0000] text-white shadow-[0_0_20px_rgba(239,0,0,0.6)] border-transparent scale-105" 
                             : "bg-transparent text-zinc-400 hover:text-white hover:border-white/30"
                         }`}
                       >
                         {color.name}
                       </button>
                    )
                  })}
               </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="mb-12">
               <p className="text-xl font-black text-white mb-5">المقاس المناسب:</p>
               <div className="flex flex-wrap items-center justify-end gap-3">
                  {product.sizes.map(size => {
                    const isActive = selectedSize === size;
                    return (
                       <button 
                         key={size}
                         onClick={() => setSelectedSize(size)}
                         className={`w-16 h-16 rounded-full border border-white/10 font-black text-xl flex items-center justify-center transition-all duration-300 ${
                           isActive 
                             ? "bg-[#ef0000] text-white shadow-[0_0_20px_rgba(239,0,0,0.6)] border-transparent scale-105" 
                             : "bg-transparent text-zinc-400 hover:text-white hover:border-white/30"
                         }`}
                       >
                         {size}
                       </button>
                    )
                  })}
               </div>
            </div>
          )}
          
          <button 
            onClick={handleAddToCart} 
            className="w-full bg-[#ef0000] hover:bg-[#d00000] text-white font-black text-2xl py-5 rounded-[20px] transition-all duration-300 hover:scale-[1.02] shadow-[0_15px_40px_rgba(239,0,0,0.4)]"
          >
            أضف للسلة
          </button>

        </div>
      </div>
    </div>
  );
}

