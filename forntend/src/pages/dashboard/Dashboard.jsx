import { useEffect, useState } from 'react';
import { Package, Tag, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import MainLayout from '../../components/layout/MainLayout';

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="bg-white rounded-xl border border-[#D1D5DB] p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-[#4B5563] font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="skeleton h-7 w-16 mt-1 rounded" />
        ) : (
          <p className="text-2xl font-semibold text-[#111827] mt-0.5">{value ?? 0}</p>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dashboardService.getStats()
      .then((data) => setStats(data?.data || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Package, label: 'Total Produk', value: stats?.totalProducts, color: 'bg-[#2563EB]' },
    { icon: Tag, label: 'Total Kategori', value: stats?.totalCategories, color: 'bg-[#16A34A]' },
    { icon: ArrowLeftRight, label: 'Total Transaksi', value: stats?.totalTransactions, color: 'bg-[#D97706]' },
    { icon: AlertTriangle, label: 'Stok Menipis', value: stats?.lowStockProducts, color: 'bg-[#DC2626]' },
  ];

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#4B5563] mt-1">Ringkasan data inventaris Anda</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>
    </MainLayout>
  );
}
