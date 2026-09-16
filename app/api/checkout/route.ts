import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase-admin'

type CheckoutPayload = {
  customer: { name: string; email: string; phone: string; address: string; notes: string }
  items: { id: string; name: string; price: number; quantity: number }[]
  total: number
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CheckoutPayload

  if (
    !body.customer?.name ||
    !body.customer?.email ||
    !body.customer?.phone ||
    !body.customer?.address
  ) {
    return NextResponse.json({ error: 'Data penerima tidak lengkap' }, { status: 400 })
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })
  }

  try {
    const order = await createOrder(supabaseAdmin, {
      user_id: null,
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone,
      customer_address: body.customer.address,
      notes: body.customer.notes || null,
      total_amount: body.total,
      items: body.items.map((item) => ({
        product_id: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    })
    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      {
        error: 'Gagal menyimpan pesanan',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}