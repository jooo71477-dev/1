import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 font-sans text-zinc-50 relative overflow-hidden">
      {/* Background with a premium feel */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="https://images.pexels.com/photos/7671166/pexels-photo-7671166.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <main className="z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-32 text-center sm:px-16">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-sm font-medium tracking-[0.4em] text-emerald-400 uppercase">
              Premium Clothing Store
            </h2>
            <h1 className="mt-4 text-6xl font-black tracking-tight text-white sm:text-8xl" style={{ fontFamily: "Playfair Display, serif" }}>
              ICLOTH
            </h1>
            <p className="mt-6 max-w-lg text-lg text-zinc-300">
              Highest quality clothing for everyone. Discover our new summer collection and upgrade your wardrobe today.
            </p>
          </div>
          <Link
            href="/store"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-emerald-600 px-8 py-4 font-medium text-white shadow-lg transition duration-300 hover:bg-emerald-500 hover:shadow-emerald-500/30"
          >
            <span className="relative flex items-center gap-2">
              تسوق الآن
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
              </svg>
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
