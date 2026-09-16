'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAdd}
      className="bg-[#F5EFE4] text-[#1C1712] px-7 py-3.5 text-sm font-medium hover:bg-[#F5EFE4]/90 transition-colors"
    >
      {added ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
    </button>
  )
}