import type { Order } from '../../types';
import { Eye, Clock, CheckCircle2, Flame, PackageCheck, HelpCircle } from 'lucide-react';

interface OrderRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderRow({ order, onViewDetails }: OrderRowProps) {
  const statusConfig: Record<string, { label: string; bg: string; icon: any }> = {
    pending: {
      label: 'Pendente',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
    },
    confirmed: {
      label: 'Confirmado',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2,
    },
    production: {
      label: 'Em Produção',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Flame,
    },
    completed: {
      label: 'Concluído',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: PackageCheck,
    },
  };

  const currentStatus = statusConfig[order.status] || {
    label: order.status || 'Desconhecido',
    bg: 'bg-gray-50 text-gray-700 border-gray-200',
    icon: HelpCircle,
  };
  
  const StatusIcon = currentStatus.icon;

  const rawTotal = (order as any).totalValue !== undefined ? (order as any).totalValue : (order as any).total || 0;
  const formattedPrice = new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  }).format(rawTotal).replace('AOA', 'Kz');

  const shortId = order.id ? `#${order.id.slice(0, 4)}` : '#1000';

  return (
    <div className="bg-white rounded-2xl border border-[#e6dec5] p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#c5a059]/50 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h4 className="text-base font-bold text-[#2b1810] font-serif">{order.customerName}</h4>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${currentStatus.bg}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{currentStatus.label}</span>
          </span>
        </div>
        <p className="text-xs text-[#5c3524]">
          <span className="font-mono text-[#c5a059] font-bold mr-2">{shortId}</span>
          {order.productName} • <span className="text-[#8c5338]">{order.createdAt}</span>
        </p>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-[#f4efe6]">
        <div className="text-left md:text-right">
          <span className="text-sm font-black text-[#2b1810] block">{formattedPrice}</span>
          <span className="text-xs text-[#8c5338] mt-0.5 block font-medium">Total do pedido</span>
        </div>

        <button 
          onClick={() => onViewDetails(order)}
          className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border border-[#e6dec5]"
        >
          <Eye className="w-4 h-4 text-[#c5a059]" />
          <span>Ver detalhes</span>
        </button>
      </div>
    </div>
  );
}