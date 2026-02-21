# Point of Sale (POS) System

![Laravel](https://img.shields.io/badge/laravel-%23FF2D20.svg?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

Sistem Point of Sale (Kasir) terintegrasi yang dibangun dengan arsitektur modern memisahkan antara **Frontend** dan **Backend** untuk performa dan skalabilitas yang lebih baik.

## ✨ Fitur Utama

*   **Dashboard Real-time:** Ringkasan penjualan dan stok barang.
*   **Manajemen Produk:** Kelola kategori, harga, dan stok barang.
*   **Transaksi Penjualan:** Antarmuka kasir yang responsif dan cepat.
*   **Laporan Penjualan:** Export laporan ke format PDF atau Excel.
*   **Manajemen User:** Pengaturan hak akses (RBAC).
*   **Cetak Struk:** Integrasi pencetakan struk belanja.

## 🚀 Teknologi Utama

* **Frontend:** [React.js](https://reactjs.org/) (Hooks, Functional Components)
* **Backend:** [Laravel](https://laravel.com/) (RESTful API)
* **Database:** MySQL
* **Authentication:** Laravel Sanctum / JWT (opsional sesuai setup Anda)

---

## 👥 Manajemen Hak Akses (Roles)

Aplikasi ini mendukung multi-user dengan hak akses yang berbeda:

| Role | Deskripsi Singkat |
| :--- | :--- |
| **Admin** | Manajemen user (tambah/edit/hapus), pengaturan sistem, dan kontrol penuh data master. |
| **Manager** | Memantau laporan penjualan harian/bulanan, stok barang, dan analisis performa. |
| **Cashier** | Fokus pada antarmuka transaksi penjualan dan cetak struk pelanggan. |

---

## 📂 Struktur Folder

```text
point-of-sale/
├── backend/       # Source code Laravel (API)
├── frontend/      # Source code React.js (UI)
└── README.md      # Dokumentasi utama
```

---

🛠️ Panduan Instalasi

### Prasyarat
* PHP >= 8.1
* Composer
* Node.js >= 16.x & NPM
* MySQL / MariaDB
* Web Browser (Chrome/Edge/Firefox)

### 1. Setup Backend (Laravel)
Buka terminal dan masuk ke folder: `cd backend`

* Install dependencies:
  ```bash
  composer install
  ```
* Salin file environment:
  ```bash
  cp .env.example .env
  ```
* Lakukan konfigurasi database pada file `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
* Generate application key:
  ```bash
  php artisan key:generate
  ```
* Jalankan migrasi database beserta data awal (seed):
  ```bash
  php artisan migrate --seed
  ```
* Jalankan server:
  ```bash
  php artisan serve
  ```

### 2. Setup Frontend (React)
Buka terminal baru dan masuk ke folder: `cd frontend`

* Install dependencies:
  ```bash
  npm install
  ```
* Buat file `.env` di folder frontend dan arahkan URL API ke Laravel:
  ```env
  REACT_APP_API_URL=http://127.0.0.1:8000/api
  ```
* Jalankan aplikasi:
  ```bash
  npm start
  ```

---

## 📝 Catatan Penting
* Pastikan server **Backend** berjalan sebelum menjalankan **Frontend**.
* Gunakan akun default dari database seeder untuk login pertama kali sesuai role yang diinginkan.
* Project ini dikembangkan untuk kebutuhan manajemen toko yang efisien.