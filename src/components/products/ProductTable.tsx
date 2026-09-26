import type { Product } from '../../types/product';

import {
  PackageOpen,
  SearchX,
} from 'lucide-react';

import { ProductRow } from './ProductRow';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  hasSearch?: boolean;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  hasSearch = false,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div
        className="
          rounded-2xl border border-[#e6dec5]
          bg-white p-8 shadow-sm
          sm:p-10
        "
      >
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div
            className="
              mb-5 flex h-14 w-14
              items-center justify-center
              rounded-2xl border border-[#e6dec5]
              bg-[#f4efe6] text-[#8c5338]
            "
          >
            {hasSearch ? (
              <SearchX
                className="h-6 w-6"
                aria-hidden="true"
              />
            ) : (
              <PackageOpen
                className="h-6 w-6"
                aria-hidden="true"
              />
            )}
          </div>

          <h3
            className="
              font-serif text-base font-bold
              text-[#2b1810]
            "
          >
            {hasSearch
              ? 'Nenhum produto encontrado'
              : 'Ainda não existem produtos'}
          </h3>

          <p
            className="
              mt-2 text-xs leading-5
              text-[#8c5338]
            "
          >
            {hasSearch
              ? 'Tente pesquisar usando outro nome ou categoria.'
              : 'Adicione o primeiro produto para começar a preencher a vitrine.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Lista de produtos"
      className="space-y-3"
    >
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}