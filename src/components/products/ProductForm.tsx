import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategoryId(initialData.category_id || initialData.categoryId || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price ? initialData.price.toString() : '');
      setAvailable(initialData.is_active ?? initialData.available ?? true);
      setImageUrl(initialData.image_url || initialData.imageUrl || '');
    } else if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [initialData, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      name, 
      categoryId, 
      description, 
      price: Number(price), 
      available,
      imageUrl 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Foto do produto</label>
        {imageUrl ? (
          <div className="relative w-full h-32 rounded-2xl border border-[#e6dec5] overflow-hidden bg-[#fdfbf7] flex items-center justify-center">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-[#e6dec5] rounded-2xl p-6 text-center bg-[#fdfbf7] hover:bg-[#f4efe6]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs text-[#5c3524] font-medium">
              {uploading ? 'A carregar...' : 'Upload da imagem'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Nome</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Bolo de Chocolate Supremo"
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Categoria</label>
        <select 
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          required
        >
          <option value="" disabled>Selecione uma categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Descrição</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes sobre os ingredientes e sabor..."
          rows={3}
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059] resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Preço (Kz)</label>
        <input 
          type="number" 
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          required
        />
      </div>

      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="w-4 h-4 accent-[#c5a059] rounded"
          />
          <span className="text-xs font-bold text-[#2b1810]">Disponível para venda</span>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f4efe6]">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-xs font-bold transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer shadow-sm border border-[#c5a059]/30"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}