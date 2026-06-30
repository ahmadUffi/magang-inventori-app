export default function FormField({ id, label, error, children, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#111827] mb-1">
        {label}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}
