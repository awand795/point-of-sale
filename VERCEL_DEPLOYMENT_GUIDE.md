# Panduan Deployment Vercel & Konfigurasi Supabase

Dokumen ini berisi panduan lengkap untuk mengatur Environment Variables (ENV) di Vercel agar Frontend (React) dan Backend (Laravel) dapat terhubung dengan sempurna menggunakan database Supabase.

---

## 1. Konfigurasi Backend (Laravel API)
Buka Dashboard Vercel untuk project Backend Anda. Buka menu **Settings > Environment Variables**, dan tambahkan data berikut:

| Key | Value | Keterangan / Sumber |
| :--- | :--- | :--- |
| `APP_KEY` | `base64:...` | **WAJIB:** Copy dari file `pos-system/.env` di komputer Anda |
| `APP_ENV` | `production` | Ketik manual |
| `APP_DEBUG` | `false` | Ketik manual |
| `APP_URL` | `https://[nama-backend].vercel.app` | URL Vercel untuk Backend Anda |
| `DB_CONNECTION` | `pgsql` | Ketik manual |
| `DB_HOST` | `aws-0-ap-...` | Dashboard Supabase > Project Settings > Database |
| `DB_PORT` | `5432` | Default Supabase |
| `DB_DATABASE` | `postgres` | Default Supabase |
| `DB_USERNAME` | `postgres` | Default Supabase |
| `DB_PASSWORD` | `[password-anda]` | Password database yang Anda buat di Supabase |
| `DB_SCHEMA` | `laravel` | Ketik manual (Sesuai konfigurasi aman Supabase) |
| `LOG_CHANNEL` | `stderr` | Ketik manual (Agar log terbaca di Vercel) |
| `SESSION_DRIVER` | `cookie` | Ketik manual (Vercel serverless environment) |
| `CACHE_STORE` | `array` | Ketik manual (Vercel serverless environment) |

---

## 2. Konfigurasi Frontend (React/Vite)
Buka Dashboard Vercel untuk project Frontend Anda. Buka menu **Settings > Environment Variables**, dan tambahkan data berikut:

| Key | Value | Keterangan / Sumber |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://[nama-backend].vercel.app/api` | **WAJIB:** URL backend Vercel ditambah `/api` di akhirnya |
| `VITE_SUPABASE_URL` | `https://[project-ref].supabase.co` | Dashboard Supabase > Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhb...` | Dashboard Supabase > Project Settings > API |

---

## 3. Langkah Penting di Supabase (SQL Editor)
Karena Laravel menggunakan skema khusus (`laravel`) untuk menghindari konflik dengan public API Supabase, Anda wajib membuat skema ini sebelum aplikasi dijalankan.

1. Buka Dashboard Supabase.
2. Masuk ke menu **SQL Editor**.
3. Jalankan query berikut:
   ```sql
   CREATE SCHEMA IF NOT EXISTS laravel;
   ```

---

## 4. Finalisasi (Redeploy)
Setelah Anda memasukkan semua variabel di atas ke Vercel:

1. Di Vercel, masuk ke tab **Deployments** (lakukan untuk Frontend maupun Backend).
2. Klik tombol tiga titik (`...`) pada deployment terbaru.
3. Pilih **Redeploy**.
4. Proses build akan berjalan ulang dan otomatis menggunakan variabel yang baru saja Anda masukkan.

Aplikasi LuxePOS Enterprise Anda sekarang sudah berjalan penuh di cloud!
