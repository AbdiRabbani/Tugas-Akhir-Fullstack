# 🍳 Rahasia Dapur

Aplikasi resep masakan khusus untuk ibu-ibu PKK. Dibangun dengan **Node.js**, **React**, dan **React Native**.

## 📁 Struktur Proyek

```
rahasia-dapur/
├── database/          # Backend API (Express.js + MongoDB)
│   ├── models/        # Schema MongoDB (User, Recipe)
│   ├── routes/        # API routes (auth, recipes)
│   ├── middleware/     # JWT auth middleware
│   ├── seed.js        # Seeder data awal
│   ├── server.js      # Entry point
│   └── .env.example   # Template konfigurasi environment
├── website/           # Frontend Web (React + Vite)
│   └── src/
│       ├── pages/     # Home, Login, Register, RecipeDetail
│       └── api.js     # Axios instance
└── mobile/            # Mobile App (React Native + Expo)
    └── src/
        ├── screens/   # HomeScreen, LoginScreen, dll
        └── api.js     # Axios instance
```

## ⚙️ Prasyarat

Pastikan sudah terinstall di komputer kamu:

| Software | Version | Link Download |
|----------|---------|--------------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| MongoDB | v6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git | Terbaru | [git-scm.com](https://git-scm.com/) |
| Expo Go (HP) | Terbaru | [App Store](https://apps.apple.com/app/expo-go/id982107779) / [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |

> **Catatan:** MongoDB harus dalam keadaan **running** sebelum menjalankan backend. Kalau pakai Windows, pastikan service MongoDB sudah aktif.

---

## 🚀 Cara Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/rahasia-dapur.git
cd rahasia-dapur
```

---

### 2. Setup Backend

```bash
cd database
npm install
```

**Konfigurasi Environment:**

```bash
# Copy template environment
cp .env.example .env
```

> **Di Windows (CMD):** pakai `copy .env.example .env`
> **Di Windows (PowerShell):** pakai `Copy-Item .env.example .env`

Buka file `database/.env` dan isi variabelnya:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/moms_receipe
JWT_SECRET=buat_secret_key_random_kamu_disini
UNSPLASH_ACCESS_KEY=isi_dengan_unsplash_access_key
```

| Variable | Keterangan | Wajib? |
|----------|-----------|--------|
| `PORT` | Port server backend | ✅ (default: 5000) |
| `MONGO_URI` | Connection string MongoDB | ✅ |
| `JWT_SECRET` | Secret key untuk token autentikasi (bebas, minimal 20 karakter) | ✅ |
| `UNSPLASH_ACCESS_KEY` | API key dari Unsplash untuk gambar resep | ❌ Opsional |

> **📌 Cara dapat Unsplash API Key (opsional):**
> 1. Daftar gratis di [unsplash.com/developers](https://unsplash.com/developers)
> 2. Klik "New Application" → setujui terms → buat app
> 3. Copy **Access Key** → paste di `.env`
>
> Tanpa key ini, aplikasi **tetap berjalan normal** — hanya gambar resep yang tidak akan muncul.

**Isi data awal (seeder):**

```bash
npm run seed
```

**Jalankan backend server:**

```bash
# Production
npm start

# Development (auto-restart saat file berubah)
npm run dev
```

✅ Kalau berhasil, akan muncul:
```
✅ Berhasil konek ke MongoDB
🚀 Server jalan di http://localhost:5000
```

---

### 3. Setup Website

> ⚠️ Pastikan backend sudah jalan di `http://localhost:5000` sebelum menjalankan website.

Buka terminal baru:

```bash
cd website
npm install
npm run dev
```

✅ Website berjalan di `http://localhost:5173`

Buka browser → akses `http://localhost:5173` → daftar akun baru → mulai jelajahi resep!

---

### 4. Setup Mobile App

> ⚠️ Pastikan backend sudah jalan dan HP terhubung ke **WiFi yang sama** dengan komputer.

Buka terminal baru:

```bash
cd mobile
npm install
```

**Penting — ubah IP address:**

Buka file `mobile/src/api.js`, ganti IP address sesuai IP lokal komputermu:

```javascript
const API_URL = 'http://192.168.x.x:5000/api';  // ganti dengan IP lokal kamu
```

Cara cek IP lokal:
- **Windows:** buka CMD → ketik `ipconfig` → cari **IPv4 Address**
- **Mac:** buka Terminal → ketik `ifconfig` → cari **inet**

Jalankan Expo:

```bash
npx expo start
```

✅ Scan QR code yang muncul di terminal menggunakan app **Expo Go** di HP.

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Auth (Public)
| Method | Endpoint | Body | Deskripsi |
|--------|----------|------|-----------|
| POST | `/auth/register` | `{ username, email, password }` | Daftar akun baru |
| POST | `/auth/login` | `{ email, password }` | Login, mendapat token |

### Recipes (Perlu Token)

Tambahkan header: `Authorization: Bearer <token>`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/recipes` | Ambil semua resep |
| GET | `/recipes/:id` | Ambil detail satu resep |
| PATCH | `/recipes/:id/image` | Fetch & cache gambar dari Unsplash |

---

## 🗃️ Database Schema

### Collection: `users`
| Field | Type | Keterangan |
|-------|------|------------|
| username | String | Unik, wajib |
| email | String | Unik, wajib |
| password | String | Di-hash otomatis (bcrypt) |
| role | String | `admin` / `user` |
| created_at | Date | Otomatis |

### Collection: `receipes`
| Field | Type | Keterangan |
|-------|------|------------|
| title | String | Nama resep |
| description | String | Deskripsi singkat |
| difficulty | String | `Easy` / `Medium` / `Hard` |
| cook_time | String | Contoh: "30 menit" |
| author_id | ObjectId | Referensi ke `users` |
| tags | [String] | Tag/kategori |
| ingredients | [String] | Daftar bahan |
| steps | [String] | Langkah memasak |
| image_url | String | URL gambar (auto-cache dari Unsplash) |
| created_at | Date | Otomatis |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Frontend Web | React, Vite, React Router, Axios |
| Mobile | React Native, Expo, React Navigation |
| Auth | JWT (JSON Web Token), bcryptjs |
| Image | Unsplash API (dengan caching ke database) |

## 📝 Fitur

- ✅ Register & Login (JWT authentication)
- ✅ Daftar resep dengan pagination
- ✅ Search berdasarkan nama, deskripsi, atau tag
- ✅ Filter berdasarkan tingkat kesulitan
- ✅ Sort resep (terbaru, A-Z, kesulitan)
- ✅ Detail resep lengkap (bahan & langkah)
- ✅ Gambar resep otomatis dari Unsplash (di-cache ke database)
- ✅ Responsive web + mobile app

## 📄 Lisensi

Proyek ini dibuat sebagai Tugas Akhir Fullstack Development.
