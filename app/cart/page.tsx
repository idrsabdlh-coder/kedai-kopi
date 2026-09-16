'use client'

import { useCart } from '@/lib/cart-context'
import { CartItem } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import Link from 'next/link'

export default function CartPage() {
  const { items } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-32 flex flex-col items-start justify-center">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
          KERANJANG · KOSONG
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold mb-6 max-w-lg leading-[1.1]">
          Belum ada yang diseduh.
        </h1>
        <p className="text-[#F2F2F0]/60 mb-10 max-w-sm text-lg">
          Pilih menu favoritmu dulu, baru kita mulai racikannya.
        </p>
        <Link
          href="/"
          className="inline-block border border-[#F2F2F0]/30 px-7 py-3.5 hover:bg-[#F2F2F0] hover:text-[#18181B] transition-colors"
        >
          Lihat Menu
        </Link>
      </main>
    )
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-32">
      <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
        {`KERANJANG · ${itemCount} ITEM`}
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold mb-16 max-w-lg leading-[1.1]">
        Sebelum diseduh.
      </h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-16 max-w-4xl">
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="pt-1">
          <CartSummary />
        </div>
      </div>
    </main>
  )
}