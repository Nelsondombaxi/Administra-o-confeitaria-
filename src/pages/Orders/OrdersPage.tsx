import { useState } from 'react';
import { mockOrders } from '../../data/mocks/orders.mock';
import { OrderTable } from '../../components/orders/OrderTable';
import type{ Order } from '../../types';
import { Search, Filter } from 'lucide-react';

export function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    alert(`Abrir detalhes e comprovativo do pedido: ${order.id} - ${order.customerName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Gestão de Pedidos</h1>
          <p className="text-sm text-[#5c3524] mt-1">Acompanhe os pedidos recebidos e os comprovativos de pagamento.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Pesquisar por cliente, ID ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8c5338]" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="all">Todos os estados</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmados</option>
            <option value="production">Em Produção</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>
      </div>

      <OrderTable 
        orders={filteredOrders} 
        onViewDetails={handleViewDetails} 
      />
    </div>
  );
}