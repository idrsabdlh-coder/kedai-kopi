import { NextResponse } from 'next/server'
import { getAllOrders } from '@/lib/db'

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 })
  }
}