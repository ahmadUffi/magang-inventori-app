import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  storeName: z.string().min(1, 'Nama toko wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

function Field({ id, label, type = 'text', registration, error, placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#111827] mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        {...registration}
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
          error ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
        }`}
        placeholder={placeholder}
      />
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      await registerUser(payload);
      toast.success('Registrasi berhasil, silakan login');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-[#111827] mb-6">Buat Akun Baru</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="name" label="Nama" registration={register('name')} error={errors.name?.message} placeholder="Nama lengkap" autoComplete="name" />
        <Field id="storeName" label="Nama Toko" registration={register('storeName')} error={errors.storeName?.message} placeholder="Nama toko Anda" autoComplete="organization" />
        <Field id="email" label="Email" type="email" registration={register('email')} error={errors.email?.message} placeholder="email@contoh.com" autoComplete="email" />
        <Field id="password" label="Password" type="password" registration={register('password')} error={errors.password?.message} placeholder="Min. 8 karakter" autoComplete="new-password" />
        <Field id="confirmPassword" label="Konfirmasi Password" type="password" registration={register('confirmPassword')} error={errors.confirmPassword?.message} placeholder="Ulangi password" autoComplete="new-password" />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>

      <p className="text-sm text-[#4B5563] text-center mt-4">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#2563EB] font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
}
