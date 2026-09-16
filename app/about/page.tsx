import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      {/* Hero dengan foto besar */}
      <section className="relative min-h-[600px] flex items-end px-6 md:px-12 pb-24 pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/images/toko.avif')" }}
        />
        <div className="relative max-w-lg">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            KEDAI KOPI · KOTAMU
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Dibuat untuk bagian pagi yang santai.
          </h1>
          <p className="text-[#F2F2F0]/70 text-lg max-w-md">
            Kami memulai kedai ini supaya kopi yang enak terasa lebih
            berguna, lebih ramah, dan tidak ribet.
          </p>
        </div>
      </section>

      {/* Kenapa kami ada */}
      <section className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
            KENAPA KAMI ADA
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold leading-tight">
            Serius soal kopi. Santai soal yang lain.
          </h2>
        </div>
        <div className="space-y-4 text-[#F2F2F0]/70">
          <p>
            Secangkir kopi menyimpan banyak sekali proses: musim tanam,
            pengolahan yang hati-hati, perjalanan panjang, roasting yang
            presisi, sampai akhirnya diseduh dalam beberapa menit yang tenang.
          </p>
          <p>
            Kami menghargai semua proses itu tanpa perlu dibuat berlebihan.
            Tugas kami menjaga detail yang berguna, membuang istilah yang
            bikin bingung, dan memastikan secangkir kopi terasa mudah untuk
            terus didatangi.
          </p>
          <p className="italic text-[#F2F2F0]/80">
            Kopi untuk besok pagi, dan pagi-pagi setelahnya.
          </p>
        </div>
      </section>

      {/* Foto + tim */}
      <section className="grid md:grid-cols-2">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src="/images/seduhan.avif"
            alt="Proses roasting kopi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-[#232326] flex flex-col justify-center px-6 md:px-12 py-16">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
            TIM KECIL, TELITI
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-6">
            Cukup dekat untuk memperhatikan detail.
          </h2>
          <p className="text-[#F2F2F0]/70">
            {/* GANTI dengan nama & peran tim kamu yang sebenarnya */}
            [Sebutkan nama & peran singkat tim kamu di sini — misalnya siapa
            yang meracik, siapa yang menjaga kedai sehari-hari.]
          </p>
        </div>
      </section>

      {/* Tiga keyakinan */}
      <section className="px-6 md:px-12 py-24">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
          YANG MEMANDU KERJA KAMI
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-16 max-w-lg">
          Beberapa keyakinan yang kami pegang.
        </h2>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F2F2F0]/10">
          {[
            {
              n: '01',
              title: 'Jelas, bukan rumit',
              desc: 'Ceritakan ke pelanggan rasa kopinya seperti apa, dari mana asalnya, dan cara menyeduhnya di rumah.',
            },
            {
              n: '02',
              title: 'Perhatian harus kelihatan',
              desc: 'Tanggal roasting yang jujur, pelayanan yang tulus, kemasan yang rapi, dan kedai yang bersih — semua bagian dari janji yang sama.',
            },
            {
              n: '03',
              title: 'Layak untuk didatangi lagi',
              desc: 'Yang baru itu gampang. Kepercayaan datang dari secangkir kopi, tempat, dan pengalaman yang konsisten tiap minggu.',
            },
          ].map((item) => (
            <div key={item.n} className="p-6 md:px-8 md:py-0">
              <p className="text-[#D65A3A] text-3xl font-[family-name:var(--font-display)] mb-4">
                {item.n}
              </p>
              <h3 className="font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-[#F2F2F0]/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proses 4 langkah */}
      <section className="px-6 md:px-12 py-24 bg-[#232326]">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
          SATU PROSES YANG SALING TERHUBUNG
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-16">
          Tidak ada yang berdiri sendiri.
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-[#F2F2F0]/10">
          {[
            { n: '01', title: 'Sumber', desc: 'Membangun hubungan dan membeli kopi dengan konteks yang jelas.' },
            { n: '02', title: 'Roasting', desc: 'Mencari profil yang menjaga karakter asli kopinya tetap utuh.' },
            { n: '03', title: 'Seduh', desc: 'Kasih titik awal yang jelas, lalu biarkan disesuaikan seleranya.' },
            { n: '04', title: 'Bagikan', desc: 'Membuat kedai dan tiap pesanan terasa hangat dan manusiawi.' },
          ].map((step) => (
            <div key={step.n} className="p-6 md:px-8 md:py-0">
              <p className="text-xs text-[#D65A3A] font-medium mb-3">{step.n}</p>
              <h3 className="font-[family-name:var(--font-display)] text-xl mb-2">{step.title}</h3>
              <p className="text-sm text-[#F2F2F0]/60">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lokasi - section hijau */}
      <section className="grid md:grid-cols-2 bg-[#93A688] text-[#18181B]">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src="/images/nongkrong.avif"
            alt="Interior kedai"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 md:px-12 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-4">
            Ruang tetangga dengan kopi yang benar-benar enak.
          </h2>
          <p className="mb-6">
            {/* GANTI dengan alamat & jam operasional asli kamu */}
            Jl. Contoh No. 17, Kotamu. Buka setiap hari dari jam 07.00 sampai 16.00.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#18181B] text-[#F2F2F0] px-6 py-3 text-sm w-fit hover:bg-[#18181B]/90 transition-colors"
          >
            Lihat Menu
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}