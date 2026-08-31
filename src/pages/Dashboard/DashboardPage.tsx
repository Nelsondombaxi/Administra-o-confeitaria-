import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export function DashboardPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeProductsCount, setActiveProductsCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const ordersData = await orderService.getAllOrders();
        if (ordersData) {
          setTotalOrders(ordersData.length);
          const pending = ordersData.filter((item: any) => !item.status || item.status === 'pending');
          setPendingCount(pending.length);
          setRecentOrders(ordersData.slice(0, 3));
        }

        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        if (!error && count !== null) {
          setActiveProductsCount(count);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Raquel Dombaxi</h1>
          <p className="text-sm text-[#5c3524] mt-1">Aqui está o resumo executivo da confeitaria Veyra.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f4efe6] rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-[#8c5338] uppercase tracking-wider relative z-10">Total Pedidos</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">{totalOrders}</p>
          <span className="text-[10px] text-[#5c3524] mt-1 block relative z-10">Atualizado da base de dados</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider relative z-10">Pendentes</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">{pendingCount}</p>
          <span className="text-[10px] text-amber-800/80 mt-1 block relative z-10">A aguardar confirmação de pagamento</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f4efe6] rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-[#8c5338] uppercase tracking-wider relative z-10">Produtos Ativos</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">{activeProductsCount}</p>
          <span className="text-[10px] text-[#5c3524] mt-1 block relative z-10">Disponíveis na vitrine</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e6dec5] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f4efe6]">
          <h3 className="text-base font-bold text-[#2b1810] font-serif">Pedidos recentes</h3>
          <button 
            onClick={() => onNavigate('orders')}
            className="text-xs text-[#8c5338] font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Ver todos
          </button>
        </div>
        
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#5c3524] text-center py-4">Nenhum pedido recente encontrado.</p>
          ) : (
            recentOrders.map((order: any) => {
              const rawTotal = order.total_amount || order.total || 0;
              const formattedPrice = new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA',
              }).format(rawTotal).replace('AOA', 'Kz');

              const isPending = !order.status || order.status === 'pending';
              const customerName = order.customer_name || 'Cliente';
              const productName = order.product_name || 'Produto';

              return (
                <div key={order.id} className="flex items-center justify-between p-3.5 bg-[#fdfbf7] rounded-xl border border-[#e6dec5]/60 hover:bg-[#f4efe6]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-[#2b1810] text-[#c5a059] px-2.5 py-1 rounded-lg font-mono">
                      #{order.id.slice(0, 4)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#2b1810]">{customerName}</p>
                      <p className="text-xs text-[#5c3524]">{productName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#2b1810] block">{formattedPrice}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isPending ? 'Pendente' : 'Confirmado'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}