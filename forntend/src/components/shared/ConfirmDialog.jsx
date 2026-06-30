import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <AlertTriangle size={20} className="text-[#DC2626]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111827]">{title || 'Konfirmasi Hapus'}</h3>
            <p className="text-sm text-[#4B5563] mt-1">
              {message || 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] text-[#4B5563] transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-60 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {loading && (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
