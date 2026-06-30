import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/shared/DataTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import SearchInput from '../../components/shared/SearchInput';
import FilterSelect from '../../components/shared/FilterSelect';
import Badge from '../../components/shared/Badge';
import ProductForm from './ProductForm';
import { usePagination } from '../../hooks/usePagination';
import { formatCurrency } from '../../utils/formatter';

const LOW_STOCK = 5;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const { page, limit, goTo, reset } = usePagination();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    categoryService.getAll({ limit: 100 })
      .then((res) => {
        const data = res?.data || res;
        setCategories(Array.isArray(data) ? data : data?.categories || data?.data || []);
      })
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({
        page, limit, search,
        categoryId: categoryFilter || undefined,
        sortField, sortDir,
      });
      const data = res?.data || res;
      setProducts(Array.isArray(data) ? data : data?.products || data?.data || []);
      setTotal(data?.total || res?.total || 0);
    } catch {
      toast.error('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, categoryFilter, sortField, sortDir]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (val) => { setSearch(val); reset(); };
  const handleCategoryFilter = (val) => { setCategoryFilter(val); reset(); };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    reset();
  };

  const handleSave = () => {
    setModalOpen(false);
    setEditTarget(null);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await productService.delete(deleteTarget.id);
      toast.success('Produk berhasil dihapus');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setDeleteLoading(false);
    }
  };

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const columns = [
    { key: 'name', label: 'Nama Produk', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    {
      key: 'category',
      label: 'Kategori',
      render: (_, row) => row.category?.name || row.categoryName || '-',
    },
    {
      key: 'price',
      label: 'Harga',
      sortable: true,
      render: (v) => formatCurrency(v),
    },
    {
      key: 'stock',
      label: 'Stok',
      sortable: true,
      render: (v) => (
        <span className="flex items-center gap-1.5">
          {v}
          {v <= LOW_STOCK && <Badge variant="warning">Menipis</Badge>}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditTarget(row); setModalOpen(true); }}
            aria-label="Edit produk"
            className="p-1.5 rounded hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            aria-label="Hapus produk"
            className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#DC2626] transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Produk</h1>
          <p className="text-sm text-[#4B5563] mt-1">Kelola produk inventaris</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah Produk
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={search} onChange={handleSearch} placeholder="Cari produk..." />
        <FilterSelect
          value={categoryFilter}
          onChange={handleCategoryFilter}
          options={categoryOptions}
          placeholder="Semua Kategori"
        />
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyTitle="Belum ada produk"
        emptyDesc="Tambahkan produk pertama Anda"
        emptyAction={
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="mt-2 flex items-center gap-1 text-sm text-[#2563EB] font-medium hover:underline"
          >
            <Plus size={14} /> Tambah Produk
          </button>
        }
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        total={total}
        page={page}
        limit={limit}
        onPageChange={goTo}
      />

      <ProductForm
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        editData={editTarget}
        categories={categories}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Produk"
        message={`Hapus produk "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </MainLayout>
  );
}
