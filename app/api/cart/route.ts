import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { productId, quantity, sessionId } = await request.json()

    if (!productId || !sessionId || !quantity) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Cek apakah item sudah ada di cart session ini
    const { data: existing, error: findError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('session_id', sessionId)
      .eq('product_id', productId)
      .maybeSingle()

    if (findError) throw findError

    if (existing) {
      // Sudah ada -> tambah quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // Belum ada -> insert baru
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ session_id: sessionId, product_id: productId, quantity })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('Cart error:', err)
    return NextResponse.json({ error: 'Gagal menambah ke cart' }, { status: 500 })
  }
}