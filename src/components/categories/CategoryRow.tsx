import {
  Edit,
  FolderTree,
  Package,
  Trash2,
} from 'lucide-react';

import type { Category } from '../../types';

interface CategoryRowProps {
  category: Category & {
    productCount?: number;
  };

  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryRow({
  category,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const description =
    category.description?.trim() || 'Sem descrição disponível.';

  const productCount = category.productCount ?? 0;

  const handleEdit = () => {
    onEdit(category);
  };

  const handleDelete = () => {
    onDelete(category.id);
  };

  return (
    <article
      className="
        group flex flex-col gap-4
        rounded-2xl border border-[#e6dec5]
        bg-white p-4 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[#c5a059]/50
        hover:shadow-md
        sm:p-5
        md:flex-row md:items-center
        md:justify-between
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="
            flex h-14 w-14 shrink-0
            items-center justify-center
            rounded-2xl
            border border-[#e6dec5]
            bg-[#f4efe6]
            text-[#5c3524]
            transition-all duration-200
            group-hover:border-[#c5a059]/40
            group-hover:bg-[#efe6d5]
          "
          aria-hidden="true"
        >
          <FolderTree className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h4
              className="
                min-w-0 truncate
                font-serif text-base font-bold
                text-[#2b1810]
                sm:text-[17px]
              "
              title={category.name}
            >
              {category.name}
            </h4>
          </div>

          <p
            className="
              mt-1.5 max-w-[520px]
              line-clamp-2
              text-xs leading-5
              text-[#8c5338]
            "
            title={description}
          >
            {description}
          </p>

          {category.slug && (
            <span
              className="
                mt-2 inline-flex max-w-full
                truncate rounded-full
                border border-[#e6dec5]
                bg-[#fdfbf7]
                px-2.5 py-1
                text-[9px] font-bold
                uppercase tracking-wide
                text-[#8c5338]
              "
              title={category.slug}
            >
              {category.slug}
            </span>
          )}
        </div>
      </div>

      <div
        className="
          flex w-full items-center
          justify-between gap-4
          border-t border-[#f4efe6]
          pt-3
          sm:gap-6
          md:w-auto
          md:border-t-0
          md:pt-0
        "
      >
        <div
          className="
            flex items-center gap-3
            rounded-xl
            bg-[#fdfbf7]
            px-3 py-2
          "
        >
          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              bg-[#f4efe6]
              text-[#5c3524]
            "
            aria-hidden="true"
          >
            <Package className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <span
              className="
                block font-serif text-sm
                font-black text-[#2b1810]
              "
            >
              {productCount}
            </span>

            <span
              className="
                block text-[10px]
                font-medium text-[#8c5338]
              "
            >
              {productCount === 1
                ? 'produto'
                : 'produtos'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            title={`Editar ${category.name}`}
            aria-label={`Editar categoria ${category.name}`}
            className="
              flex h-9 cursor-pointer
              items-center justify-center
              gap-1.5 rounded-xl
              border border-[#e6dec5]
              bg-[#f4efe6]
              px-3
              text-xs font-bold
              text-[#5c3524]
              transition-all duration-200
              hover:border-[#c5a059]/50
              hover:bg-[#e6dec5]
              focus:outline-none
              focus:ring-2
              focus:ring-[#c5a059]/50
              focus:ring-offset-1
            "
          >
            <Edit
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            <span className="hidden sm:inline">
              Editar
            </span>
          </button>

          <button
            type="button"
            onClick={handleDelete}
            title={`Eliminar ${category.name}`}
            aria-label={`Eliminar categoria ${category.name}`}
            className="
              flex h-9 w-9 cursor-pointer
              items-center justify-center
              rounded-xl
              border border-red-200
              bg-red-50
              text-red-600
              transition-all duration-200
              hover:border-red-300
              hover:bg-red-100
              focus:outline-none
              focus:ring-2
              focus:ring-red-300
              focus:ring-offset-1
            "
          >
            <Trash2
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}