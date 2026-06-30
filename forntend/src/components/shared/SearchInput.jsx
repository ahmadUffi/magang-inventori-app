import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchInput({ value, onChange, placeholder = 'Cari...' }) {
  const [local, setLocal] = useState(value || '');
  const debounced = useDebounce(local, 400);

  useEffect(() => { onChange(debounced); }, [debounced]);
  useEffect(() => { if (value !== local) setLocal(value || ''); }, [value]);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] w-full sm:w-64"
      />
    </div>
  );
}
