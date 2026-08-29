import type { Category } from '../../types';
import { Edit, Trash2, FolderHeart } from 'lucide-react';

interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6dec5] p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#c5a059]/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#f4efe6] text-[#c5a059] flex items-center justify-center shrink-0 border border-[#e6dec5]">
          <FolderHeart className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-[#2b1810] font-serif">{category.name}</h4>
          <p className="text-xs text-[#5c3524] mt-1">{category.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#f4efe6]">
        <div className="text-left md:text-right">
          <span className="text-sm font-black text-[#2b1810] block">{category.productCount}</span>
          <span className="text-xs text-[#8c5338] mt-0.5 block font-medium">Produtos associados</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(category)}
            className="px-3.5 py-2 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-[#e6dec5]"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
          <button 
            onClick={() => onDelete(category.id)}
            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all cursor-pointer border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}