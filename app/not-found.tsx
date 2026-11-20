import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#18181B] text-[#F2F2F0]">
      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-24 flex flex-col items-start justify-center">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
          404 · TIDAK DITEMUKAN
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold mb-6 max-w-lg leading-[1.1]">
          Halaman yang kamu cari tidak ada.
        </h1>
        <p className="text-[#F2F2F0]/60 mb-10 max-w-md">
          Mungkin tautannya sudah berubah atau produknya sudah tidak tersedia.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#F2F2F0] text-[#18181B] px-6 py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors"
        >
          Lihat Menu
        </Link>
      </main>
      <Footer />
    </div>
  )
}
