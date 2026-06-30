import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import AuthLayout from '../../components/layout/AuthLayout';

const schema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Login berhasil');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal, periksa email dan password';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-lg font-semibold text-[#111827] mb-6">Masuk ke Akun</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-[13px] font-medium text-[#111827] mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
              errors.email ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
            }`}
            placeholder="email@contoh.com"
          />
          {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-[13px] font-medium text-[#111827] mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
              errors.password ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
            }`}
            placeholder="Password"
          />
          {errors.password && <p className="text-xs text-[#DC2626] mt-1">{errors.password.message}</p>}
        </div>

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
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>

      <p className="text-sm text-[#4B5563] text-center mt-4">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#2563EB] font-medium hover:underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
}
