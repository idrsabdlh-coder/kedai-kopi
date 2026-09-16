import { NextRequest, NextResponse } from 'next/server'
import { snap } from '@/lib/midtrans'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const { orderId } = (await req.json()) as { orderId: string }

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

  // Midtrans order_id harus unik & tidak boleh dipakai ulang untuk transaksi baru
  const midtransOrderId = `${order.id}-${Date.now()}`

  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: order.total_amount,
      },
      customer_details: {
        first_name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone,
      },
    })

    await supabaseAdmin
      .from('orders')
      .update({
        midtrans_order_id: midtransOrderId,
        snap_token: transaction.token,
      })
      .eq('id', order.id)

    return NextResponse.json({ token: transaction.token })
  } catch (err) {
    console.error('Midtrans error:', err)
    return NextResponse.json(
      { error: 'Gagal membuat transaksi', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}