import type { Product } from '../../types/product';
import { ProductRow } from './ProductRow';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[#e6dec5] p-6">
        <p className="text-sm font-bold text-[#2b1810]">Nenhum produto encontrado</p>
        <p className="text-xs text-[#5c3524] mt-1">Tente adicionar um novo produto à vitrine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductRow 
          key={product.id} 
          product={product} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}