import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function FormModal({ open, title, onClose, onSubmit, loading, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto sm:rounded-xl rounded-none sm:max-w-lg sm:w-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D1D5DB] sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#4B5563]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 space-y-4">
            {children}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D1D5DB] sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] text-[#4B5563] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading && (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
