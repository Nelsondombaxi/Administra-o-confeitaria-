import type { SyntheticEvent } from 'react';
import type { Product } from '../../types/product';

import {
  Edit,
  ImageOff,
  Trash2,
} from 'lucide-react';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60';

export function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const formattedPrice = Number(product.price).toLocaleString(
    'pt-AO',
    {
      maximumFractionDigits: 0,
    }
  );

  const imageUrl =
    product.imageUrl?.trim() || DEFAULT_PRODUCT_IMAGE;

  const categoryName =
    product.categoryName?.trim() || 'Sem categoria';

  const description =
    product.description?.trim() || 'Sem descrição disponível.';

  const handleImageError = (
    event: SyntheticEvent<HTMLImageElement>
  ) => {
    if (event.currentTarget.src === DEFAULT_PRODUCT_IMAGE) {
      return;
    }

    event.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
  };

  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    onDelete(product.id);
  };

  return (
    <article
      className="
        group flex flex-col gap-4 rounded-2xl
        border border-[#e6dec5] bg-white p-4
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:border-[#c5a059]/50
        hover:shadow-md
        sm:p-5
        md:flex-row md:items-center md:justify-between
      "
    >
      {/* Produto */}
      <div className="flex min-w-0 items-center gap-4">
        {/* Imagem */}
        <div
          className="
            relative h-16 w-16 shrink-0 overflow-hidden
            rounded-xl border border-[#e6dec5]
            bg-[#f4efe6] shadow-sm
            sm:h-[72px] sm:w-[72px]
          "
        >
          <img
            src={imageUrl}
            alt={`Imagem de ${product.name}`}
            onError={handleImageError}
            loading="lazy"
            className="
              h-full w-full object-cover
              transition-transform duration-300
              group-hover:scale-105
            "
          />

          {!product.imageUrl?.trim() && (
            <div
              className="
                pointer-events-none absolute inset-0
                flex items-center justify-center
                bg-[#f4efe6]/80
              "
            >
              <ImageOff
                className="h-5 w-5 text-[#8c5338]"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h4
              className="
                max-w-[220px] truncate
                font-serif text-base font-bold
                text-[#2b1810]
              "
              title={product.name}
            >
              {product.name}
            </h4>

            <span
              className="
                shrink-0 rounded-full
                border border-[#e6dec5]
                bg-[#f4efe6] px-2.5 py-1
                text-[10px] font-bold uppercase
                tracking-wide text-[#5c3524]
              "
            >
              {categoryName}
            </span>
          </div>

          <p
            className="
              mt-1.5 max-w-[500px]
              truncate text-xs leading-relaxed
              text-[#8c5338]
            "
            title={description}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Informações + ações */}
      <div
        className="
          flex w-full items-center
          justify-between gap-4
          border-t border-[#f4efe6]
          pt-3
          sm:gap-6
          md:w-auto md:border-t-0 md:pt-0
        "
      >
        {/* Preço + disponibilidade */}
        <div className="min-w-0">
          <span
            className="
              block font-serif text-base font-black
              tracking-tight text-[#2b1810]
            "
          >
            {formattedPrice} Kz
          </span>

          <span
            className={`
              mt-1 inline-flex items-center gap-1.5
              text-[11px] font-bold
              ${
                product.available
                  ? 'text-emerald-700'
                  : 'text-stone-400'
              }
            `}
          >
            <span
              className={`
                h-2 w-2 rounded-full
                ${
                  product.available
                    ? 'bg-emerald-500'
                    : 'bg-stone-300'
                }
              `}
              aria-hidden="true"
            />

            {product.available
              ? 'Disponível'
              : 'Indisponível'}
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            title={`Editar ${product.name}`}
            aria-label={`Editar ${product.name}`}
            className="
              flex h-9 cursor-pointer items-center
              justify-center gap-1.5 rounded-xl
              border border-[#e6dec5]
              bg-[#f4efe6] px-3
              text-xs font-bold text-[#5c3524]
              transition-all duration-200
              hover:border-[#c5a059]/50
              hover:bg-[#e6dec5]
              focus:outline-none
              focus:ring-2 focus:ring-[#c5a059]/50
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
            title={`Eliminar ${product.name}`}
            aria-label={`Eliminar ${product.name}`}
            className="
              flex h-9 w-9 cursor-pointer
              items-center justify-center
              rounded-xl border border-red-200
              bg-red-50 text-red-600
              transition-all duration-200
              hover:border-red-300
              hover:bg-red-100
              focus:outline-none
              focus:ring-2 focus:ring-red-300
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