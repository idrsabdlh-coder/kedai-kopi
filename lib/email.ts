import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderReadyEmail(to: string, customerName: string, orderId: string) {
  await resend.emails.send({
    from: 'Kedai Kopi <onboarding@resend.dev>',
    to,
    subject: 'Pesananmu sudah siap diambil ☕',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Halo ${customerName},</p>
        <p>Kabar baik — pesananmu sudah selesai diracik dan siap diambil di kedai.</p>
        <p style="color: #8C7B6F; font-size: 14px;">Nomor pesanan: ${orderId}</p>
        <p>Ditunggu kedatangannya ya!</p>
        <p>— Kedai Kopi</p>
      </div>
    `,
  })
}