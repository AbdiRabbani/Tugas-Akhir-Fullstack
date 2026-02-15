# 🍳 Rahasia Dapur

Aplikasi resep masakan khusus untuk ibu-ibu PKK. Dibangun dengan **Node.js**, **React**, dan **React Native**.

## 📁 Struktur Proyek

```
Tugas Akhir Fullstack/
├── database/       # Backend API (Express.js + MongoDB)
├── website/        # Frontend Web (React + Vite)
└── mobile/         # Mobile App (React Native + Expo)
```

## ⚙️ Prasyarat

Pastikan sudah terinstall:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (lokal atau Atlas)
- [Expo CLI](https://docs.expo.dev/) (untuk mobile)
- [Git](https://git-scm.com/)

## 🚀 Cara Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/rahasia-dapur.git
cd rahasia-dapur
```

### 2. Setup Backend (database)

```bash
cd database
npm install
```

Buat file `.env` di folder `database/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/moms_receipe
JWT_SECRET=rahasia_dapur_secret_key_2026
UNSPLASH_ACCESS_KEY=your_unsplash_key_here
```

> **📌 Unsplash API Key**
> Gambar resep diambil otomatis dari Unsplash. Untuk mengaktifkan fitur ini:
> 1. Daftar di [unsplash.com/developers](https://unsplash.com/developers) (gratis)
> 2. Buat "New Application"
> 3. Copy **Access Key** → paste di `.env`
>
> Tanpa key ini, aplikasi tetap berjalan — hanya gambar yang tidak akan muncul.

Jalankan seeder untuk mengisi data awal:

```bash
npm run seed
```

Jalankan server:

```bash
npm start
# atau untuk development (auto-restart):
npm run dev
```

Server berjalan di `http://localhost:5000`

### 3. Setup Website (website)

```bash
cd website
npm install
npm run dev
```

Website berjalan di `http://localhost:5173`

### 4. Setup Mobile (mobile)

```bash
cd mobile
npm install
```

⚠️ **Penting:** Sebelum menjalankan, ubah IP address di `mobile/src/api.js` sesuai IP lokal komputermu:

```javascript
const API_URL = 'http://192.168.x.x:5000/api'; // ganti dengan IP lokal kamu
```

Cara cek IP lokal:
- **Windows:** `ipconfig` → cari IPv4 Address
- **Mac/Linux:** `ifconfig` → cari inet

Lalu jalankan:

```bash
npx expo start
```

Scan QR code dengan Expo Go di HP.

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Daftar akun baru |
| POST | `/auth/login` | Login |

### Recipes (membutuhkan token)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/recipes` | Ambil semua resep |
| GET | `/recipes/:id` | Ambil detail resep |
| PATCH | `/recipes/:id/image` | Fetch & cache gambar dari Unsplash |

Header: `Authorization: Bearer <token>`

## 🗃️ Struktur Database (MongoDB)

### Collection: `users`
| Field | Type | Keterangan |
|-------|------|------------|
| username | String | Unik |
| email | String | Unik |
| password | String | Di-hash dengan bcrypt |
| role | String | `admin` / `user` |
| created_at | Date | Auto |

### Collection: `receipes`
| Field | Type | Keterangan |
|-------|------|------------|
| title | String | Nama resep |
| description | String | Deskripsi singkat |
| difficulty | String | `Easy` / `Medium` / `Hard` |
| cook_time | String | Waktu masak |
| author_id | ObjectId | Referensi ke `users` |
| tags | [String] | Tag/kategori |
| ingredients | [String] | Daftar bahan |
| steps | [String] | Langkah memasak |
| image_url | String | URL gambar (cache dari Unsplash) |
| created_at | Date | Auto |

## 🔑 Akun Demo

Setelah menjalankan `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | abdi@example.com | rabbani |
| User | rani@example.com | rani123 |
| User | siti@example.com | siti123 |

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Frontend Web | React, Vite, React Router, Axios |
| Mobile | React Native, Expo, React Navigation |
| Auth | JWT (JSON Web Token), bcryptjs |
| Image API | Unsplash API (dengan caching ke DB) |

## 📝 Fitur

- ✅ Register & Login (JWT auth)
- ✅ Lihat daftar resep dengan pagination
- ✅ Search resep berdasarkan nama, deskripsi, atau tag
- ✅ Filter berdasarkan tingkat kesulitan
- ✅ Sort resep (terbaru, A-Z, kesulitan)
- ✅ Detail resep lengkap (bahan + langkah)
- ✅ Gambar resep otomatis dari Unsplash (cached)
- ✅ Responsive web + mobile app

## 📄 Lisensi

Proyek ini dibuat untuk Tugas Akhir.
