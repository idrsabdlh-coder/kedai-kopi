'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { useCart } from '@/lib/cart-context'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

type FormState = {
  name: string
  email: string
  phone: string
  address: string
  notes: string
}

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void
          onPending?: (result: unknown) => void
          onError?: (result: unknown) => void
          onClose?: () => void
        }
      ) => void
    }
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Nama, email, nomor telepon, dan nomor meja wajib diisi.')
      return
    }
    if (items.length === 0) {
      setError('Keranjang kamu kosong.')
      return
    }
    if (!midtransClientKey) {
      setError('Pembayaran belum dikonfigurasi (NEXT_PUBLIC_MIDTRANS_CLIENT_KEY belum diatur).')
      return
    }

    setIsSubmitting(true)
    try {
      // 1. Buat order dulu di database (atau pakai ulang orderId jika sebelumnya popup ditutup)
      let orderId = pendingOrderId
      if (!orderId) {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customer: form, items, total: totalPrice }),
        })

        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data.error || 'Gagal memproses pesanan')
        }

        orderId = data.orderId as string
        setPendingOrderId(orderId)
      }

      // 2. Minta Snap Token dari Midtrans
      const tokenRes = await fetch('/api/midtrans/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const tokenData = await tokenRes.json().catch(() => ({}))
      if (!tokenRes.ok) {
        throw new Error(tokenData.error || 'Gagal membuat transaksi pembayaran')
      }

      const { token } = tokenData

      // 3. Buka popup Snap
      if (!window.snap) {
        throw new Error('Snap.js belum siap, coba lagi sebentar')
      }

      window.snap.pay(token, {
        onSuccess: () => {
          setPendingOrderId(null)
          clearCart()
          router.push(`/sukses?order=${orderId}`)
        },
        onPending: () => {
          setPendingOrderId(null)
          clearCart()
          router.push(`/sukses?order=${orderId}`)
        },
        onError: () => {
          setError('Pembayaran gagal. Coba lagi ya.')
          setIsSubmitting(false)
        },
        onClose: () => {
          setError('Pembayaran dibatalkan. Pesananmu masih tersimpan, silakan klik Bayar Sekarang untuk mencoba lagi.')
          setIsSubmitting(false)
        },
      })
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Pesanan gagal diproses. Coba lagi sebentar.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#18181B] text-[#F2F2F0]">
      {midtransClientKey ? (
        <Script
          src={
            process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
              ? 'https://app.midtrans.com/snap/snap.js'
              : 'https://app.sandbox.midtrans.com/snap/snap.js'
          }
          data-client-key={midtransClientKey}
          strategy="afterInteractive"
        />
      ) : null}

      <Navbar />
      <main className="flex-1 px-6 md:px-12 py-24">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
          {`CHECKOUT · ${totalItems} ITEM`}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold mb-16 max-w-lg leading-[1.1]">
          Terakhir, sebelum diseduh.
        </h1>

        {items.length === 0 ? (
          <div className="max-w-md border border-[#F2F2F0]/15 p-8">
            <p className="text-[#F2F2F0]/70 mb-6">
              Keranjang kamu masih kosong. Pilih menu terlebih dahulu sebelum melanjutkan checkout.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#F2F2F0] text-[#18181B] px-6 py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors"
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-16 max-w-4xl">
            <div>
              <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
                01 · DATA PESANAN
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm">
                    Nama penerima
                  </label>
                  <input
                    id="name"
                    required
                    value={form.name}
                    onChange={handleChange('name')}
                    className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="untuk kirim status pesanan"
                    className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A] placeholder:text-[#F2F2F0]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm">
                    Nomor telepon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange('phone')}
                    className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-sm">
                    Nomor meja
                  </label>
                  <input
                    id="address"
                    required
                    value={form.address}
                    onChange={handleChange('address')}
                    placeholder="misalnya: Meja 5"
                    className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A] placeholder:text-[#F2F2F0]/30"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-sm">
                    Catatan (opsional)
                  </label>
                  <textarea
                    id="notes"
                    value={form.notes}
                    onChange={handleChange('notes')}
                    rows={2}
                    className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A]"
                  />
                </div>

                {error ? <p className="text-sm text-[#E07856]">{error}</p> : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 bg-[#F2F2F0] text-[#18181B] px-7 py-3.5 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? 'Memproses…' : 'Bayar Sekarang'}
                </button>
              </form>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
                02 · RINGKASAN
              </p>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-[#F2F2F0]/10 pb-4">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-[#F2F2F0]/50">Qty {item.quantity}</p>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline justify-between border-t border-[#F2F2F0]/15 pt-5 mt-5">
                <span className="text-[15px]">Total</span>
                <span className="text-lg">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
