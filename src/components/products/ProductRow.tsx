import type { Product } from '../../types/product';
import { Edit, Trash2 } from 'lucide-react';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e6dec5] p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#c5a059]/50 transition-all">
      <div className="flex items-center gap-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-16 h-16 rounded-xl object-cover border border-[#e6dec5] shrink-0"
        />
        <div>
          <h4 className="text-base font-bold text-[#2b1810] font-serif">{product.name}</h4>
          <span className="text-xs bg-[#f4efe6] text-[#5c3524] px-2.5 py-0.5 rounded-full font-medium inline-block mt-1 border border-[#e6dec5]">
            {product.categoryName}
          </span>
          <p className="text-xs text-[#5c3524] mt-1.5 line-clamp-1">{product.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#f4efe6]">
        <div className="text-left md:text-right">
          <span className="text-sm font-black text-[#2b1810] block font-serif">{product.price.toLocaleString()} Kz</span>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold mt-0.5 ${product.available ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className={`w-2 h-2 rounded-full ${product.available ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            {product.available ? 'Disponível' : 'Indisponível'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="px-3.5 py-2 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-[#e6dec5]"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-all cursor-pointer border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}