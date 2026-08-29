import { useState, useEffect } from 'react';

interface CategoryFormProps {
  initialData?: {
    name: string;
    description: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="px-5 py-2.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer shadow-sm border border-[#c5a059]/30"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}