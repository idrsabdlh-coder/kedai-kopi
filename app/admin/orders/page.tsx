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
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    // DEBUG SEMENTARA — hapus setelah masalah ketemu
    console.log('authLoading:', authLoading)
    console.log('user:', user)
    console.log('user_metadata:', user?.user_metadata)

    if (authLoading) return
    if (!user) {
      console.log('Redirect: tidak ada user')
      router.push('/admin/login')
      return
    }
    const isAdmin = user.user_metadata?.role === 'admin'
    console.log('isAdmin:', isAdmin)
    if (!isAdmin) {
      console.log('Redirect: bukan admin')
      router.push('/admin/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    async function loadOrders() {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      const res = await fetch('/api/admin/orders', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      setOrders(data.orders ?? [])
      setIsLoading(false)
    }
    loadOrders()
  }, [])

  async function handleStatusChange(orderId: string, status: string) {
    setUpdatingId(orderId)
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
      const { order } = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)))
    } finally {
      setUpdatingId(null)
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#18181B] flex items-center justify-center">
        <p className="text-[#F2F2F0]/50 text-sm">Memuat…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-10">
        Kelola Pesanan
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-[#F2F2F0]/10 bg-[#232326] p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{order.customer_name}</p>
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
    </main>
  )
}