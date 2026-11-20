'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export function Navbar() {
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-[#F2F2F0]/10 bg-[#18181B]">
      <div className="px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#F2F2F0]">
          Kedai Kopi
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm text-[#F2F2F0]">
            <Link href="/" className="hover:text-[#D65A3A] transition-colors">Home</Link>
            <Link href="/coffee" className="hover:text-[#D65A3A] transition-colors">Kopi Kami</Link>
            <Link href="/shop" className="hover:text-[#D65A3A] transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-[#D65A3A] transition-colors">Tentang</Link>
          </div>

          <Link
            href="/cart"
            className="text-sm bg-[#F2F2F0] text-[#18181B] px-4 py-2 hover:bg-[#F2F2F0]/90 transition-colors"
          >
            {totalItems > 0 ? `Keranjang (${totalItems})` : 'Keranjang'}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={menuOpen}
            className="md:hidden border border-[#F2F2F0]/20 px-3 py-2 text-sm text-[#F2F2F0] hover:border-[#F2F2F0]/50"
          >
            {menuOpen ? 'Tutup' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="md:hidden border-t border-[#F2F2F0]/10 px-6 py-4 flex flex-col gap-3 text-sm text-[#F2F2F0]">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[#D65A3A]">Home</Link>
          <Link href="/coffee" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[#D65A3A]">Kopi Kami</Link>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[#D65A3A]">Shop</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[#D65A3A]">Tentang</Link>
        </div>
      ) : null}
    </nav>
  )
}
