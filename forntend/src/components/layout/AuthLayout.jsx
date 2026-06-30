export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#111827]">Inventory App</h1>
          <p className="text-sm text-[#4B5563] mt-1">Kelola inventaris Anda dengan mudah</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-[#D1D5DB] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
