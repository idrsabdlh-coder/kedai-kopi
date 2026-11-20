import { NextRequest, NextResponse } from 'next/server'
import { snap } from '@/lib/midtrans'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  if (!process.env.MIDTRANS_SERVER_KEY || !process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY) {
    return NextResponse.json(
      { error: 'Konfigurasi Midtrans belum diatur di environment (.env.local)' },
      { status: 500 }
    )
  }

  let body: { orderId?: string }
  try {
    body = (await req.json()) as { orderId?: string }
  } catch {
    return NextResponse.json({ error: 'Format request tidak valid' }, { status: 400 })
  }

  const { orderId } = body

  if (!orderId) {
    return NextResponse.json({ error: 'orderId wajib diisi' }, { status: 400 })
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (error || !order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }

  if (order.payment_status === 'paid') {
    return NextResponse.json({ error: 'Pesanan ini sudah dibayar' }, { status: 409 })
  }

  // Midtrans order_id harus unik & tidak boleh dipakai ulang untuk transaksi baru
  const midtransOrderId = `${order.id}-${Date.now()}`

  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: Math.round(Number(order.total_amount)),
      },
      customer_details: {
        first_name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
      },
    })

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        midtrans_order_id: midtransOrderId,
        snap_token: transaction.token,
      })
      .eq('id', order.id)

    if (updateError) {
      // Fallback jika kolom snap_token belum ada di tabel orders
      const { error: fallbackError } = await supabaseAdmin
        .from('orders')
        .update({ midtrans_order_id: midtransOrderId })
        .eq('id', order.id)

      if (fallbackError) throw fallbackError
    }

    return NextResponse.json({ token: transaction.token })
  } catch (err) {
    console.error('Midtrans error:', err)
    return NextResponse.json(
      { error: 'Gagal membuat transaksi', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
