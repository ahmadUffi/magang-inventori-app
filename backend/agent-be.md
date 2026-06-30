# Agent Guide — Inventory Management System (Backend)

Dokumen ini adalah panduan kerja untuk AI coding agent (atau developer) yang akan mengimplementasikan backend berdasarkan `PRD-BE.md` (PRD asli) dan `struktur-be.md` (penyesuaian: Auth + data ownership per user).

## 1. Tujuan
Membangun REST API untuk Inventory Management System dengan Express + Prisma, mendukung multi-user (setiap user registrasi/login sendiri dan hanya bisa mengakses datanya sendiri), CRUD Category & Product, serta Transaction yang otomatis mengubah stock secara atomic dan bersifat append-only.

## 2. Sumber Kebenaran (Source of Truth)
1. `PRD-BE.md` — kebutuhan fungsional asli (schema dasar, flow, response format)
2. `struktur-be.md` — penyesuaian wajib: tabel User, kolom `userId`, endpoint Auth, scoping query per user, transaksi tanpa edit/delete

Jika ada konflik, `struktur-be.md` menang untuk hal-hal terkait auth & ownership; `PRD-BE.md` tetap jadi acuan untuk validasi field dasar dan response format.

## 3. Tech Stack (sesuai PRD asli)
- Runtime: Node.js + Express
- ORM: Prisma
- Auth: JWT (jsonwebtoken) + bcrypt untuk hashing password
- Validasi: middleware validasi terpisah per modul (`validations/`), bisa pakai Joi/Zod
- Database: sesuaikan dengan provider Prisma yang dipakai (PostgreSQL/MySQL — cek `schema.prisma` existing bila sudah ada)

## 4. Urutan Pengerjaan yang Disarankan
1. **Setup Prisma schema** — buat 4 model (User, Category, Product, Transaction) sesuai `struktur-be.md` section 2, lalu jalankan `npx prisma migrate dev`.
2. **Modul Auth** — register, login, middleware `auth.middleware.js` untuk verifikasi JWT. Modul ini jadi prasyarat semua modul lain karena semua route lain protected.
3. **Modul Category** — CRUD paling sederhana, jadikan pola referensi untuk Controller → Service → Prisma yang scoped ke `req.user.id`.
4. **Modul Product** — tambahkan Search, Filter, Sort di `GET /products`, plus validasi SKU unique (scoped per user) dan Category exists & milik user yang sama.
5. **Modul Transaction** — implementasikan flow stock update di dalam `prisma.$transaction()` (insert Transaction + update Product.stock dalam satu atomic operation). Hanya `GET` dan `POST`, tidak ada `PUT`/`DELETE`.
6. **Middleware umum** — Error Handler, Request Logger, Validation Middleware dipasang global di `app.js`, diterapkan konsisten di semua route.
7. **Response format & error code** — pastikan semua endpoint (termasuk Auth) mengikuti format response sukses/error yang sama dari PRD asli (section "Response Format").

## 5. Pola Wajib di Setiap Service (Ownership Scoping)
Setiap query Prisma untuk Category/Product/Transaction **wajib** menyertakan `where: { userId: req.user.id }` (langsung atau via composite where), termasuk untuk:
- `findMany` → list hanya milik user
- `findUnique`/`findFirst` by id → tetap tambahkan cek `userId`, kalau tidak cocok kembalikan `404 Not Found` (bukan 403, supaya tidak bocor informasi keberadaan resource milik user lain)
- `update` / `delete` → cek ownership dulu sebelum eksekusi
- `create` → `userId` diambil dari `req.user.id` (token), **jangan pernah** percaya `userId` dari body request client

## 6. Transaction Flow — Implementasi Wajib

