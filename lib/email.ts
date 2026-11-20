import { Resend } from 'resend'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function sendOrderReadyEmail(to: string, customerName: string, orderId: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY belum dikonfigurasi')
  }

  const resend = new Resend(apiKey)
  const safeName = escapeHtml(customerName)
  const safeOrderId = escapeHtml(orderId)

  const { error } = await resend.emails.send({
    from: 'Kedai Kopi <onboarding@resend.dev>',
    to,
    subject: 'Pesananmu sudah siap diambil ☕',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Halo ${safeName},</p>
        <p>Kabar baik — pesananmu sudah selesai diracik dan siap diambil di kedai.</p>
        <p style="color: #8C7B6F; font-size: 14px;">Nomor pesanan: ${safeOrderId}</p>
        <p>Ditunggu kedatangannya ya!</p>
        <p>— Kedai Kopi</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message || 'Gagal mengirim email via Resend')
  }
}