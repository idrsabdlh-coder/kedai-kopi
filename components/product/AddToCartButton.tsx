'use client'

import { useEffect, useRef, useState } from 'react'
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    })
    setAdded(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="bg-[#F2F2F0] text-[#18181B] px-7 py-3.5 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors cursor-pointer"
    >
      {added ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
    </button>
  )
}
