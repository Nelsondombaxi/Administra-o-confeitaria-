import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface ProductFormProps {
  initialData?: {
    name: string;
    category: string;
    description: string;
    price: number;
    available: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bolos');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setPrice(initialData.price.toString());
      setAvailable(initialData.available);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category, description, price: Number(price), available });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#2b1810]">Foto do produto</label>
        <div className="border-2 border-dashed border-[#e6dec5] rounded-2xl p-6 text-center bg-[#fdfbf7] hover:bg-[#f4efe6]/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs text-[#5c3524] font-medium">Upload da imagem</span>
        </div>
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
        >
          <option value="Bolos">Bolos</option>
          <option value="Salgados">Salgados</option>
          <option value="Doces">Doces</option>
          <option value="Bebidas">Bebidas</option>
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