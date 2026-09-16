'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartSummary() {
  const { totalItems, totalPrice } = useCart()
  const isEmpty = totalItems === 0

  return (
    <div className="border border-[#F2F2F0]/10 bg-[#232326] p-6">
      <p className="text-sm text-[#F2F2F0]/50">
        {totalItems} {totalItems === 1 ? 'item' : 'item'} di keranjang
      </p>

      <div className="mt-4 flex items-baseline justify-between border-t border-[#F2F2F0]/15 pt-4">
        <span className="text-[15px] text-[#F2F2F0]">Subtotal</span>
        <span className="text-lg text-[#F2F2F0]">{formatPrice(totalPrice)}</span>
      </div>

      <p className="mt-1 text-xs text-[#F2F2F0]/50">
        Nomor meja diisi saat checkout.
      </p>

      <Link
        href="/checkout"
        aria-disabled={isEmpty}
        className={`mt-6 block w-full py-3 text-center text-sm font-medium ${
          isEmpty
            ? 'pointer-events-none bg-[#F2F2F0]/10 text-[#F2F2F0]/40'
            : 'bg-[#F2F2F0] text-[#18181B] hover:bg-[#F2F2F0]/90'
        }`}
      >
        Lanjut ke checkout
      </Link>
    </div>
  )
}