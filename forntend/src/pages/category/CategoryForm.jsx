import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import FormModal from '../../components/shared/FormModal';
import FormField from '../../components/common/FormField';

const schema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
});

export default function CategoryForm({ open, onClose, onSave, editData }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) reset({ name: editData?.name || '' });
  }, [open, editData]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (editData) {
        await categoryService.update(editData.id, data);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await categoryService.create(data);
        toast.success('Kategori berhasil ditambahkan');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title={editData ? 'Edit Kategori' : 'Tambah Kategori'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <FormField id="name" label="Nama Kategori" error={errors.name?.message} required>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
            errors.name ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
          }`}
          placeholder="Nama kategori"
        />
      </FormField>
    </FormModal>
  );
}
