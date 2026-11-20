import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/db'
import { formatCategoryLabel } from '@/lib/categories'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import AddToCartButton from '@/components/product/AddToCartButton'

export const dynamic = 'force-dynamic'

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let product = null
  let loadError = false

  try {
    product = await getProductBySlug(decodeURIComponent(slug))
  } catch (err) {
    console.error('Gagal mengambil detail produk:', err)
    loadError = true
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
        <Navbar />
        <section className="px-6 md:px-12 py-24 max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            KONEKSI DATABASE BERMASALAH
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-4">
            Detail produk tidak dapat dimuat saat ini.
          </h1>
          <p className="text-[#F2F2F0]/60 mb-8">
            Pastikan koneksi database Supabase aktif dan konfigurasi environment sudah benar.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-[#F2F2F0]/30 px-6 py-3 text-sm hover:bg-[#F2F2F0] hover:text-[#18181B] transition-colors"
          >
            Kembali ke Shop
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      <section className="px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
        <Link
          href="/shop"
          className="inline-block text-sm text-[#F2F2F0]/60 hover:text-[#D65A3A] mb-10 transition-colors"
        >
          ← Kembali ke Menu
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="aspect-square relative overflow-hidden bg-[#232326] border border-[#F2F2F0]/10">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#F2F2F0]/30 text-sm">
                Tidak ada foto
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
              {formatCategoryLabel(product.category).toUpperCase()}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-[#F2F2F0] mb-6">
              {formatPrice(product.price)}
            </p>

            {product.description ? (
              <p className="text-[#F2F2F0]/70 leading-relaxed mb-8">
                {product.description}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <AddToCartButton product={product} />
              <Link
                href="/cart"
                className="border border-[#F2F2F0]/30 px-6 py-3.5 text-sm hover:bg-[#F2F2F0]/10 transition-colors"
              >
                Lihat Keranjang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
