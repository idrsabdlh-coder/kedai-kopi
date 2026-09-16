import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const { productId, quantity, sessionId } = await request.json()

  const item = await prisma.cartItem.create({
    data: { productId, quantity, cart: { connect: { sessionId } } },
  })

  return NextResponse.json(item)
}