'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

type FormState = {
  name: string
  phone: string
  address: string
  notes: string
}

const initialState: FormState = {
  name: '',
  phone: '',
  address: '',
  notes: '',
}

export function CheckoutForm() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Nama, nomor telepon, dan alamat wajib diisi.')
      return
    }
    if (items.length === 0) {
      setError('Keranjang kamu kosong.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          total: totalPrice,
        }),
      })

      if (!res.ok) {
        throw new Error('Gagal memproses pesanan')
      }

      const { orderId } = await res.json()
      clearCart()
      router.push(`/sukses?order=${orderId}`)
    } catch {
      setError('Pesanan gagal diproses. Coba lagi sebentar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-[#2B211B]">
          Nama penerima
        </label>
        <input
          id="name"
          value={form.name}
          onChange={handleChange('name')}
          className="border border-[#D8CFC0] bg-[#FAF7F2] px-3 py-2 text-[15px] text-[#2B211B] outline-none focus:border-[#6B4226]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm text-[#2B211B]">
          Nomor telepon
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange('phone')}
          className="border border-[#D8CFC0] bg-[#FAF7F2] px-3 py-2 text-[15px] text-[#2B211B] outline-none focus:border-[#6B4226]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address" className="text-sm text-[#2B211B]">
          Alamat pengiriman
        </label>
        <textarea
          id="address"
          value={form.address}
          onChange={handleChange('address')}
          rows={3}
          className="border border-[#D8CFC0] bg-[#FAF7F2] px-3 py-2 text-[15px] text-[#2B211B] outline-none focus:border-[#6B4226]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm text-[#2B211B]">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          value={form.notes}
          onChange={handleChange('notes')}
          rows={2}
          className="border border-[#D8CFC0] bg-[#FAF7F2] px-3 py-2 text-[15px] text-[#2B211B] outline-none focus:border-[#6B4226]"
        />
      </div>

      {error ? (
        <p className="text-sm text-[#B3413A]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 bg-[#6B4226] py-3 text-sm text-[#FAF7F2] hover:bg-[#59371F] disabled:opacity-60"
      >
        {isSubmitting ? 'Memproses…' : 'Buat pesanan'}
      </button>
    </form>
  )
}