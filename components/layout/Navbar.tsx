import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-[#F2F2F0]/10 bg-[#18181B]">
      <Link href="/" className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#F2F2F0]">
        Kedai Kopi
      </Link>
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 text-sm text-[#F2F2F0]">
          <Link href="/" className="hover:text-[#D65A3A]">Home</Link>
          <Link href="/coffee" className="hover:text-[#D65A3A]">Kopi Kami</Link>
          <Link href="/shop" className="hover:text-[#D65A3A]">Shop</Link>
          <Link href="/about" className="hover:text-[#D65A3A]">Tentang</Link>
        </div>

        <Link
          href="/cart"
          className="text-sm bg-[#F2F2F0] text-[#18181B] px-4 py-2 hover:bg-[#F2F2F0]/90 transition-colors"
        >
          Keranjang
        </Link>
      </div>
    </nav>
  )
}