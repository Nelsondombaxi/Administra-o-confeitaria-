import {
  FolderOpen,
  SearchX,
} from 'lucide-react';

import type { Category } from '../../types';

import { CategoryRow } from './CategoryRow';

interface CategoryTableProps {
  categories: Category[];

  onEdit: (category: Category) => void;

  onDelete: (id: string) => void;

  hasSearch?: boolean;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  hasSearch = false,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border border-[#e6dec5]
          bg-white
          p-8
          shadow-sm
          sm:p-10
        "
      >
        <div
          className="
            mx-auto flex max-w-md
            flex-col items-center
            text-center
          "
        >
          <div
            className="
              mb-5 flex h-14 w-14
              items-center justify-center
              rounded-2xl
              border border-[#e6dec5]
              bg-[#f4efe6]
              text-[#5c3524]
            "
          >
            {hasSearch ? (
              <SearchX
                className="h-6 w-6"
                aria-hidden="true"
              />
            ) : (
              <FolderOpen
                className="h-6 w-6"
                aria-hidden="true"
              />
            )}
          </div>

          <h3
            className="
              font-serif text-base
              font-bold text-[#2b1810]
            "
          >
            {hasSearch
              ? 'Nenhuma categoria encontrada'
              : 'Ainda não existem categorias'}
          </h3>

          <p
            className="
              mt-2 text-xs leading-5
              text-[#8c5338]
            "
          >
            {hasSearch
              ? 'Tente pesquisar usando outro nome ou descrição.'
              : 'Crie a sua primeira categoria para começar a organizar a vitrine.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Lista de categorias"
      className="space-y-3"
    >
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}