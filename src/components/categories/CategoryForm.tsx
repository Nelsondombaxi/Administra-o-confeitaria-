import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Loader2 } from 'lucide-react';

interface CategoryFormProps {
  initialData?: {
    name: string;
    description: string;
    image_url?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setImageUrl(initialData.image_url || '');
    }
  }, [initialData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao carregar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, image_url: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Foto da categoria</label>
        <div className="border-2 border-dashed border-[#e6dec5] rounded-2xl p-4 text-center relative hover:border-[#c5a059] transition-all bg-[#fdfbf7]">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#5c3524]" />
              <span className="text-xs text-[#5c3524] mt-2">A carregar imagem...</span>
            </div>
          ) : imageUrl ? (
            <div className="relative flex flex-col items-center">
              <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl mb-2 border border-[#e6dec5]" />
              <span className="text-xs font-bold text-[#5c3524]">Clique para alterar a imagem</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 rounded-xl bg-[#f4efe6] flex items-center justify-center text-[#5c3524] mb-2 border border-[#e6dec5]">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#5c3524]">Upload da imagem</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Nome da categoria</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Bolos Festivos"
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Descrição</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descrição da categoria..."
          rows={3}
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059] resize-none"
        />
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
          disabled={uploading}
          className="px-5 py-2.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer shadow-sm border border-[#c5a059]/30 disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}