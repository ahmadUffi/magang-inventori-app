import { useState } from 'react';
import { Menu, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Berhasil keluar');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#D1D5DB] z-50 flex items-center px-4 gap-4">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Buka menu"
        className="lg:hidden p-2 rounded-lg hover:bg-[#F3F4F6] text-[#4B5563]"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <span className="font-semibold text-[#111827] text-base lg:w-56">Inventory App</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xs font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-medium text-[#111827] hidden sm:block max-w-32 truncate">
            {user?.name || 'User'}
          </span>
          <ChevronDown size={14} className="text-[#4B5563]" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-10 w-44 bg-white border border-[#D1D5DB] rounded-lg shadow-md z-20 py-1">
              <div className="px-3 py-2 border-b border-[#D1D5DB]">
                <p className="text-xs font-medium text-[#111827] truncate">{user?.name}</p>
                <p className="text-xs text-[#4B5563] truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-[#F3F4F6] transition-colors"
              >
                <LogOut size={14} />
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
