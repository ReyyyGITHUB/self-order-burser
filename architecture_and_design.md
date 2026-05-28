# Architecture & Design — BurserOrder

Dokumen ini mendokumentasikan spesifikasi arsitektur, desain sistem, aliran data, serta strategi pengembangan end-to-end untuk sistem **BurserOrder** (Self-Order & POS Burjo Semarang).

---

## 🗺️ 1. Planning & Design

### Sitemap & Screen Map
Sistem terbagi menjadi 2 area fungsional utama:

```
[BurserOrder System]
 ├── Sisi Pelanggan (Mobile-First, Tanpa Login)
 │    ├── /table/[id] ➔ Landing & Menu Utama
 │    ├── [Detail Dialog] ➔ Kustomisasi Menu (Pedas, Catatan, Qty)
 │    ├── /cart ➔ Keranjang Belanja & Input Nama Pemesan
 │    ├── /payment/[id] ➔ Halaman Bayar (Instruksi QRIS Dinamis)
 │    └── /order-status/[id] ➔ Tracker Status Pesanan Realtime
 │
 └── Sisi Internal Burjo (Desktop-First, Login Staff/Admin)
      ├── /login ➔ Pintu Masuk Staff
      ├── /kasir ➔ POS Layar Kasir Realtime (Daftar Antrean & Input Manual)
      ├── /admin/dashboard ➔ Dashboard Owner & Analitik Penjualan
      ├── /admin/menu ➔ Manajemen Menu & Toggle Ketersediaan Stok (Manual)
      └── /admin/tables ➔ Setup Nomor Meja & Cetak QR Code
```

### Mekanisme Manajemen Stok (Stok Manual)
- Guna mempermudah operasional burjo di lapangan, pengelolaan stok tidak menggunakan kalkulasi bahan baku otomatis (Realtime Inventory) melainkan berbasis **Toggle Ketersediaan Manual**.
- Ketika bahan di dapur habis, koki menginformasikan ke Kasir/Admin.
- Admin/Kasir membuka halaman `/admin/menu` dan mematikan switch ketersediaan item tersebut (`isAvailable = false`). Menu otomatis hilang dari halaman Self-Order pelanggan secara realtime.

---

## 🎨 2. Frontend Design

### Tech Stack & Framework UI
- **Pondasi:** Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Komponen UI:** **Shadcn/ui** (sebagai basis komponen yang cepat, bersih, accessible, dan modular).
- **Strategi Rendering (Next.js):**
  - **Static / Server Components (Publik):** Halaman menu utama `/table/[id]` memanfaatkan Server Components untuk render cepat saat di-scan oleh pelanggan.
  - **Dynamic / Client Components (Interactive):** Halaman Keranjang `/cart`, Kasir `/kasir`, dan halaman Dashboard menggunakan Client Components karena butuh state manajemen lokal dan integrasi WebSocket realtime.

---

## ⚙️ 3. Backend Architecture

### API & Data Logic
- **Next.js Route Handlers (API Routes):** Digunakan sebagai standar komunikasi RESTful terpusat (berlokasi di `src/app/api/...`).
- **ORM Prisma:** Digunakan untuk query database PostgreSQL Supabase dengan skema relasi type-safe.
- **Supabase Engine:**
  - **Auth:** Mengamankan area kasir dan admin.
  - **Realtime (Websockets):** Mendeteksi order baru secara instan di sisi POS Kasir tanpa intervensi polling API.

---

## 🔌 4. Integration

### Integrasi Pembayaran (Webhook Terintegrasi)
- Sistem pembayaran menggunakan **Payment Gateway (PG)** custom yang disediakan developer.
- **Mekanisme Webhook:**
  1. Pelanggan memilih metode bayar QRIS.
  2. Sistem Next.js meminta token/QR dinamis ke API PG.
  3. Layar pembayaran menampilkan QR dinamis.
  4. Begitu pelanggan sukses bayar, server PG menembak Webhook API route `/api/webhooks/payment` di sistem BurserOrder.
  5. Webhook memverifikasi signature PG ➔ update status transaksi di database dari `UNPAID` ke `PAID` ➔ memicu realtime update untuk menampilkan pesanan di antrean Kasir.

---

## 🚀 5. Deployment

### Strategi Deployment Lokal
- **Target:** Server Lokal (PC Kasir) di lokasi Burjo.
- **Eksekusi:** Dijalankan langsung melalui terminal lokal menggunakan command standard `npm run dev` / `npm run start` dengan auto-start script saat komputer dinyalakan.
- Database PostgreSQL tetap dihosting di cloud (Supabase) untuk sinkronisasi data analitik owner, sehingga PC Kasir hanya berfungsi sebagai host aplikasi lokal dengan latensi minimal.

---

## 🧪 6. Testing

### Pengujian Realtime & Multi-User
- **Tools:** **Playwright** / **Cypress** untuk end-to-end (E2E) testing.
- **Skenario Otomatis:**
  1. Jalankan instansi virtual Pelanggan dan Kasir secara bersamaan.
  2. Pelanggan memesan dan menembak transaksi tiruan.
  3. Memastikan pesanan muncul di monitor kasir secara realtime (di bawah 1 detik).
  4. Menembak payload webhook PG sukses dan memastikan status berubah otomatis.

---

## 🛡️ 7. Maintenance & Resilience

### Offline Resilience (Penanganan Gangguan Jaringan)
- Mengingat koneksi internet di lapangan burjo rawan tidak stabil:
  - **UI Deteksi Offline:** Menggunakan event listener browser (`navigator.onLine`).
  - **Graceful Fallback:** Jika koneksi ke Supabase terputus, aplikasi langsung memunculkan UI "Sistem Sedang Offline - Silakan Pesan Langsung ke Kasir".
  - **POS Cash Recovery:** Menyediakan menu pencatatan offline cadangan di sisi Kasir untuk input order manual secara darurat.
