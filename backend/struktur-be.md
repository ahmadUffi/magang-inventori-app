# Struktur — Inventory Management System (Backend)

> Penyesuaian dari Backend PRD asli: PRD asli belum punya entitas User/Auth. Karena di FE sudah diputuskan setiap user registrasi & login sendiri lalu mengelola datanya sendiri (tanpa role), BE wajib menambahkan modul **Auth** dan **data ownership per user** (`userId`) di setiap entitas utama.

## 1. Perubahan Utama dari PRD Asli
1. Tambah tabel **User**.
2. Tambah kolom **userId** di tabel `Category`, `Product`, `Transaction` (relasi ke User).
3. Semua endpoint Category/Product/Transaction **wajib protected** (butuh token) dan **selalu di-scope ke `req.user.id`** — user A tidak boleh bisa lihat/edit/hapus data milik user B.
4. SKU unique **global** (lintas seluruh user di sistem) — dikonfirmasi oleh user.
5. Endpoint Transaction **tidak ada PUT/DELETE** — konsisten dengan keputusan FE bahwa transaksi append-only.

## 2. Database Schema (Updated)

### User (Baru)
| Field | Type |
|---|---|
| id | UUID |
| name | String |
| storeName | String |
| email | String (unique) |
| password | String (hashed) |
| createdAt | DateTime |
| updatedAt | DateTime |

### Category
| Field | Type |
|---|---|
| id | UUID |
| name | String |
| userId | UUID (FK → User.id) |
| createdAt | DateTime |
| updatedAt | DateTime |

### Product
| Field | Type |
|---|---|
| id | UUID |
| name | String |
| sku | String |
| price | Integer (Rupiah, tanpa desimal) |
| stock | Integer |
| categoryId | UUID (FK → Category.id) |
| userId | UUID (FK → User.id) |
| createdAt | DateTime |
| updatedAt | DateTime |

### Transaction
| Field | Type |
|---|---|
| id | UUID |
| productId | UUID (FK → Product.id) |
| type | Enum(IN, OUT) |
| quantity | Integer |
| note | String |
| userId | UUID (FK → User.id) |
| createdAt | DateTime |

> `Transaction` tidak punya `updatedAt` — sesuai sifatnya yang append-only/immutable.

## 3. Database Relation (Updated)

```
User
1
│
├── N → Category
├── N → Product
└── N → Transaction

Category
1
│
N
Product
1
│
N
Transaction
```

## 4. Folder Structure (Backend)

```
src/
├── controllers/
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   └── transaction.controller.js
├── services/
│   ├── auth.service.js
│   ├── category.service.js
│   ├── product.service.js
│   └── transaction.service.js
├── routes/
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── transaction.routes.js
│   └── index.js
├── middlewares/
│   ├── auth.middleware.js          # verifikasi JWT, attach req.user
│   ├── errorHandler.middleware.js
│   ├── requestLogger.middleware.js
│   └── validate.middleware.js
├── validations/
│   ├── auth.validation.js
│   ├── category.validation.js
│   ├── product.validation.js
│   └── transaction.validation.js
├── prisma/
│   └── schema.prisma
├── utils/
│   ├── jwt.js
│   ├── hash.js                      # bcrypt helper
│   └── response.js                  # success/error response formatter
├── app.js
└── server.js
```

## 5. API Modules (Updated)

### Auth (Baru)
```
POST   /auth/register     → Create User (hash password, return token)
POST   /auth/login        → Validate credentials, return token
GET    /auth/me           → Return current logged-in user (protected)
```
> Tidak ada `forgot-password` / `verify-email` di MVP, sesuai keputusan FE.

### Category (Protected, scoped ke userId)
```
GET    /categories          → List Category milik user yang login
GET    /categories/:id      → Detail Category (404 jika bukan milik user)
POST   /categories          → Create Category (userId diambil dari token, bukan body)
PUT    /categories/:id      → Update Category (cek ownership dulu)
DELETE /categories/:id      → Delete Category (cek ownership + cek tidak ada product terkait)
```

### Product (Protected, scoped ke userId)
```
GET    /products             → List Product milik user (Search, Filter, Sort)
GET    /products/:id         → Detail Product (cek ownership)
POST   /products              → Create Product (userId dari token)
PUT    /products/:id          → Update Product (cek ownership)
DELETE /products/:id          → Delete Product (cek ownership)
```

### Transaction (Protected, scoped ke userId)
```
GET    /transactions          → Transaction History milik user (Filter by Type)
POST   /transactions           → Create Transaction (lihat flow stock update di bawah)
```
> **Tidak ada** `PUT /transactions/:id` maupun `DELETE /transactions/:id` — sesuai keputusan FE bahwa transaksi tidak bisa diedit/dihapus.

## 6. Auth Middleware Flow
```
Request masuk dengan header: Authorization: Bearer <token>
↓
auth.middleware verifikasi token (jwt.verify)
↓
Token valid?
├── NO  → 401 Unauthorized
└── YES → attach req.user = { id, email, ... } → next()
↓
Controller/Service selalu pakai req.user.id untuk filter query
(WHERE userId = req.user.id)
```

Semua route Category/Product/Transaction wajib lewat `auth.middleware` sebelum masuk ke controller.

## 7. Validation (Updated)

### Auth
| Field | Rule |
|---|---|
| name (register) | required |
| email (register & login) | required, format email valid |
| password (register) | required, min 8 karakter |
| password (login) | required |
| email (register) | unique (cek belum terdaftar) |

### Category
- Name required
- *(implicit)* userId diambil dari token, bukan diisi manual oleh client

### Product
- Name required
- SKU required
- **SKU unique** (global, lintas seluruh user)
- Category exists **dan milik user yang sama**
- Price > 0
- Stock >= 0

### Transaction
- Product exists **dan milik user yang sama**
- Quantity > 0
- Type IN atau OUT
- Jika OUT → Stock harus cukup (Stock >= Quantity), kalau tidak → 400 dengan pesan jelas (mis. "Stok tidak mencukupi")

## 8. Business Rules (Updated)
- **Category**: tidak bisa dihapus jika masih ada Product terkait (scoped ke user yang sama).
- **Product**: SKU unique *global* (lintas semua user — dua toko tidak boleh punya SKU yang sama).
- **Transaction**:
  - Type `IN` → stock bertambah.
  - Type `OUT` → stock berkurang, ditolak (400) jika stock tidak cukup.
  - Stock update terjadi dalam **satu database transaction** (Prisma `$transaction`) bersamaan dengan insert record Transaction, agar konsisten (atomic) — tidak boleh ada kondisi stock ter-update tapi record Transaction gagal tersimpan, atau sebaliknya.
  - Transaction **immutable**: tidak ada endpoint update/delete.

## 9. Keputusan Final (Konfirmasi dari User)
1. **SKU unique**: global, lintas semua user (`@@unique([sku])` di Prisma).
2. **Token**: JWT sederhana dengan expiry tetap, tanpa refresh token — jika expired, user login ulang.
3. **Register field**: tambah `storeName` (nama toko), terpisah dari `name` (nama pemilik akun).
4. **Note di Transaction**: optional, boleh kosong.
5. **Quantity Transaction**: tidak ada batas atas, bebas selama validasi stock terpenuhi untuk OUT.
6. **Delete Category**: block total jika masih ada Product terkait, tidak ada opsi cascade/pindah.
7. **categoryId di Product**: wajib diisi (NOT NULL), Product tidak boleh tanpa Category.
8. **Price**: tipe Integer (Rupiah tanpa desimal), bukan Decimal.
