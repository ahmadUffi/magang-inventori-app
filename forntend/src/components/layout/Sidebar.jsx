import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ArrowLeftRight, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/products", label: "Produk", icon: Package },
  { to: "/categories", label: "Kategori", icon: Tag },
  { to: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
];

function NavItem({ to, label, icon: Icon, exact, onClick }) {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative
        ${
          isActive
            ? "bg-[#EFF6FF] text-[#2563EB] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:rounded-r"
            : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-[#D1D5DB] z-40 flex flex-col transition-transform duration-300
          lg:w-60 lg:translate-x-0 lg:top-16
          w-70 ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: open ? 280 : undefined }}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-[#D1D5DB]">
          <span className="font-semibold text-[#111827]">Menu</span>
          <button
            onClick={onClose}
            aria-label="Tutup sidebar"
            className="p-1 rounded hover:bg-[#F3F4F6]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} onClick={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}
