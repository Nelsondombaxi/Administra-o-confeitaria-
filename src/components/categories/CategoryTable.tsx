import type { Category } from '../../types';
import { CategoryRow } from './CategoryRow';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[#e6dec5] p-6">
        <p className="text-sm font-bold text-[#2b1810]">Nenhuma categoria encontrada</p>
        <p className="text-xs text-[#5c3524] mt-1">Crie a sua primeira categoria para organizar a vitrine.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryRow 
          key={category.id} 
          category={category} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}