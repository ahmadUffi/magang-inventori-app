import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { transactionService } from '../../services/transactionService';
import { productService } from '../../services/productService';
import FormModal from '../../components/shared/FormModal';
import FormField from '../../components/common/FormField';
import { TRANSACTION_TYPE_OPTIONS } from '../../constants/transaction';

const schema = z.object({
  productId: z.string().min(1, 'Produk wajib dipilih'),
  type: z.enum(['IN', 'OUT'], { required_error: 'Tipe transaksi wajib dipilih' }),
  quantity: z.coerce.number().int().gt(0, 'Jumlah harus lebih dari 0'),
  notes: z.string().optional(),
});

function InputClass(hasError) {
  return `w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] ${
    hasError ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
  }`;
}

export default function TransactionForm({ open, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { register, handleSubmit, reset, watch, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { productId: '', type: '', quantity: '', notes: '' },
  });

  const watchedProductId = watch('productId');
  const watchedType = watch('type');

  useEffect(() => {
    if (open) {
      productService.getAll({ limit: 200 })
        .then((res) => {
          const data = res?.data || res;
          setProducts(Array.isArray(data) ? data : data?.products || data?.data || []);
        })
        .catch(() => {});
      reset({ productId: '', type: '', quantity: '', notes: '' });
      setSelectedProduct(null);
    }
  }, [open]);

  useEffect(() => {
    if (watchedProductId) {
      const prod = products.find((p) => String(p.id) === String(watchedProductId));
      setSelectedProduct(prod || null);
    } else {
      setSelectedProduct(null);
    }
  }, [watchedProductId, products]);

  const onSubmit = async (data) => {
    // Client-side OUT stock validation
    if (data.type === 'OUT' && selectedProduct) {
      if (Number(data.quantity) > selectedProduct.stock) {
        setError('quantity', {
          message: `Jumlah melebihi stok tersedia (${selectedProduct.stock})`,
        });
        return;
      }
    }

    setLoading(true);
    try {
      await transactionService.create({
        ...data,
        quantity: Number(data.quantity),
      });
      toast.success('Transaksi berhasil ditambahkan');
      onSave();
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menyimpan transaksi';
      if (msg.toLowerCase().includes('stock') || msg.toLowerCase().includes('stok')) {
        setError('quantity', { message: msg });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      title="Tambah Transaksi"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
    >
      <FormField id="productId" label="Produk" error={errors.productId?.message} required>
        <select id="productId" {...register('productId')} className={InputClass(errors.productId)}>
          <option value="">Pilih produk</option>
          {products.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name} (Stok: {p.stock})
            </option>
          ))}
        </select>
      </FormField>

      {selectedProduct && (
        <p className="text-xs text-[#4B5563] -mt-2">
          Stok tersedia: <span className="font-medium text-[#111827]">{selectedProduct.stock}</span>
        </p>
      )}

      <FormField id="type" label="Tipe Transaksi" error={errors.type?.message} required>
        <select id="type" {...register('type')} className={InputClass(errors.type)}>
          <option value="">Pilih tipe</option>
          {TRANSACTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FormField>

      <FormField id="quantity" label="Jumlah" error={errors.quantity?.message} required>
        <input
          id="quantity"
          type="number"
          min="1"
          {...register('quantity')}
          className={InputClass(errors.quantity)}
          placeholder="0"
        />
        {watchedType === 'OUT' && selectedProduct && (
          <p className="text-xs text-[#4B5563] mt-1">
            Maks: {selectedProduct.stock}
          </p>
        )}
      </FormField>

      <FormField id="notes" label="Catatan">
        <textarea
          id="notes"
          {...register('notes')}
          rows={2}
          className={`${InputClass(false)} resize-none`}
          placeholder="Catatan transaksi (opsional)"
        />
      </FormField>
    </FormModal>
  );
}
