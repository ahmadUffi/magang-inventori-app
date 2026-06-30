# Design System — Inventory Management System

## 1. Design Principles
- **Clarity over decoration** — ini adalah tools operasional (operational tool), bukan marketing site. Prioritaskan keterbacaan data dan kecepatan input.
- **Konsisten** — satu pola komponen dipakai di semua modul (Product, Category, Transaction).
- **Predictable feedback** — setiap aksi (create/update/delete) selalu punya state loading, success, dan error yang jelas.

## 2. Color Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary` | #2563EB | Tombol utama, link aktif, sidebar active state |
| `--color-primary-hover` | #1D4ED8 | Hover state tombol primary |
| `--color-success` | #16A34A | Toast sukses, badge stock IN |
| `--color-danger` | #DC2626 | Toast error, tombol delete, badge stock OUT |
| `--color-warning` | #D97706 | Stok menipis (low stock) |
| `--color-neutral-900` | #111827 | Teks utama |
| `--color-neutral-600` | #4B5563 | Teks sekunder |
| `--color-neutral-300` | #D1D5DB | Border |
| `--color-neutral-100` | #F3F4F6 | Background table header, hover row |
| `--color-bg` | #F9FAFB | Background halaman |
| `--color-surface` | #FFFFFF | Card, table, modal |

## 3. Typography

| Style | Font Size | Weight | Penggunaan |
|---|---|---|---|
| H1 | 24px | 600 | Judul halaman |
| H2 | 18px | 600 | Judul section/card |
| Body | 14px | 400 | Teks umum, isi tabel |
| Small | 12px | 400 | Caption, helper text, timestamp |
| Label | 13px | 500 | Label form |

Font: `Inter` atau `system-ui` sebagai fallback.

## 4. Spacing Scale
4 / 8 / 12 / 16 / 24 / 32 / 48 (px) — gunakan kelipatan 4 untuk semua padding/margin/gap.

## 5. Layout Grid

```
Navbar height        : 64px, fixed top
Sidebar width (desktop): 240px, fixed left
Sidebar (mobile)      : drawer, overlay, width 280px
Content padding       : 24px (desktop), 16px (mobile)
Max content width     : tidak dibatasi (full fluid), table scroll horizontal di mobile
```

## 6. Core Components

### 6.1 Navbar
- Logo/App name (kiri)
- Search global (opsional, bisa dikosongkan untuk MVP)
- User menu (kanan): avatar, nama, dropdown logout

### 6.2 Sidebar
- Menu: Dashboard, Products, Categories, Transactions
- Active state: background `--color-primary` opacity 10%, teks `--color-primary`, left border accent 3px
- Collapse jadi drawer di mobile, dipicu hamburger icon di navbar

### 6.3 Card (Dashboard)
- Icon kiri, label kecil di atas, angka besar (24px bold) di bawah
- 4 kolom desktop → 2 kolom tablet → 1 kolom mobile

### 6.4 Table
- Header sticky, background `--color-neutral-100`
- Row hover: `--color-neutral-100`
- Actions kolom terakhir: icon button (edit = pensil, delete = trash, warna danger)
- Pagination di bawah tabel (kiri: info "showing X-Y of Z", kanan: page control)
- Sort: klik header kolom yang sortable, tampilkan arrow indicator

### 6.5 Form / Modal
- Modal centered untuk Create/Edit (desktop), full-screen sheet untuk mobile
- Label di atas input, helper/error text di bawah input (warna danger jika error)
- Tombol: Cancel (outline/secondary, kiri) — Save (primary, kanan)
- Disable tombol Save saat request berjalan, tampilkan spinner di dalam tombol

### 6.6 Search & Filter Bar
- Search input dengan icon kaca pembesar, debounce 400ms
- Filter dropdown di sebelah kanan search (Category untuk Product, Type untuk Transaction)
- Diletakkan dalam satu baris di atas tabel, wrap ke 2 baris di mobile

### 6.7 Badge
- Transaction Type: `IN` → hijau soft (`success` bg 10%, teks `success`), `OUT` → merah soft (`danger` bg 10%, teks `danger`)
- Stock status: Low stock → badge warning kecil di sebelah angka stock

## 7. States

### Loading
- **Button loading**: spinner menggantikan/menyertai teks tombol, tombol disabled
- **Table loading**: skeleton row (3–5 baris abu-abu shimmer) menggantikan isi tabel, header tetap tampil

### Empty State
- Ilustrasi sederhana (line icon, bukan foto) + teks "No Data Found" + sub-teks kontekstual (mis. "Belum ada produk, tambahkan produk pertama Anda") + tombol CTA "Add Product" bila relevan

### Error State
- Toast posisi top-right, auto-dismiss 4s, warna danger
- Jenis: Validation Error (per-field, ditampilkan inline di form + toast ringkas), Server Error, Network Error (toast dengan tombol "Retry" bila memungkinkan)

### Success State
- Toast posisi top-right, warna success, auto-dismiss 3s
- Pesan: "Created Successfully" / "Updated Successfully" / "Deleted Successfully"

### Delete Confirmation
- Selalu gunakan confirmation dialog sebelum delete (belum tercantum di PRD asli, tapi wajib untuk mencegah data hilang tidak sengaja)

## 8. Responsive Behavior

| Breakpoint | Sidebar | Table | Form Modal | Cards |
|---|---|---|---|---|
| Desktop ≥1024px | Fixed, visible | Full table | Centered modal | 4 kolom |
| Tablet 768–1023px | Fixed, bisa collapse jadi icon-only | Full table, scroll jika perlu | Centered modal | 2 kolom |
| Mobile ≤767px | Drawer (overlay) | Horizontal scroll atau stacked card view | Full-screen sheet | 1 kolom |

## 9. Iconography
Gunakan satu set icon library konsisten (mis. Lucide / Heroicons), outline style, ukuran 16–20px untuk inline action, 24px untuk card dashboard.

## 10. Accessibility Notes
- Kontras teks minimal 4.5:1 terhadap background
- Semua tombol icon-only wajib punya `aria-label`
- Form input wajib terhubung ke `<label>` via `for`/`id`
- Focus state terlihat jelas (outline 2px `--color-primary`) untuk navigasi keyboard
