const variants = {
  success: 'bg-[#F0FDF4] text-[#16A34A]',
  danger: 'bg-[#FEF2F2] text-[#DC2626]',
  warning: 'bg-[#FFFBEB] text-[#D97706]',
  neutral: 'bg-[#F3F4F6] text-[#4B5563]',
};

export default function Badge({ children, variant = 'neutral' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