```js
// Pseudocode wajib pakai prisma.$transaction agar atomic
await prisma.$transaction(async (tx) => {
  const product = await tx.product.findFirst({
    where: { id: productId, userId: req.user.id }
  });

  if (!product) throw new NotFoundError("Product not found");

  if (type === "OUT" && product.stock < quantity) {
    throw new ValidationError("Stok tidak mencukupi");
  }

  const newStock = type === "IN"
    ? product.stock + quantity
    : product.stock - quantity;

  await tx.product.update({
    where: { id: productId },
    data: { stock: newStock }
  });

  return tx.transaction.create({
    data: { productId, type, quantity, note, userId: req.user.id }
  });
});
```

Jangan pisahkan update stock dan create transaction ke dua operasi terpisah di luar `$transaction` — risiko data tidak konsisten jika salah satu gagal.

## 7. Validasi (Ringkasan — detail lengkap di `struktur-be.md` section 7)

| Modul | Aturan Kunci |
|---|---|
| Auth | email unique & format valid, password min 8 karakter |
| Category | name required |
| Product | name, sku required; sku unique per user; categoryId harus exist & milik user yang sama; price > 0; stock >= 0 |
| Transaction | productId harus exist & milik user yang sama; quantity > 0; type IN/OUT; jika OUT, stock harus cukup |

## 8. HTTP Status Code Mapping
| Kondisi | Status |
|---|---|
| Sukses GET/PUT | 200 |
| Sukses POST (create) | 201 |
| Validasi gagal (termasuk stock tidak cukup) | 400 |
| Token tidak ada/invalid/expired | 401 |
| Resource tidak ditemukan / bukan milik user | 404 |
| SKU duplikat / email duplikat saat register | 409 |
| Error tak terduga | 500 |

## 9. Keputusan Bisnis yang Sudah Dikonfirmasi (Jangan Diasumsikan Ulang)
- Tidak ada role/permission — semua user setara, hanya mengelola datanya sendiri (data per toko/akun, terisolasi via `userId`).
- Tidak ada forgot password / verifikasi email di MVP.
- Stock berubah otomatis saat Transaction dibuat (tanpa approval).
- OUT transaction ditolak jika stock tidak cukup.
- Transaction tidak bisa diedit/dihapus (tidak ada endpoint untuk itu sama sekali — jangan dibuatkan route-nya).
- SKU unique **global** (lintas semua user/toko).
- Token JWT expiry tetap, tanpa refresh token — user login ulang jika expired.
- Register butuh field `storeName` (nama toko) selain `name` (nama pemilik akun).
- `note` di Transaction optional.
- Quantity Transaction tidak ada batas atas.
- Delete Category diblokir total jika masih ada Product terkait (tidak ada cascade).
- `categoryId` di Product wajib diisi (NOT NULL).
- `price` bertipe Integer (Rupiah tanpa desimal), bukan Decimal.

## 10. Tidak Ada Lagi Open Questions
Semua keputusan bisnis & teknis untuk MVP sudah final per section 9 di atas. Lanjut ke implementasi.

## 11. Definition of Done (per modul)
- [ ] Semua endpoint modul mengembalikan response format sesuai PRD (`success`, `message`, `data`)
- [ ] Semua endpoint protected (kecuali `/auth/register` & `/auth/login`) memvalidasi token via middleware
- [ ] Semua query di-scope ke `userId` dari token, sudah diuji dengan 2 akun berbeda untuk memastikan tidak ada data leak
- [ ] Validasi input sesuai tabel section 7, error 400 dengan pesan jelas per field
- [ ] Business rule (SKU unique, category tidak bisa dihapus jika ada product, stock OUT tidak boleh minus) sudah diuji
- [ ] Migration Prisma berjalan mulus dari kosong (`npx prisma migrate dev`) tanpa error
- [ ] Tidak ada query Prisma yang lupa filter `userId` (audit ulang sebelum modul ditutup)

## 12. Komunikasi dengan User
Sama seperti panduan FE: laporkan progres per modul, dan tandai eksplisit bila ada bagian yang diimplementasikan berdasarkan asumsi dari Open Questions section 9/10 di atas.
