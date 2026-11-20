'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  if (submitted) {
    return (
      <p className="text-sm text-[#93A688] border border-[#93A688]/30 bg-[#93A688]/10 px-4 py-3 max-w-md">
        Terima kasih sudah berlangganan! Nantikan info menu terbaru dari kami.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Alamat email"
        className="flex-1 border border-[#F2F2F0]/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-[#D65A3A] placeholder:text-[#F2F2F0]/40"
      />
      <button
        type="submit"
        className="bg-[#D65A3A] text-[#F2F2F0] px-6 py-3 text-sm font-medium hover:bg-[#D65A3A]/90 transition-colors cursor-pointer"
      >
        Berlangganan
      </button>
    </form>
  )
}
