import { getAllProducts } from '@/lib/db'
import ProductCard from '@/components/product/ProductCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default async function Home() {
  const featured = (await getAllProducts()).slice(0, 4)

  return (
    <main className="bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      <section className="relative min-h-[600px] flex items-end px-6 md:px-12 pb-24 pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/hero-kopi.avif')" }}
        />
        <div className="relative max-w-lg">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            DIRACIK SETIAP HARI · UNTUK KOTAMU
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Kopi untuk jam-jam yang berarti.
          </h1>
          <p className="text-[#F2F2F0]/70 text-lg mb-8">
            Diracik pelan setiap pagi, dari biji pilihan sampai ke cangkirmu.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/shop"
              className="bg-[#F2F2F0] text-[#18181B] px-6 py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors"
            >
              Lihat Menu
            </Link>
            <Link href="/about" className="text-sm underline underline-offset-4 hover:text-[#D65A3A]">
              Cerita kami
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#F2F2F0]/10 bg-[#18181B] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F2F2F0]/10">
          {['Biji Kopi', 'Minuman Dingin', 'Alat Seduh', 'Kotak Hadiah'].map((label) => (
            <div key={label} className="text-center py-5 text-sm">
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
              RACIKAN MINGGU INI
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold">
              Kopi dengan karakter yang jelas.
            </h2>
          </div>
          <Link href="/shop" className="text-sm underline underline-offset-4 hover:text-[#D65A3A]">
            Lihat semua menu
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center bg-[#232326]">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src="/images/seduhan.avif"
            alt="Proses menyeduh kopi"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            DIBUAT DENGAN NIAT
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-6">
            Kami meracik rasa, bukan sekadar kopi.
          </h2>
          <p className="text-[#F2F2F0]/70 mb-6 leading-relaxed">
            Tiap batch diracik dalam jumlah kecil, supaya rasa manis dan
            karakter aslinya tetap terjaga sampai ke cangkirmu.
          </p>
          <blockquote className="border-l-2 border-[#D65A3A] pl-4 italic text-[#F2F2F0]/80 mb-2">
            &ldquo;Rasa yang jelas, bukan yang berisik.&rdquo;
          </blockquote>
          <p className="text-sm text-[#F2F2F0]/50">Tim Peracik Kedai Kopi</p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-24">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
          PAGI YANG LEBIH TENANG
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-16 max-w-lg">
          Cangkir yang lebih baik, tiga langkah pasti.
        </h2>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F2F2F0]/10">
          {[
            { n: '01', title: 'Giling sebelum diseduh', desc: 'Mulai dari gilingan sedang, sesuaikan sampai rasa manisnya terasa dulu.' },
            { n: '02', title: 'Pakai takaran sederhana', desc: 'Mulai dari 1:16 antara kopi dan air, lalu sesuaikan seleramu.' },
            { n: '03', title: 'Beri waktu', desc: 'Tunggu sebentar, rasa kopi biasanya makin jelas saat agak dingin.' },
          ].map((step) => (
            <div key={step.n} className="p-6 md:px-8 md:py-0">
              <p className="text-[#D65A3A] text-3xl font-[family-name:var(--font-display)] mb-4">
                {step.n}
              </p>
              <h3 className="font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-[#F2F2F0]/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-24 bg-[#232326]">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3 text-center">
          CERITA PELANGGAN
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-12 text-center">
          Kopi yang terus diingat pelanggan.
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { text: 'Baru kali ini langganan kopi beneran mengubah rutinitas pagi saya.', name: 'Sinta R. · Bandung' },
            { text: 'Catatan rasanya jujur, bahkan yang decaf pun terasa dipikirkan.', name: 'Dimas K. · Jakarta' },
            { text: 'Tempatnya tenang, staf ingat pesanan saya setiap kali datang.', name: 'Priya S. · Surabaya' },
          ].map((t, i) => (
            <div key={i} className="bg-[#18181B] border border-[#F2F2F0]/10 p-6">
              <p className="text-[#D65A3A] mb-4">★★★★★</p>
              <p className="text-[#F2F2F0]/80 mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm text-[#F2F2F0]/50">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 bg-[#8CA085] text-[#18181B]">
        <div className="aspect-[4/3] md:aspect-auto">
          <img
            src="/images/tempat.avif"
            alt="Interior kedai"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 md:px-12 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-4">
            Mampir, duduk santai sebentar.
          </h2>
          <p className="mb-2">
            Buka setiap hari 07.00–16.00. Espresso, seduh manual, pastry
            hangat, dan tempat yang cukup luas untuk menikmati pagi pelan-pelan.
          </p>
          <p className="text-sm mb-6">Jl. Contoh No. 17 · Kotamu</p>
          <Link
            href="/about"
            className="inline-block bg-[#18181B] text-[#F2F2F0] px-6 py-3 text-sm w-fit hover:bg-[#18181B]/90 transition-colors"
          >
            Cerita Kami
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}