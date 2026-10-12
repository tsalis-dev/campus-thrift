# Campus Thrift - Mobile App & RESTful API

[![React Native](https://img.shields.io/badge/React%20Native-0.77.0-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.13.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

> **Showcase Proyek Akhir FullStack JavaScript & Tugas Mata Kuliah Mobile Programming (Semester 5)**

![Campus Thrift Showcase](campus_thrift_showcase.jpg)

---

## Tentang Aplikasi

**Campus Thrift** adalah platform *marketplace secondhand* berbasis mobile yang dirancang khusus untuk memfasilitasi mahasiswa dalam jual-beli dan tukar perlengkapan kuliah bekas (seperti buku teks kuliah, kalkulator saintifik, gadget, hingga peralatan kos).

Aplikasi ini mengintegrasikan **RESTful API Backend** menggunakan **Express.js & Prisma ORM** dengan antarmuka mobile modern menggunakan **React Native**, memungkinkan mahasiswa untuk:
- Menjelajahi katalog barang thrift mahasiswa kampus secara real-time.
- Mengunggah barang thrift baru beserta foto asli dari galeri, judul, harga, dan kontak WhatsApp.
- Memperbarui deskripsi, harga, maupun mengganti foto barang.
- Menghapus data barang yang sudah laku terjual.

---

## Tech Stack & Arsitektur

```
┌─────────────────────────────────┐
│     React Native (Mobile UI)    │
│  Native Stack, Axios, ImgPicker │
└────────────────┬────────────────┘
                 │ HTTP (RESTful JSON / FormData)
┌────────────────▼────────────────┐
│   Backend Express.js Server     │
│   Multer Upload & Validator     │
└────────────────┬────────────────┘
                 │ Prisma Client
┌────────────────▼────────────────┐
│      MySQL Database Engine      │
└─────────────────────────────────┘
```

### 1. Backend
* **Runtime:** Node.js
* **Framework:** Express.js 4.19.2
* **ORM:** Prisma 5.13.0
* **Database:** MySQL
* **File Upload:** Multer (penyimpanan disk gambar dengan enkripsi nama file crypto)
* **Validasi Input:** Express-Validator

### 2. Frontend Mobile
* **Framework:** React Native 0.77.0
* **Navigasi:** `@react-navigation/native` & `@react-navigation/native-stack`
* **HTTP Client:** Axios 1.7.9 (dukungan multipart/form-data)
* **Media Picker:** `react-native-image-picker`
* **Styling:** React Native StyleSheet (Clean & Responsive Modern UI)

---

## Skema Database (Prisma ORM)

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  image     String
  title     String?
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

* **`image`**: Nama file foto produk yang tersimpan di direktori server `/uploads`.
* **`title`**: Nama barang dan informasi harga (misal: *"Buku Kalkulus Purcell Edisi 9 - Rp 45.000"*).
* **`content`**: Deskripsi kondisi barang, lokasi COD di lingkungan kampus, dan nomor kontak WhatsApp mahasiswa.

---

## Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi | Request Body / Payload |
|---|---|---|---|
| `GET` | `/api/posts` | Mengambil seluruh katalog barang thrift | None |
| `POST` | `/api/posts` | Mengunggah barang thrift baru | `multipart/form-data`: `image`, `title`, `content` |
| `GET` | `/api/posts/:id` | Mengambil detail spesifik barang thrift | None |
| `PUT` | `/api/posts/:id` | Memperbarui data/foto barang thrift | `multipart/form-data`: `image` (opsional), `title`, `content` |
| `DELETE`| `/api/posts/:id` | Menghapus barang & menghapus file gambar | None |
| `GET` | `/uploads/:filename` | Menyajikan aset foto barang | Static File Serve |

---

## Panduan Menjalankan Proyek

### 1. Menjalankan Backend (Express.js)
1. Buka MySQL di server lokal Anda (misal via Laragon atau XAMPP).
2. Buat database baru bernama `db_campus_thrift`:
   ```sql
   CREATE DATABASE db_campus_thrift;
   ```
3. Masuk ke folder backend:
   ```bash
   cd backend-express
   ```
4. Sesuaikan file `.env`:
   ```env
   PORT=3000
   DATABASE_URL="mysql://root:@localhost:3306/db_campus_thrift"
   ```
5. Jalankan migrasi Prisma untuk membuat tabel secara otomatis:
   ```bash
   npx prisma migrate dev --name init
   ```
6. Jalankan server:
   ```bash
   npm run dev
   # Server berjalan di http://localhost:3000
   ```

### 2. Menjalankan Mobile App (React Native)
1. Masuk ke folder frontend:
   ```bash
   cd frontend-reactnative
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi file `.env` dengan IP komputer Anda:
   ```env
   BACKEND_API_URL=http://10.0.2.2:3000  # untuk Android Emulator
   # atau BACKEND_API_URL=http://192.168.x.x:3000 untuk HP fisik
   ```
4. Jalankan aplikasi:
   ```bash
   npm start
   # Tekan 'a' untuk Android
   ```

---

## Kontributor
* **Mata Kuliah:** Mobile Programming (Semester 5)
* **Program:** FullStack JavaScript Developer dengan Express dan React Native (SantriKoding)
