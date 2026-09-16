import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/product/ProductCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { formatCategoryLabel } from '@/lib/categories'
import Link from 'next/link'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  let query = supabase
    .from('products')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)

  const { data: products } = await query

  const { data: allProducts } = await supabase
    .from('products')
    .select('category')
    .eq('is_available', true)

  const categories = Array.from(new Set((allProducts ?? []).map((p) => p.category)))

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            DIRACIK SETIAP HARI · SIAP DIAMBIL
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight mb-6">
            {category ? `Menu · ${formatCategoryLabel(category)}` : 'Kopi segar. Alat berguna. Hadiah yang pas.'}
          </h1>
          <p className="text-[#F2F2F0]/70 text-lg mb-8 max-w-md">
            Kumpulan pilihan ringkas untuk pagi yang lebih baik, dipilih
            dengan perhatian yang sama seperti tiap racikan kami.
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className={`text-sm px-4 py-2 border transition-colors ${
                  !category
                    ? 'bg-[#F2F2F0] text-[#18181B] border-[#F2F2F0]'
                    : 'border-[#F2F2F0]/30 hover:bg-[#F2F2F0]/5'
                }`}
              >
                Semua
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${encodeURIComponent(cat)}`}
                  className={`text-sm px-4 py-2 border transition-colors ${
                    category === cat
                      ? 'bg-[#F2F2F0] text-[#18181B] border-[#F2F2F0]'
                      : 'border-[#F2F2F0]/30 hover:bg-[#F2F2F0]/5'
                  }`}
                >
                  {formatCategoryLabel(cat)}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="aspect-[4/3] overflow-hidden">
          <img
            src="/images/kopi.avif"
            alt="Produk kedai kopi"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Grid produk */}
      <section className="px-6 md:px-12 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-2">
              RAK SAAT INI
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              Semua yang perlu untuk cangkir berikutnya.
            </h2>
          </div>
          <p className="text-sm text-[#F2F2F0]/60 hidden md:block max-w-xs text-right">
            Gratis ambil di kedai / ongkir untuk belanja di atas Rp75.000.
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-[#F2F2F0]/20">
            <p className="text-[#F2F2F0]/60">
              {category
                ? `Belum ada menu untuk kategori "${category}".`
                : 'Belum ada menu. Tambahkan produk dulu lewat Supabase Table Editor.'}
            </p>
          </div>
        )}
      </section>

      {/* Baris fitur berikon */}
      <section className="px-6 md:px-12 py-16 bg-[#232326] grid sm:grid-cols-3 gap-10">
        <div>
          <svg className="w-6 h-6 text-[#D65A3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4M6 8h12M6 8a6 6 0 1012 0M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2" />
          </svg>
          <h3 className="font-medium mb-2">Selalu segar</h3>
          <p className="text-sm text-[#F2F2F0]/60">
            Kopi diracik dan disajikan langsung saat kamu pesan, bukan dari stok yang menunggu.
          </p>
        </div>
        <div>
          <svg className="w-6 h-6 text-[#D65A3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5m18 0l-9 5m9-5v10l-9 5m0-10L3 8m9 5v10M3 8v10l9 5" />
          </svg>
          <h3 className="font-medium mb-2">Pesan gampang</h3>
          <p className="text-sm text-[#F2F2F0]/60">
            Gratis ambil di kedai atau ongkir untuk belanja di atas Rp75.000.
          </p>
        </div>
        <div>
          <svg className="w-6 h-6 text-[#D65A3A] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.42 0-2.76-.28-3.95-.78L3 20l1.05-3.16C3.38 15.6 3 14.35 3 13c0-4.42 4.03-8 9-8s9 3.58 9 7z" />
          </svg>
          <h3 className="font-medium mb-2">Dibantu langsung</h3>
          <p className="text-sm text-[#F2F2F0]/60">
            Ada pertanyaan soal menu atau rasa? Staf kami siap bantu di tempat.
          </p>
        </div>
      </section>

      {/* Section gift hijau */}
      <section className="grid md:grid-cols-2 bg-[#93A688] text-[#18181B]">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src="/images/tempat.avif"
            alt="Kopi dan pastry"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 md:px-12 py-16">
          <p className="text-xs tracking-[0.2em] font-medium mb-4">
            SIAP DIHADIAHKAN
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-4">
            Kopi enak itu cara sederhana untuk perhatian.
          </h2>
          <p className="mb-6">
            Biji kopi musiman, perlengkapan seduh, dan paket hadiah yang bisa
            dititipkan pesan singkat untuk yang menerima.
          </p>
          <Link
            href="/shop?category=merchandise"
            className="inline-block bg-[#18181B] text-[#F2F2F0] px-6 py-3 text-sm w-fit hover:bg-[#18181B]/90 transition-colors"
          >
            Lihat Hadiah
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}