import { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { transactionService } from '../../services/transactionService';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/shared/DataTable';
import SearchInput from '../../components/shared/SearchInput';
import FilterSelect from '../../components/shared/FilterSelect';
import Badge from '../../components/shared/Badge';
import TransactionForm from './TransactionForm';
import { usePagination } from '../../hooks/usePagination';
import { formatDate } from '../../utils/formatter';
import { TRANSACTION_TYPE_OPTIONS } from '../../constants/transaction';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const { page, limit, goTo, reset } = usePagination();
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAll({
        page, limit, search,
        type: typeFilter || undefined,
        sortField, sortDir,
      });
      const data = res?.data || res;
      setTransactions(Array.isArray(data) ? data : data?.transactions || data?.data || []);
      setTotal(res?.total || res?.meta?.total || (Array.isArray(data) ? data.length : 0));
    } catch {
      toast.error('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, typeFilter, sortField, sortDir]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleSearch = (val) => { setSearch(val); reset(); };
  const handleTypeFilter = (val) => { setTypeFilter(val); reset(); };

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    reset();
  };

  const handleSave = () => {
    setModalOpen(false);
    fetchTransactions();
  };

  const columns = [
    {
      key: 'product',
      label: 'Produk',
      render: (_, row) => row.product?.name || row.productName || '-',
    },
    {
      key: 'type',
      label: 'Tipe',
      sortable: true,
      render: (v) => (
        <Badge variant={v === 'IN' ? 'success' : 'danger'}>{v}</Badge>
      ),
    },
    { key: 'quantity', label: 'Jumlah', sortable: true },
    { key: 'notes', label: 'Catatan', render: (v) => v || '-' },
    { key: 'createdAt', label: 'Tanggal', sortable: true, render: (v) => v ? formatDate(v) : '-' },
  ];

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Transaksi</h1>
          <p className="text-sm text-[#4B5563] mt-1">Riwayat pergerakan stok</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah Transaksi
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={search} onChange={handleSearch} placeholder="Cari transaksi..." />
        <FilterSelect
          value={typeFilter}
          onChange={handleTypeFilter}
          options={TRANSACTION_TYPE_OPTIONS}
          placeholder="Semua Tipe"
        />
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        loading={loading}
        emptyTitle="Belum ada transaksi"
        emptyDesc="Tambahkan transaksi stok masuk atau keluar"
        sortField={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        total={total}
        page={page}
        limit={limit}
        onPageChange={goTo}
      />

      <TransactionForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </MainLayout>
  );
}
