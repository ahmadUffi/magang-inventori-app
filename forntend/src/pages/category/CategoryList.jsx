import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/shared/DataTable';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import SearchInput from '../../components/shared/SearchInput';
import CategoryForm from './CategoryForm';
import { usePagination } from '../../hooks/usePagination';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const { page, limit, goTo, reset } = usePagination();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({ page, limit, search, sortField, sortDir });
      const data = res?.data || res;
      setCategories(Array.isArray(data) ? data : data?.categories || data?.data || []);
      setTotal(data?.total || res?.total || 0);
    } catch {
      toast.error('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sortField, sortDir]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSearch = (val) => { setSearch(val); reset(); };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    reset();
  };

  const handleSave = () => {
    setModalOpen(false);
    setEditTarget(null);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await categoryService.delete(deleteTarget.id);
      toast.success('Kategori berhasil dihapus');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'createdAt', label: 'Dibuat', sortable: true, render: (v) => v ? new Date(v).toLocaleDateString('id-ID') : '-' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditTarget(row); setModalOpen(true); }}
            aria-label="Edit kategori"
            className="p-1.5 rounded hover:bg-[#EFF6FF] text-[#2563EB] transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            aria-label="Hapus kategori"
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
          <h1 className="text-2xl font-semibold text-[#111827]">Kategori</h1>
          <p className="text-sm text-[#4B5563] mt-1">Kelola kategori produk</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah Kategori
        </button>
      </div>

      <div className="mb-4">
        <SearchInput value={search} onChange={handleSearch} placeholder="Cari kategori..." />
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyTitle="Belum ada kategori"
        emptyDesc="Tambahkan kategori pertama Anda"
        emptyAction={
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="mt-2 flex items-center gap-1 text-sm text-[#2563EB] font-medium hover:underline"
          >
            <Plus size={14} /> Tambah Kategori
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

      <CategoryForm
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        editData={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Kategori"
        message={`Hapus kategori "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </MainLayout>
  );
}
