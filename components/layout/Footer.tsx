import Link from 'next/link'

export function Footer() {
  return (
    <div className="bg-[#F2F2F0]">
      <div className="px-6 md:px-12 pt-16">
        <div className="bg-[#18181B] text-[#F2F2F0] p-8 md:p-12">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            INBOX YANG TENANG
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-4 max-w-md">
            Diskon 15% untuk pembelian pertamamu.
          </h2>
          <p className="text-[#F2F2F0]/60 text-sm mb-6 max-w-md">
            Info menu baru, promo musiman, dan catatan seduh — langsung ke email, tanpa spam.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              required
              placeholder="Alamat email"
              className="flex-1 border border-[#F2F2F0]/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#D65A3A] placeholder:text-[#F2F2F0]/40"
            />
            <button
              type="submit"
              className="bg-[#D65A3A] text-[#F2F2F0] px-6 py-3 text-sm font-medium hover:bg-[#D65A3A]/90 transition-colors"
            >
              Berlangganan
            </button>
          </form>
        </div>
      </div>

      <footer className="text-[#18181B] px-6 md:px-12 py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-semibold mb-3">
              Kedai Kopi
            </p>
            <p className="text-sm text-[#18181B]/60">
              Kopi untuk pagi yang santai maupun yang buru-buru.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] text-[#18181B]/40 mb-4">SHOP</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/shop" className="hover:text-[#D65A3A]">Semua Menu</Link>
              <Link href="/coffee" className="hover:text-[#D65A3A]">Kopi</Link>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] text-[#18181B]/40 mb-4">PELAJARI</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-[#D65A3A]">Tentang Kami</Link>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] text-[#18181B]/40 mb-4">KUNJUNGI</p>
            <p className="text-sm text-[#18181B]/60">Setiap hari · 07.00–16.00</p>
          </div>
        </div>

        <p className="text-xs text-[#18181B]/30 mt-12">© 2026 Kedai Kopi</p>
      </footer>
    </div>
  )
}