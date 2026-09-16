'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useCart } from '@/lib/cart-context'
import { Navbar } from '@/components/layout/Navbar'

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
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    setIsSubmitting(true)
    try {
      // 1. Buat order dulu di database
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items, total: totalPrice }),
      })

      if (!res.ok) throw new Error('Gagal memproses pesanan')

      const { orderId } = await res.json()

      // 2. Minta Snap Token dari Midtrans
      const tokenRes = await fetch('/api/midtrans/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!tokenRes.ok) throw new Error('Gagal membuat transaksi pembayaran')

      const { token } = await tokenRes.json()

      // 3. Buka popup Snap
      if (!window.snap) {
        throw new Error('Snap.js belum siap, coba lagi sebentar')
      }

      window.snap.pay(token, {
        onSuccess: () => {
          clearCart()
          router.push(`/sukses?order=${orderId}`)
        },
        onPending: () => {
          clearCart()
          router.push(`/sukses?order=${orderId}`)
        },
        onError: () => {
          setError('Pembayaran gagal. Coba lagi ya.')
          setIsSubmitting(false)
        },
        onClose: () => {
          // Pelanggan menutup popup tanpa menyelesaikan pembayaran
          setError('Pembayaran dibatalkan. Pesananmu masih tersimpan, silakan coba bayar lagi.')
          setIsSubmitting(false)
        },
      })
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Pesanan gagal diproses. Coba lagi sebentar.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src={
          process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js'
        }
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <Navbar />
      <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-32">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">
          {`CHECKOUT · ${items.length} ITEM`}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold mb-16 max-w-lg leading-[1.1]">
          Terakhir, sebelum diseduh.
        </h1>

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
                className="mt-2 bg-[#F2F2F0] text-[#18181B] px-7 py-3.5 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors disabled:opacity-60"
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
      </main>
    </>
  )
}