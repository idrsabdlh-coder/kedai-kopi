'use client'

import { useCart, type CartItem as CartItemType } from '@/lib/cart-context'

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 border-b border-[#F2F2F0]/15 py-5 last:border-b-0">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#232326]">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] text-[#F2F2F0]">{item.name}</p>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-sm text-[#F2F2F0]/50 underline decoration-[#F2F2F0]/30 underline-offset-4 hover:text-[#F2F2F0]"
          >
            Hapus
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-[#F2F2F0]/20">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-8 w-8 text-[#D65A3A] hover:bg-[#F2F2F0]/5"
              aria-label={`Kurangi jumlah ${item.name}`}
            >
              −
            </button>
            <span className="w-8 text-center text-sm text-[#F2F2F0]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8 text-[#D65A3A] hover:bg-[#F2F2F0]/5"
              aria-label={`Tambah jumlah ${item.name}`}
            >
              +
            </button>
          </div>

          <p className="text-[15px] text-[#F2F2F0]">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  )
}