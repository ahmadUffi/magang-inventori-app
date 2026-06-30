import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import FormModal from '../../components/shared/FormModal';
import FormField from '../../components/common/FormField';

const schema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  sku: z.string().min(1, 'SKU wajib diisi'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  price: z.coerce.number().gt(0, 'Harga harus lebih dari 0'),
  stock: z.coerce.number().min(0, 'Stok tidak boleh negatif'),
  description: z.string().optional(),
});

function InputClass(hasError) {
  return `w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
    hasError ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
  }`;
}

export default function ProductForm({ open, onClose, onSave, editData, categories }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', sku: '', categoryId: '', price: '', stock: 0, description: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: editData?.name || '',
        sku: editData?.sku || '',
        categoryId: editData?.categoryId ? String(editData.categoryId) : (editData?.category?.id ? String(editData.category.id) : ''),
        price: editData?.price || '',
        stock: editData?.stock ?? 0,
        description: editData?.description || '',
      });
    }
  }, [open, editData]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, price: Number(data.price), stock: Number(data.stock) };
      if (editData) {
        await productService.update(editData.id, payload);
        toast.success('Produk berhasil diperbarui');
      } else {
        await productService.create(payload);
        toast.success('Produk berhasil ditambahkan');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title={editData ? 'Edit Produk' : 'Tambah Produk'}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <FormField id="name" label="Nama Produk" error={errors.name?.message} required>
        <input id="name" type="text" {...register('name')} className={InputClass(errors.name)} placeholder="Nama produk" />
      </FormField>

      <FormField id="sku" label="SKU" error={errors.sku?.message} required>
        <input id="sku" type="text" {...register('sku')} className={InputClass(errors.sku)} placeholder="Kode SKU unik" />
      </FormField>

      <FormField id="categoryId" label="Kategori" error={errors.categoryId?.message} required>
        <select id="categoryId" {...register('categoryId')} className={InputClass(errors.categoryId)}>
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="price" label="Harga" error={errors.price?.message} required>
          <input id="price" type="number" min="1" {...register('price')} className={InputClass(errors.price)} placeholder="0" />
        </FormField>
        <FormField id="stock" label="Stok" error={errors.stock?.message} required>
          <input id="stock" type="number" min="0" {...register('stock')} className={InputClass(errors.stock)} placeholder="0" />
        </FormField>
      </div>

      <FormField id="description" label="Deskripsi">
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className={`${InputClass(false)} resize-none`}
          placeholder="Deskripsi produk (opsional)"
        />
      </FormField>
    </FormModal>
  );
}
