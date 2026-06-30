# Struktur — Inventory Management System (Frontend)

> Sistem ini single-tenant per user: setiap user registrasi & login sendiri, lalu mengelola seluruh data (Product, Category, Transaction) miliknya sendiri. Tidak ada role/permission bertingkat — semua user punya akses penuh ke datanya sendiri.

## 1. Alur Auth

```
Landing/Login
↓
Register (jika belum punya akun) → Login
↓
Authenticated Session (JWT/token)
↓
Dashboard (data milik user yang login)
```

- **Register**: form Name, Email, Password (+ Confirm Password)
- **Login**: form Email, Password
- Setelah login sukses → redirect ke Dashboard
- Setiap request ke API membawa token, data yang ditampilkan hanya milik user tsb (data isolation per user, di-handle backend, tapi frontend wajib selalu sertakan token di header)
- Token expired/invalid → redirect otomatis ke halaman Login + toast "Session expired, please login again"
- Tombol Logout di Navbar (user menu dropdown)

## 2. Validasi Auth Form

| Form | Field | Rule |
|---|---|---|
| Register | Name | required |
| Register | Email | required, format email valid |
| Register | Password | required, min 8 karakter |
| Register | Confirm Password | required, harus sama dengan Password |
| Login | Email | required, format email valid |
| Login | Password | required |

## 3. Folder Structure (Frontend)

```
src/
├── assets/                  # gambar, icon, ilustrasi empty state
├── components/
│   ├── common/               # Button, Input, Select, Textarea, Badge
│   ├── layout/                # Navbar, Sidebar, MainLayout
│   ├── shared/                 # DataTable, FormModal, ConfirmDialog, Toast, SearchInput, FilterSelect
│   └── ...
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── product/
│   │   ├── ProductList.tsx
│   │   ├── ProductForm.tsx
│   ├── category/
│   │   ├── CategoryList.tsx
│   │   ├── CategoryForm.tsx
│   └── transaction/
│       ├── TransactionList.tsx
│       ├── TransactionForm.tsx
├── store/                    # Zustand/Context: auth store
├── services/ (api/)           # authService, productService, categoryService, transactionService
├── hooks/                     # useAuth, useDebounce, useToast, usePagination
├── routes/                    # route config + ProtectedRoute (cek token, bukan role)
├── utils/                     # formatter (currency, date), validators
├── constants/                 # transaction type enum, route paths
└── App.tsx
```

## 4. Route Map

| Path | Halaman | Akses |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/` atau `/dashboard` | Dashboard | Protected |
| `/products` | Product List | Protected |
| `/products/create` | Create Product | Protected |
| `/products/:id/edit` | Edit Product | Protected |
| `/categories` | Category List | Protected |
| `/categories/create` | Create Category | Protected |
| `/categories/:id/edit` | Edit Category | Protected |
| `/transactions` | Transaction List | Protected |
| `/transactions/create` | Create Transaction | Protected |

> Tidak ada route edit/delete untuk Transaction — bersifat append-only sesuai keputusan bisnis (lihat `agent.md` section 7).

`ProtectedRoute` cukup cek apakah token ada & valid; jika tidak → redirect `/login`. Tidak ada percabangan logic berdasarkan role.

## 5. Data Ownership
- Setiap Category, Product, dan Transaction terikat ke `user_id` pemiliknya.
- Frontend tidak perlu menampilkan kolom "owner" karena user hanya pernah melihat datanya sendiri.
- Saat logout, pastikan semua state di store (Zustand/Context) di-reset agar data user sebelumnya tidak "bocor" ke sesi berikutnya di device yang sama.

## 6. Komponen Tambahan Akibat Auth
- `<AuthLayout />` — layout khusus Login/Register (tanpa Navbar/Sidebar)
- `<ProtectedRoute />` — wrapper cek token sebelum render halaman
- `useAuth()` hook — expose `user`, `login()`, `register()`, `logout()`, `isAuthenticated`

## 7. Catatan Auth (Konfirmasi)
- **Forgot Password**: tidak ada di MVP.
- **Verifikasi Email**: tidak ada di MVP, user langsung aktif setelah register.
- Frontend akan mengonsumsi endpoint dari Backend (BE) yang sudah tersedia — pastikan cek dokumentasi/kontrak API BE untuk path, payload, dan format response sebelum implementasi `authService` (login, register, logout, get current user).
- Soal durasi token/session dan mekanisme refresh token: ikuti apa yang disediakan BE (cek expiry handling di response/header), tidak perlu didesain ulang dari frontend.
