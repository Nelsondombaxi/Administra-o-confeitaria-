import type { Order } from '../../types';
import { OrderRow } from './OrderRow';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export function OrderTable({ orders, onViewDetails }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-[#e6dec5] p-6">
        <p className="text-sm font-bold text-[#2b1810]">Nenhum pedido encontrado</p>
        <p className="text-xs text-[#5c3524] mt-1">Não existem pedidos correspondentes ao filtro selecionado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderRow 
          key={order.id} 
          order={order} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
}