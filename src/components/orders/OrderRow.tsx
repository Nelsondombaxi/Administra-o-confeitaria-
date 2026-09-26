import type { Order } from '../../types';

import {
  CheckCircle2,
  Clock3,
  Eye,
  HelpCircle,
  PackageCheck,
} from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderRow({
  order,
  onViewDetails,
}: OrderRowProps) {
  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
      icon: typeof Clock3;
    }
  > = {
    pending: {
      label: 'Pendente',
      className:
        'border-amber-200 bg-amber-50 text-amber-700',
      icon: Clock3,
    },

    // Mantido para compatibilidade com pedidos antigos.
    // Na interface, "confirmed" aparece como "Em produção".
    confirmed: {
      label: 'Em produção',
      className:
        'border-orange-200 bg-orange-50 text-orange-700',
      icon: PackageCheck,
    },

    production: {
      label: 'Em produção',
      className:
        'border-orange-200 bg-orange-50 text-orange-700',
      icon: PackageCheck,
    },

    completed: {
      label: 'Concluído',
      className:
        'border-green-200 bg-green-50 text-green-700',
      icon: CheckCircle2,
    },
  };

  const currentStatus = statusConfig[order.status] || {
    label: 'Desconhecido',
    className:
      'border-gray-200 bg-gray-50 text-gray-700',
    icon: HelpCircle,
  };

  const StatusIcon = currentStatus.icon;

  const rawTotal =
    Number(
      (order as Order & {
        totalValue?: number | null;
        total?: number | null;
      }).totalValue ??
        (order as Order & {
          total?: number | null;
        }).total ??
        0,
    ) || 0;

  const formattedPrice = new Intl.NumberFormat(
    'pt-AO',
    {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0,
    },
  )
    .format(rawTotal)
    .replace('AOA', 'Kz');

  const shortId = order.id
    ? `#${order.id.slice(0, 6).toUpperCase()}`
    : '#PEDIDO';

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(
        'pt-AO',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      )
    : 'Data não disponível';

  return (
    <article className="group rounded-2xl border border-[#e6dec5] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#c5a059]/50 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Informações do pedido */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h4
              className="truncate font-serif text-base font-black text-[#2b1810]"
              title={order.customerName}
            >
              {order.customerName || 'Cliente'}
            </h4>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${currentStatus.className}`}
            >
              <StatusIcon
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              <span>{currentStatus.label}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5c3524]">
            <span className="font-mono font-bold text-[#c5a059]">
              {shortId}
            </span>

            <span
              className="hidden text-[#c5a059]/60 sm:inline"
              aria-hidden="true"
            >
              •
            </span>

            <span
              className="max-w-full truncate"
              title={order.productName}
            >
              {order.productName || 'Produto'}
            </span>

            <span
              className="hidden text-[#c5a059]/60 sm:inline"
              aria-hidden="true"
            >
              •
            </span>

            <span className="text-[#8c5338]">
              {createdAt}
            </span>
          </div>
        </div>

        {/* Total + ação */}
        <div className="flex w-full items-center justify-between gap-4 border-t border-[#f4efe6] pt-4 md:w-auto md:justify-end md:border-t-0 md:pt-0">
          <div className="text-left md:text-right">
            <span className="block font-serif text-sm font-black text-[#2b1810]">
              {formattedPrice}
            </span>

            <span className="mt-0.5 block text-[10px] font-medium text-[#8c5338]">
              Total do pedido
            </span>
          </div>

          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e6dec5] bg-[#f4efe6] px-3.5 text-xs font-bold text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#e6dec5] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:ring-offset-1"
            aria-label={`Ver detalhes do pedido ${shortId}`}
          >
            <Eye
              className="h-4 w-4 text-[#c5a059]"
              aria-hidden="true"
            />

            <span>Ver detalhes</span>
          </button>
        </div>
      </div>
    </article>
  );
}