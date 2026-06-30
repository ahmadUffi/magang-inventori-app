import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded" />
        </td>
      ))}
    </tr>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronsUpDown size={14} className="text-[#D1D5DB]" />;
  return sortDir === 'asc'
    ? <ChevronUp size={14} className="text-[#2563EB]" />
    : <ChevronDown size={14} className="text-[#2563EB]" />;
}

export default function DataTable({
  columns,
  data,
  loading,
  emptyTitle = 'Tidak ada data',
  emptyDesc,
  emptyAction,
  sortField,
  sortDir,
  onSort,
  total,
  page,
  limit,
  onPageChange,
}) {
  const totalPages = Math.ceil((total || 0) / (limit || 10));
  const from = total ? (page - 1) * limit + 1 : 0;
  const to = total ? Math.min(page * limit, total) : 0;

  return (
    <div className="bg-white rounded-xl border border-[#D1D5DB] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F3F4F6] border-b border-[#D1D5DB]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wide whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#111827]' : ''
                  }`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))
            ) : !data?.length ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="9" x2="15" y2="9" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                    </svg>
                    <p className="text-[#111827] font-medium">{emptyTitle}</p>
                    {emptyDesc && <p className="text-xs text-[#4B5563]">{emptyDesc}</p>}
                    {emptyAction}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-[#F3F4F6] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[#111827]">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !!total && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#D1D5DB] flex-wrap gap-2">
          <p className="text-xs text-[#4B5563]">
            Menampilkan {from}–{to} dari {total} data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 text-xs border border-[#D1D5DB] rounded hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange?.(p)}
                  className={`px-2.5 py-1 text-xs border rounded ${
                    p === page
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'border-[#D1D5DB] hover:bg-[#F3F4F6]'
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 text-xs border border-[#D1D5DB] rounded hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
