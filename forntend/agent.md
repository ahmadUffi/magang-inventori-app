# Agent Guide — Inventory Management System (Frontend)

Dokumen ini adalah panduan kerja untuk AI coding agent (atau developer) yang akan mengimplementasikan frontend berdasarkan `PRD.md`, `design.md`, dan `role.md` di proyek ini.

## 1. Tujuan
Membangun frontend Inventory Management System yang terdiri dari 3 modul utama (Product, Category, Transaction) di atas Dashboard, dengan UX yang konsisten, responsive, dan punya state handling lengkap (loading/empty/error/success).

## 2. Sumber Kebenaran (Source of Truth)
Ikuti urutan prioritas berikut bila ada konflik antar dokumen:
1. `PRD.md` — kebutuhan fungsional & struktur halaman
2. `design.md` — visual, komponen, state, responsive
3. `struktur.md` — folder structure, route map, alur auth (register/login, tanpa role)

Jika ada hal yang tidak tercantum di ketiga dokumen, agent boleh membuat asumsi wajar tapi **wajib dicatat sebagai catatan/komentar** di kode atau di pesan ke user, jangan diam-diam diputuskan sendiri tanpa jejak.

## 3. Tech Stack Asumsi
> Sesuaikan dengan stack aktual proyek (cek `package.json` bila sudah ada).

- Framework: React (atau Next.js bila butuh SSR/routing built-in)
- Styling: Tailwind CSS, gunakan token dari `design.md` sebagai CSS variables/theme config
- State management: Zustand atau Context API untuk global state (auth)
- Form & validasi: React Hook Form + Zod/Yup, sesuai rule validasi di PRD
- HTTP client: fetch/axios dengan interceptor untuk error handling terpusat
- Toast: library ringan (mis. react-hot-toast / sonner)
- Tabel: komponen tabel custom atau headless table (TanStack Table) untuk sorting/pagination

## 4. Urutan Pengerjaan yang Disarankan
1. **Setup layout dasar** — Navbar, Sidebar (desktop fixed + mobile drawer), Main Content wrapper. Pastikan responsive breakpoint sesuai `design.md` section 8 sebelum lanjut ke modul lain.
2. **Dashboard** — 4 cards statis dulu (dummy data), baru hubungkan ke API count.
3. **Category module** — paling sederhana (CRUD 1 field), jadikan referensi pola untuk modul lain (table, modal form, toast, loading/empty state).
4. **Product module** — reuse pola dari Category, tambahkan search, filter by category, sort.
5. **Transaction module** — reuse pola tabel (tanpa kolom Action edit/delete, karena append-only). Tambahkan validasi: quantity OUT tidak boleh melebihi stock produk yang dipilih (validasi di client saat submit, plus handle error dari BE jika validasi juga ada di server). Saat transaksi berhasil dibuat, stock Product otomatis ter-update — pastikan ProductList/Dashboard merefresh data terkait setelahnya (atau minimal saat user navigasi ke halaman tsb).
6. **Auth wiring** — bangun Login/Register sesuai `struktur.md`, pasang `ProtectedRoute` di semua route modul. Bisa dikerjakan paralel dengan modul lain karena tidak bergantung pada CRUD, tapi harus selesai sebelum app dianggap "production-ready".
7. **Polish state handling** — pastikan semua list/table di setiap modul sudah punya loading skeleton, empty state, dan error toast yang konsisten (jangan diimplementasikan ulang per modul, buat komponen shared).

## 5. Komponen yang Harus Dibuat Reusable (Shared)
Jangan duplikasi kode antar modul untuk komponen berikut:
- `<DataTable />` — table generik dengan slot kolom, sorting, pagination, loading skeleton, empty state
- `<FormModal />` — modal wrapper untuk Create/Edit
- `<ConfirmDialog />` — konfirmasi delete
- `<Toast />` / toast hook — success/error/validation
- `<SearchInput />` — dengan debounce
- `<FilterSelect />`
- `<Sidebar />`, `<Navbar />`

## 6. Validasi (ikuti persis sesuai PRD, jangan ditambah/dikurangi tanpa konfirmasi)

| Modul | Field | Rule |
|---|---|---|
| Category | Name | required |
| Product | Name | required |
| Product | SKU | required |
| Product | Category | required |
| Product | Price | > 0 |
| Product | Stock | >= 0 |
| Transaction | Product | required |
| Transaction | Type | required |
| Transaction | Quantity | > 0, dan jika Type = OUT, tidak boleh melebihi stock produk yang dipilih |

## 7. Keputusan Bisnis (Konfirmasi dari User)
- Stock di Product **otomatis berubah** saat Transaction dibuat (tidak ada approval).
- Quantity stock **OUT tidak boleh melebihi** stock yang tersedia — validasi ini wajib ada di form Create Transaction (idealnya divalidasi juga di BE, FE cukup tampilkan error dari response/atau validasi awal di client sebelum submit).
- Transaction **tidak bisa di-edit atau dihapus** (append-only). Artinya kolom Action di tabel Transaction cukup kosong/tidak ada tombol edit-delete, hanya tombol "Add Transaction" di luar tabel.
- Bahasa UI: **Bahasa Indonesia** (tidak bilingual, tidak perlu language switcher/Zustand language store).
- Dashboard cards: **refresh manual/on-navigate** saja, tidak perlu real-time (polling/websocket).
- Lihat juga catatan auth di `struktur.md` (forgot password & verifikasi email tidak ada di MVP, FE mengonsumsi endpoint BE yang sudah tersedia).

## 8. Definition of Done (per modul)
Sebuah modul (Category/Product/Transaction) dianggap selesai bila:
- [ ] List/table tampil dengan data dari API, termasuk loading skeleton
- [ ] Empty state tampil saat data kosong
- [ ] Create & Edit form berfungsi dengan validasi sesuai tabel section 6
- [ ] Delete dengan confirmation dialog
- [ ] Toast success/error muncul sesuai aksi
- [ ] Search/filter/sort berfungsi (bila berlaku untuk modul tsb)
- [ ] Responsive di 3 breakpoint (desktop/tablet/mobile) sesuai `design.md`
- [ ] Tidak ada console error/warning di browser saat aksi CRUD dijalankan

## 9. Komunikasi dengan User
Agent harus melaporkan progres per modul (bukan menunggu semua selesai), dan menandai jelas bila ada bagian yang diimplementasikan berdasarkan asumsi (lihat section 7) agar user bisa mengoreksi lebih awal.
