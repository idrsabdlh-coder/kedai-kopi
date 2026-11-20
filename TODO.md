# TODO & Catatan Perubahan — Kedai Kopi (`coffee-shop-app`)

Dokumen ini mencatat seluruh perbaikan yang sudah dikerjakan serta daftar tugas lanjutan sebelum deployment ke produksi.

---

## Catatan Perubahan & Perbaikan (2026-11-20)

### 1. Routing, Halaman & UI
- [x] **Buat halaman detail produk** (`app/product/[slug]/page.tsx`) agar klik kartu produk tidak lagi 404 dan tombol **Tambah ke Keranjang** (`components/product/AddToCartButton.tsx`) dapat digunakan.
- [x] **Perbaiki query produk & order berdasarkan slug/UUID** (`lib/db.ts`) agar slug/ID non-UUID tidak memicu error `invalid input syntax for type uuid` dari PostgreSQL.
- [x] **Buat halaman 404 sesuai tema gelap** (`app/not-found.tsx`).
- [x] **Perbaiki Navbar & navigasi mobile** (`components/layout/Navbar.tsx`): tambah tombol menu mobile dan badge jumlah item keranjang secara real-time.
- [x] **Lengkapi layout halaman keranjang** (`app/cart/page.tsx`) dengan `<Navbar />` dan `<Footer />`, serta arahkan CTA keranjang kosong ke `/shop`.
- [x] **Fungsikan form newsletter di Footer** (`components/layout/NewsletterForm.tsx`, `components/layout/Footer.tsx`) agar submit menampilkan pesan konfirmasi tanpa me-reload halaman.
- [x] **Perbaiki font typography** (`app/globals.css`, `app/layout.tsx`): sambungkan `--font-sans` ke `--font-body` (`Inter`) dan `--font-display` (`Fraunces`), serta ubah `lang="id"`.
- [x] **Rapikan copy halaman publik** (`app/coffee/page.tsx`, `app/about/page.tsx`) dari teks template placeholder `[...]`.
- [x] **Optimasi gambar dengan `next/image`** di semua halaman & komponen, serta perluas `remotePatterns` di `next.config.ts` menjadi `**.supabase.co`.
- [x] **Hapus komponen legacy tidak terpakai** (`app/checkout/CheckoutForm.tsx`).
- [x] **Paralelkan query Supabase di `/shop`** (`app/shop/page.tsx`) menggunakan `Promise.all` agar lebih cepat.

### 2. State Keranjang, Build & Stabilitas
- [x] **Perbaiki error ESLint `react-hooks/set-state-in-effect`** di `lib/cart-context.tsx` menggunakan `useSyncExternalStore` (bebas hydration mismatch dan sinkron antar-tab).
- [x] **Perbaiki `npm run build` yang gagal prerender `/`** dengan menambahkan `export const dynamic = 'force-dynamic'` dan penanganan error database yang aman di `app/page.tsx`, `app/shop/page.tsx`, `app/product/[slug]/page.tsx`, dan `app/sukses/page.tsx`.
- [x] **Tambah template environment** (`.env.example`) dan perbarui `.gitignore` (`!.env.example`) sambil menjaga `.env.local` tetap ter-ignore.

### 3. Keamanan, Checkout, Midtrans & Panel Admin
- [x] **Amankan `GET /api/admin/orders`** (`app/api/admin/orders/route.ts`) dengan verifikasi Bearer token Supabase dan `user_metadata.role === 'admin'`.
- [x] **Hapus kebocoran log secret & debug** di `lib/supabase-admin.ts` dan `app/admin/orders/page.tsx`.
- [x] **Perbaiki alur login & panel admin** (`app/admin/login/page.tsx`, `app/admin/orders/page.tsx`, `app/api/admin/orders/[id]/status/route.ts`):
  - Tolak akun non-admin saat login dengan pesan jelas.
  - Fetch pesanan hanya setelah role admin terverifikasi.
  - Tangani error response agar state tidak crash.
  - Tambah badge `payment_status` dan tombol **Keluar**.
  - Validasi nilai `status` dan bungkus pengiriman email agar gagal kirim email tidak menggagalkan update status pesanan.
- [x] **Perkuat keamanan & ketahanan email** (`lib/email.ts`): escape HTML input pelanggan dan cek error dari Resend SDK.
- [x] **Verifikasi harga di server saat checkout** (`app/api/checkout/route.ts`): validasi kuantitas integer positif dan hitung `total_amount` langsung dari tabel `products`.
- [x] **Perbaiki alur pembayaran Midtrans** (`app/checkout/page.tsx`, `app/api/midtrans/create-transaction/route.ts`, `app/api/midtrans/notification/route.ts`):
  - Cegah duplikasi order saat pelanggan menutup popup Snap lalu mencoba bayar ulang.
  - Cegah transaksi ganda pada pesanan yang sudah `paid`.
  - Guard jika env Midtrans belum dikonfigurasi.
  - Verifikasi signature webhook memakai `crypto.timingSafeEqual`.
- [x] **Validasi input `POST /api/cart`** (`app/api/cart/route.ts`).

---

## TODO Lanjutan (Perlu Dilengkapi Sebelum Live / Deploy)

### 1. Konfigurasi Supabase (Prioritas Utama)
- [ ] Pulihkan project Supabase yang paused atau buat project Supabase baru (host lama `aqzlhrffdgsfwbyzqqus.supabase.co` saat ini `ENOTFOUND`).
- [ ] Perbarui `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` di `.env.local` (dan di dashboard hosting seperti Vercel).
- [ ] Pastikan tabel database berikut tersedia di Supabase:
  - `products` (`id`, `slug`, `name`, `description`, `price`, `image_url`, `category`, `is_available`, `stock`, `created_at`)
  - `orders` (`id`, `user_id`, `status`, `total_amount`, `midtrans_order_id`, `snap_token`, `payment_status`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `notes`, `created_at`)
  - `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`)
  - `cart_items` (`id`, `session_id`, `product_id`, `quantity`)
- [ ] Isi data produk awal di tabel `products` dan pastikan bucket Storage untuk foto produk bersifat publik.
- [ ] Buat/reset akun admin di **Supabase Auth → Users** dan set `raw_user_meta_data` ke `{"role": "admin"}`.

### 2. Konfigurasi Midtrans
- [ ] Tambahkan `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`, dan `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` ke `.env.local` dan environment production.
- [ ] Atur Payment Notification URL di dashboard Midtrans ke `https://<domain-anda>/api/midtrans/notification`.
- [ ] Uji alur transaksi lengkap di mode Sandbox (`NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false`) sampai webhook mengubah `payment_status` menjadi `paid` dan `status` menjadi `processing`.

### 3. Konfigurasi Email (Resend) & Konten Kedai
- [ ] Verifikasi domain pengirim di Resend dan ganti alamat `from` di `lib/email.ts` dari `onboarding@resend.dev` ke domain sendiri agar bisa mengirim email ke semua pelanggan.
- [ ] Sesuaikan alamat kedai (`Jl. Contoh No. 17 · Kotamu`), jam operasional, dan cerita tim di `app/page.tsx` dan `app/about/page.tsx` dengan data kedai asli.
- [ ] (Opsional) Hubungkan `components/layout/NewsletterForm.tsx` ke tabel Supabase/layanan newsletter agar email pelanggan benar-benar tersimpan.
