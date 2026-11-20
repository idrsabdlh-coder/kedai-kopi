import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase-admin'

type CheckoutPayload = {
  customer?: { name?: string; email?: string; phone?: string; address?: string; notes?: string }
  items?: { id?: string; name?: string; price?: number; quantity?: number }[]
  total?: number
}

export async function POST(req: NextRequest) {
  let body: CheckoutPayload
  try {
    body = (await req.json()) as CheckoutPayload
  } catch {
    return NextResponse.json({ error: 'Format data tidak valid' }, { status: 400 })
  }

  const name = body.customer?.name?.trim()
  const email = body.customer?.email?.trim()
  const phone = body.customer?.phone?.trim()
  const address = body.customer?.address?.trim()
  const notes = body.customer?.notes?.trim() || null

  if (!name || !email || !phone || !address) {
    return NextResponse.json({ error: 'Data penerima tidak lengkap' }, { status: 400 })
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 })
  }

  for (const item of body.items) {
    if (!item.id || typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return NextResponse.json({ error: 'Item keranjang tidak valid' }, { status: 400 })
    }
  }

  try {
    // Verifikasi harga produk langsung dari database agar tidak bisa dimanipulasi dari client
    const productIds = Array.from(new Set(body.items.map((item) => item.id!)))
    const { data: products, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, price')
      .in('id', productIds)

    if (productError) throw productError

    const priceMap = new Map((products ?? []).map((p) => [p.id as string, Number(p.price)]))

    const verifiedItems = body.items.map((item) => {
      const dbPrice = priceMap.get(item.id!)
      if (dbPrice === undefined) {
        throw new Error(`Produk tidak ditemukan: ${item.id}`)
      }
      return {
        product_id: item.id!,
        price: dbPrice,
        quantity: item.quantity!,
      }
    })

    const totalAmount = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await createOrder(supabaseAdmin, {
      user_id: null,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      customer_address: address,
      notes,
      total_amount: totalAmount,
      items: verifiedItems,
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
