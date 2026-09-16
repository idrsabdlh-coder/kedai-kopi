import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function CoffeePage() {
  return (
    <main className="min-h-screen bg-[#18181B] text-[#F2F2F0]">
      <Navbar />

      {/* Hero */}
      <section className="px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] overflow-hidden order-2 md:order-1">
          <img
            src="/images/kopi.avif"
            alt="Proses menyeduh kopi"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-4">
            RACIK KECIL-KECILAN
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold leading-tight mb-6">
            Kami roasting demi rasa manis, bukan kebisingan.
          </h1>
          <p className="text-[#F2F2F0]/70 text-lg mb-8 max-w-md">
            Setiap kopi punya profil sendiri. Kami kerja dalam batch kecil,
            mencari titik saat rasa buah, manis, dan struktur jadi jelas —
            tanpa kehilangan cerita dari kebunnya.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#F2F2F0] text-[#18181B] px-6 py-3 text-sm font-medium hover:bg-[#F2F2F0]/90 transition-colors"
          >
            Lihat Menu Kopi
          </Link>
        </div>
      </section>

      {/* Sourcing + statistik */}
      <section className="px-6 md:px-12 py-24 bg-[#232326]">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-2">
          SUMBER YANG JELAS
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-4 max-w-lg">
          Bukan sekadar nama negara asal.
        </h2>
        <p className="text-[#F2F2F0]/60 max-w-md mb-12">
          {/* GANTI dengan cerita asli soal dari mana kamu ambil biji kopi */}
          [Ceritakan di sini bagaimana kamu memilih pemasok biji kopi —
          langsung dari petani, importir tepercaya, atau lainnya.]
        </p>

        <div className="grid md:grid-cols-[1fr_320px] gap-8 mb-16">
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src="/images/kopi.avif"
              alt="Petani kopi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-[#18181B] p-8 flex flex-col justify-center">
            <p className="text-[#D65A3A] text-3xl font-[family-name:var(--font-display)] mb-4">
              01
            </p>
            <h3 className="font-medium text-lg mb-2">
              {/* GANTI judul poin ini */}
              Hubungan jangka panjang
            </h3>
            <p className="text-sm text-[#F2F2F0]/60">
              {/* GANTI deskripsi ini */}
              [Jelaskan nilai atau prinsip sourcing kamu di sini.]
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 border-t border-[#F2F2F0]/10 pt-10">
          {/* GANTI ketiga angka ini dengan data asli kamu, atau hapus section ini kalau belum punya angka pasti */}
          {[
            { number: '—', label: 'Mitra petani/pemasok' },
            { number: '—', label: 'Dibeli lewat hubungan langsung' },
            { number: '—', label: 'Dibanding harga pasar umum' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-[family-name:var(--font-display)] text-4xl mb-2">
                {stat.number}
              </p>
              <p className="text-sm text-[#F2F2F0]/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profil roast */}
      <section className="px-6 md:px-12 py-24">
        <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
          ROASTING SEBAGAI TERJEMAHAN
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold mb-16 max-w-lg">
          Tiga profil, satu niat: menjaga rasa tetap jelas.
        </h2>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#F2F2F0]/10">
          {[
            {
              level: 'Light',
              desc: 'Floral, dominan rasa buah, seperti teh. Cocok kalau kamu ingin karakter asal kopinya bicara duluan.',
              link: 'Coba · Morning Bell',
            },
            {
              level: 'Medium',
              desc: 'Karamel, buah matang, body seimbang. Profil harian kami yang paling ramah di lidah.',
              link: 'Coba · Night Bloom',
            },
            {
              level: 'Dark',
              desc: 'Cokelat, molasses, asam rendah. Dirancang tetap ekspresif dipakai dengan susu atau es.',
              link: 'Coba · Daybreak',
            },
          ].map((p) => (
            <div key={p.level} className="p-6 md:px-8 md:py-0">
              <h3 className="font-[family-name:var(--font-display)] text-2xl mb-4">
                {p.level}
              </h3>
              <p className="text-sm text-[#F2F2F0]/60 mb-4">{p.desc}</p>
              <Link
                href="/shop"
                className="text-xs tracking-[0.1em] text-[#D65A3A] underline underline-offset-4"
              >
                {p.link.toUpperCase()}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Panduan seduh */}
      <section className="px-6 md:px-12 py-24 bg-[#232326]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#D65A3A] font-medium mb-3">
              BERGUNA, BUKAN RIBET
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold max-w-lg">
              Mulai dari sini. Sesuaikan seleramu.
            </h2>
          </div>
          <p className="text-sm text-[#F2F2F0]/60 max-w-xs">
            Tiap dapur beda-beda. Resep ini titik awal yang bisa diandalkan, bukan aturan baku.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              method: 'Pour over',
              ratio: '20 G KOPI · 320 G AIR · 3:00',
              desc: 'Bloom dengan 60 g air selama 40 detik. Tuang perlahan dalam dua tahap, jaga permukaan tetap rata.',
            },
            {
              method: 'French press',
              ratio: '30 G KOPI · 500 G AIR · 4:30',
              desc: 'Tuang semua air sekaligus, aduk satu kali, diamkan. Pecah lapisan atas di menit keempat, lalu tekan perlahan.',
            },
            {
              method: 'Cold brew',
              ratio: '100 G KOPI · 700 G AIR · 14 JAM',
              desc: 'Rendam gilingan kasar semalaman di kulkas. Saring bersih, sajikan dengan perbandingan 1:1 air.',
            },
          ].map((m) => (
            <div key={m.method} className="bg-[#18181B] p-6">
              <h3 className="font-[family-name:var(--font-display)] text-xl mb-3">
                {m.method}
              </h3>
              <p className="text-xs tracking-[0.1em] text-[#D65A3A] font-medium mb-4">
                {m.ratio}
              </p>
              <p className="text-sm text-[#F2F2F0]/60">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section aksen warna penutup */}
      <section className="grid md:grid-cols-2 bg-[#D65A3A] text-[#18181B]">
        <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src="/images/kopi.avif"
            alt="Kopi dengan latte art"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 md:px-12 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold mb-4">
            Temukan profil yang cocok untuk pagimu.
          </h2>
          <p className="mb-6">
            Beberapa pilihan kopi, dijelaskan dengan jujur dan diracik rutin tiap minggu.
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