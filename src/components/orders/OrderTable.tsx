import type { Order } from '../../types';

import {
  PackageOpen,
  SearchX,
} from 'lucide-react';

import { OrderRow } from './OrderRow';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export function OrderTable({
  orders,
  onViewDetails,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#e6dec5] bg-white px-6 py-12 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e6dec5] bg-[#f4efe6] text-[#8c5338]">
          <SearchX
            className="h-6 w-6"
            aria-hidden="true"
          />
        </div>

        <h3 className="mt-4 font-serif text-base font-black text-[#2b1810]">
          Nenhum pedido encontrado
        </h3>

        <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#8c5338]">
          Não existem pedidos correspondentes aos
          filtros ou à pesquisa selecionada.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Lista de pedidos"
      className="space-y-3"
    >
      <div className="flex items-center gap-2 px-1">
        <PackageOpen
          className="h-4 w-4 text-[#c5a059]"
          aria-hidden="true"
        />

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c5338]">
          Pedidos
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}