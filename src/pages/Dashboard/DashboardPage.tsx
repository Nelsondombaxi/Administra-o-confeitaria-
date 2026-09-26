import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Clock3,
  Loader2,
  Package,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { orderService } from '../../services/orderService';
import { supabase } from '../../lib/supabase';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

interface DashboardOrder {
  id: string;
  status?: string | null;
  payment_status?: string | null;
  total_amount?: number | null;
  total?: number | null;
  customer_name?: string | null;
  product_name?: string | null;
  productName?: string | null;
  created_at?: string | null;
  products?: {
    name?: string | null;
  } | null;
}

export function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeProductsCount, setActiveProductsCount] =
    useState(0);

  const [recentOrders, setRecentOrders] = useState<
    DashboardOrder[]
  >([]);

  const [loading, setLoading] = useState(true);

  const {
    settings,
    loading: settingsLoading,
  } = useAdminSettings();

  const adminName =
    settings?.admin_dashboard_name?.trim() ||
    'Administrador';

  const fetchDashboardData = useCallback(async () => {
    try {
      const [ordersData, productsResult] =
        await Promise.all([
          orderService.getAllOrders(),
          supabase
            .from('products')
            .select('*', {
              count: 'exact',
              head: true,
            })
            .eq('is_active', true),
        ]);

      const orders = (ordersData ??
        []) as DashboardOrder[];

      setTotalOrders(orders.length);

      const pending = orders.filter((order) => {
        const status = order.status;
        const paymentStatus = order.payment_status;

        return (
          !status ||
          status === 'pending' ||
          status === 'pending_payment' ||
          paymentStatus === 'pending_payment'
        );
      });

      setPendingCount(pending.length);

      setRecentOrders(
        orders
          .sort((a, b) => {
            const dateA = a.created_at
              ? new Date(a.created_at).getTime()
              : 0;

            const dateB = b.created_at
              ? new Date(b.created_at).getTime()
              : 0;

            return dateB - dateA;
          })
          .slice(0, 3),
      );

      if (
        !productsResult.error &&
        productsResult.count !== null
      ) {
        setActiveProductsCount(productsResult.count);
      }
    } catch (error: unknown) {
      console.error(
        'Erro ao carregar dados do dashboard:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboardData();

    const ordersChannel = supabase
      .channel('dashboard-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          void fetchDashboardData();
        },
      )
      .subscribe();

    const productsChannel = supabase
      .channel('dashboard-products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          void fetchDashboardData();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(ordersChannel);
      void supabase.removeChannel(productsChannel);
    };
  }, [fetchDashboardData]);

  if (loading || settingsLoading) {
    return (
      <div
        className="flex min-h-[320px] items-center justify-center"
        role="status"
        aria-label="A carregar dashboard"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e6dec5] bg-white shadow-sm">
            <Loader2
              className="h-6 w-6 animate-spin text-[#c5a059]"
              aria-hidden="true"
            />
          </div>

          <span className="text-xs font-medium text-[#8c5338]">
            A carregar dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-2xl border border-[#e6dec5] bg-[#f4efe6] shadow-sm">
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[#e6dec5]/50" />
        <div className="absolute -bottom-20 right-20 h-32 w-32 rounded-full bg-[#c5a059]/10" />

        <div className="relative flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#c5a059]/30 bg-white text-[#5c3524] shadow-sm">
            <Sparkles
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c5338]">
              Painel administrativo
            </p>

            <h1 className="font-serif text-2xl font-black tracking-tight text-[#2b1810]">
              {adminName}
            </h1>

            <p className="mt-1 text-sm leading-6 text-[#5c3524]">
              Aqui está o resumo executivo da
              confeitaria.
            </p>
          </div>
        </div>
      </section>

      {/* Resumo */}
      <section
        aria-label="Resumo do dashboard"
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {/* Total de pedidos */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e6dec5] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c5a059]/50 hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f4efe6] transition-transform duration-300 group-hover:scale-110" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c5338]">
                  Total Pedidos
                </p>

                <p className="mt-2 font-serif text-3xl font-black tracking-tight text-[#2b1810]">
                  {totalOrders}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6dec5] bg-[#fdfbf7] text-[#5c3524] transition-colors group-hover:border-[#c5a059]/40 group-hover:text-[#c5a059]">
                <ShoppingBag
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-[#f4efe6] pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />

              <span className="text-[10px] font-medium text-[#5c3524]">
                Atualizado em tempo real
              </span>
            </div>
          </div>
        </div>

        {/* Pendentes */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition-transform duration-300 group-hover:scale-110" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Pendentes
                </p>

                <p className="mt-2 font-serif text-3xl font-black tracking-tight text-[#2b1810]">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
                <Clock3
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-amber-100 pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

              <span className="text-[10px] font-medium text-amber-800/80">
                A aguardar confirmação de pagamento
              </span>
            </div>
          </div>
        </div>

        {/* Produtos ativos */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#e6dec5] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c5a059]/50 hover:shadow-md">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#f4efe6] transition-transform duration-300 group-hover:scale-110" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c5338]">
                  Produtos Ativos
                </p>

                <p className="mt-2 font-serif text-3xl font-black tracking-tight text-[#2b1810]">
                  {activeProductsCount}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6dec5] bg-[#fdfbf7] text-[#5c3524] transition-colors group-hover:border-[#c5a059]/40 group-hover:text-[#c5a059]">
                <Package
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-[#f4efe6] pt-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />

              <span className="text-[10px] font-medium text-[#5c3524]">
                Atualizado em tempo real
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pedidos recentes */}
      <section className="rounded-2xl border border-[#e6dec5] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#f4efe6] pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c5338]">
              Atividade
            </p>

            <h2 className="mt-1 font-serif text-lg font-black text-[#2b1810]">
              Pedidos recentes
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="cursor-pointer rounded-xl border border-[#e6dec5] bg-[#fdfbf7] px-3.5 py-2 text-[11px] font-bold text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#f4efe6] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-2.5">
          {recentOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e6dec5] bg-[#fdfbf7] px-4 py-8 text-center">
              <ShoppingBag
                className="mx-auto h-6 w-6 text-[#c5a059]"
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-bold text-[#2b1810]">
                Nenhum pedido recente encontrado.
              </p>

              <p className="mt-1 text-[10px] text-[#8c5338]">
                Os novos pedidos aparecerão aqui.
              </p>
            </div>
          ) : (
            recentOrders.map((order) => {
              const rawTotal =
                order.total_amount ??
                order.total ??
                0;

              const formattedPrice =
                new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA',
                  maximumFractionDigits: 0,
                })
                  .format(Number(rawTotal) || 0)
                  .replace('AOA', 'Kz');

              const status =
                order.status || 'pending';

              const isPending =
                status === 'pending' ||
                status === 'pending_payment' ||
                order.payment_status ===
                  'pending_payment';

              const isProduction =
                status === 'production';

              const isCompleted =
                status === 'completed';

              const customerName =
                order.customer_name?.trim() ||
                'Cliente';

              const productName =
                order.products?.name?.trim() ||
                order.product_name?.trim() ||
                order.productName?.trim() ||
                'Produto';

              const shortId = order.id
                ? `#${order.id
                    .slice(0, 6)
                    .toUpperCase()}`
                : '#PEDIDO';

              let statusLabel = 'Pendente';

              if (isProduction) {
                statusLabel = 'Em produção';
              } else if (isCompleted) {
                statusLabel = 'Concluído';
              }

              let statusClass =
                'border-amber-200 bg-amber-50 text-amber-800';

              let dotClass =
                'bg-amber-500';

              if (isProduction) {
                statusClass =
                  'border-blue-200 bg-blue-50 text-blue-800';

                dotClass = 'bg-blue-500';
              }

              if (isCompleted) {
                statusClass =
                  'border-emerald-200 bg-emerald-50 text-emerald-800';

                dotClass = 'bg-emerald-500';
              }

              return (
                <div
                  key={order.id}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-[#e6dec5]/70 bg-[#fdfbf7] p-3.5 transition-all duration-200 hover:border-[#c5a059]/40 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 min-w-14 shrink-0 items-center justify-center rounded-xl bg-[#2b1810] px-2 font-mono text-[10px] font-bold text-[#c5a059]">
                      {shortId}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#2b1810]">
                        {customerName}
                      </p>

                      <p className="mt-0.5 truncate text-[11px] text-[#5c3524]">
                        {productName}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="font-serif text-sm font-black text-[#2b1810]">
                      {formattedPrice}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
                      />

                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}