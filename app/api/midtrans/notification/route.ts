import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

type MidtransNotification = {
  order_id?: string
  status_code?: string
  gross_amount?: string
  signature_key?: string
  transaction_status?: string
  fraud_status?: string
}

export async function POST(req: NextRequest) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY
  if (!serverKey) {
    console.error('MIDTRANS_SERVER_KEY belum dikonfigurasi')
    return NextResponse.json({ error: 'Server payment belum dikonfigurasi' }, { status: 500 })
  }

  let body: MidtransNotification
  try {
    body = (await req.json()) as MidtransNotification
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body

  if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
    return NextResponse.json({ error: 'Missing required notification fields' }, { status: 400 })
  }

  // 1. Verifikasi signature — pastikan notifikasi ini benar dari Midtrans
  const expectedSignature = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex')

  const sigBuf = Buffer.from(signature_key)
  const expectedBuf = Buffer.from(expectedSignature)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // 2. Tentukan payment_status berdasarkan transaction_status dari Midtrans
  let paymentStatus: string
  if (transaction_status === 'capture') {
    paymentStatus = fraud_status === 'accept' ? 'paid' : 'pending'
  } else if (transaction_status === 'settlement') {
    paymentStatus = 'paid'
  } else if (transaction_status === 'pending') {
    paymentStatus = 'unpaid'
  } else if (
    transaction_status === 'deny' ||
    transaction_status === 'expire' ||
    transaction_status === 'cancel'
  ) {
    paymentStatus = 'failed'
  } else {
    paymentStatus = 'unpaid'
  }

  // 3. Update order di database
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('midtrans_order_id', order_id)
    .select()
    .single()

  if (error || !order) {
    console.error('Order not found for notification:', order_id, error)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // 4. Kalau baru saja lunas, ubah status pesanan dari pending ke processing
  if (paymentStatus === 'paid' && order.status === 'pending') {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id)
  }

  return NextResponse.json({ message: 'OK' })
}
