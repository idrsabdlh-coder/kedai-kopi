import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 })
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token)
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Tidak ada akses' }, { status: 401 })
  }

  const isAdmin = userData.user.user_metadata?.role === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'Bukan admin' }, { status: 403 })
  }

  try {
    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch (err) {
    console.error('Gagal mengambil pesanan:', err)
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 })
  }
}
