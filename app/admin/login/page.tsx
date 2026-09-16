'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error('Login error:', error)
        setError(`Gagal masuk: ${error.message}`)
        return
      }

      router.push('/admin/orders')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Terjadi kesalahan tak terduga. Coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0] px-6 md:px-12 py-32 flex flex-col items-start">
      <p className="text-xs tracking-[0.2em] text-[#D65A3A] mb-6">ADMIN</p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold mb-10">
        Masuk ke panel admin.
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm">Kata sandi</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#F2F2F0]/20 bg-transparent px-3 py-2 text-[15px] outline-none focus:border-[#D65A3A]"
          />
        </div>

        {error ? <p className="text-sm text-[#E07856]">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#F2F2F0] text-[#18181B] py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </main>
  )
}