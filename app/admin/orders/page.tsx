'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  status: string
  payment_status?: string
  total_amount: number
  created_at: string
}

const STATUS_OPTIONS = ['pending', 'processing', 'ready', 'completed', 'cancelled']

function formatPrice(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function AdminOrdersPage() {
  const { user, isLoading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const isAdmin = Boolean(user && user.user_metadata?.role === 'admin')

  useEffect(() => {
    if (authLoading) return
    if (!isAdmin) {
      router.push('/admin/login')
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (authLoading || !isAdmin) return

    let cancelled = false
    async function loadOrders() {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData.session?.access_token

        const res = await fetch('/api/admin/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))

        if (!cancelled) {
          if (!res.ok) {
            setNotice(data.error || 'Gagal memuat daftar pesanan.')
          } else {
            setOrders(data.orders ?? [])
          }
          setIsLoading(false)
        }
      } catch {
        if (!cancelled) {
          setNotice('Gagal terhubung ke server untuk memuat pesanan.')
          setIsLoading(false)
        }
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAdmin])

  async function handleStatusChange(orderId: string, status: string) {
    setUpdatingId(orderId)
    setNotice(null)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.order) {
        setNotice(data.error || 'Gagal mengubah status pesanan.')
        return
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)))
      if (data.emailWarning) {
        setNotice(data.emailWarning)
      }
    } catch {
      setNotice('Terjadi kesalahan saat mengubah status pesanan.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleSignOut() {
    await signOut()
    router.push('/admin/login')
  }

  if (authLoading || !isAdmin || isLoading) {
    return (
      <main className="min-h-screen bg-[#18181B] flex items-center justify-center">
        <p className="text-[#F2F2F0]/50 text-sm">Memuat…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
          Kelola Pesanan
        </h1>
        <button
          type="button"
          onClick={handleSignOut}
          className="border border-[#F2F2F0]/20 px-4 py-2 text-sm hover:bg-[#F2F2F0]/10 transition-colors cursor-pointer"
        >
          Keluar
        </button>
      </div>

      {notice ? (
        <div className="mb-6 border border-[#D65A3A]/40 bg-[#D65A3A]/10 px-4 py-3 text-sm text-[#E07856]">
          {notice}
        </div>
      ) : null}

      {orders.length === 0 ? (
        <div className="border border-dashed border-[#F2F2F0]/20 p-12 text-center text-sm text-[#F2F2F0]/60">
          Belum ada pesanan masuk.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-[#F2F2F0]/10 bg-[#232326] p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium">{order.customer_name}</p>
                  {order.payment_status ? (
                    <span className="text-xs px-2 py-0.5 border border-[#F2F2F0]/20 text-[#F2F2F0]/70">
                      {order.payment_status}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-[#F2F2F0]/60">{order.customer_email}</p>
                <p className="text-sm text-[#F2F2F0]/60">{order.customer_phone}</p>
                <p className="text-sm text-[#F2F2F0]/60">Meja: {order.customer_address}</p>
                <p className="text-sm text-[#F2F2F0]/60">{formatPrice(order.total_amount)}</p>
              </div>

              <select
                value={order.status}
                disabled={updatingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="bg-[#18181B]">{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
