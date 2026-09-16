import { NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') ?? undefined

  try {
    const products = await getAllProducts(category)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Gagal mengambil produk:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    )
  }
}