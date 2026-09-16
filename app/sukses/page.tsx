import { getOrderById } from "@/lib/db"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"

function formatRupiah(value: number | null | undefined) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "Rp0"
  return "Rp" + amount.toLocaleString("id-ID")
}

export default async function SuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const { order: orderId } = await searchParams

  if (!orderId) {
    return (
      <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
        <Navbar />
        <section className="px-6 md:px-12 py-24 text-center">
          <p className="text-[#F2F2F0]/60">Nomor pesanan tidak ditemukan.</p>
        </section>
        <Footer />
      </main>
    )
  }

  const order = await getOrderById(orderId)

  if (!order) {
    return (
      <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
        <Navbar />
        <section className="px-6 md:px-12 py-24 text-center">
          <p className="text-[#F2F2F0]/60 mb-6">
            Pesanan tidak ditemukan. Nomor pesanan mungkin salah atau sudah
            kedaluwarsa.
          </p>
          <Link
            href="/"
            className="inline-block border border-[#F2F2F0]/20 px-6 py-3 text-sm hover:bg-[#F2F2F0] hover:text-[#18181B] transition"
          >
            Kembali ke Menu
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      <section className="px-6 md:px-12 py-24 max-w-lg">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
          PESANAN &middot; DITERIMA
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight mb-6">
          Sedang diracik.
        </h1>

        <p className="text-[#F2F2F0]/70 text-lg mb-10">
          Pesananmu sudah kami terima. Kami akan mengabari lewat email begitu
          pesananmu siap.
        </p>

        <div className="border border-[#F2F2F0]/10 bg-[#232326] p-6 mb-10">
          <p className="text-sm text-[#F2F2F0]/50 mb-1">Nomor pesanan</p>
          <p className="mb-6 break-all">{order.id}</p>

          <p className="text-sm text-[#F2F2F0]/50 mb-1">Total</p>
          <p className="text-[#D65A3A] font-medium text-lg">
            {formatRupiah(order.total_amount)}
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-[#F2F2F0] text-[#18181B] px-6 py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition"
        >
          Kembali ke Menu
        </Link>
      </section>

      <Footer />
    </main>
  )
}