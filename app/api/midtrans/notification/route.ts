import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendOrderReadyEmail } from '@/lib/email'

type MidtransNotification = {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key: string
  transaction_status: string
  fraud_status?: string
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as MidtransNotification

  const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body

  // 1. Verifikasi signature — pastikan notifikasi ini benar dari Midtrans, bukan orang iseng
  const serverKey = process.env.MIDTRANS_SERVER_KEY!
  const expectedSignature = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex')

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // 2. midtrans_order_id kita simpan sebagai "orderId-timestamp", ambil orderId aslinya
  const originalOrderId = order_id.split('-').slice(0, 5).join('-')
  // (UUID Supabase formatnya 5 bagian dipisah dash, jadi ambil 5 bagian pertama)

  // 3. Tentukan payment_status berdasarkan transaction_status dari Midtrans
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

  // 4. Update order di database
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

  // 5. Kalau baru saja lunas, kirim email konfirmasi pesanan diterima (opsional, boleh disesuaikan)
  if (paymentStatus === 'paid' && order.status === 'pending') {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id)
  }

  return NextResponse.json({ message: 'OK' })
}