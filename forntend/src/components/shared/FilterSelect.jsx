export default function FilterSelect({ value, onChange, options, placeholder = 'Semua' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] bg-white"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
