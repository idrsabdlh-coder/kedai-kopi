import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/db'
import { sendOrderReadyEmail } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase-admin'

const ALLOWED_STATUSES = new Set(['pending', 'processing', 'ready', 'completed', 'cancelled'])

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params
  let body: { status?: string }
  try {
    body = (await req.json()) as { status?: string }
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 })
  }

  const { status } = body

  if (!status || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  try {
    const order = await updateOrderStatus(id, status)

    let emailWarning: string | undefined
    if (status === 'ready' && order.customer_email) {
      try {
        await sendOrderReadyEmail(order.customer_email, order.customer_name, order.id)
      } catch (emailErr) {
        console.error('Gagal mengirim email notifikasi pesanan siap:', emailErr)
        emailWarning = 'Status diperbarui, tetapi email notifikasi gagal dikirim.'
      }
    }

    return NextResponse.json({ order, ...(emailWarning ? { emailWarning } : {}) })
  } catch (err) {
    console.error('Update status error:', err)
    return NextResponse.json(
      { error: 'Gagal mengubah status', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
