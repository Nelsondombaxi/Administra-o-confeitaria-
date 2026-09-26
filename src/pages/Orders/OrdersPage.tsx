import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CheckCircle2,
  Clock3,
  Filter,
  Loader2,
  PackageCheck,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { orderService } from '../../services/orderService';
import { OrderTable } from '../../components/orders/OrderTable';
import { OrderDetailsModal } from '../../components/orders/OrderDetailsModal';

import type { Order } from '../../types';

type RealtimeOrder = {
  id?: string;
  product_id?: string | null;
  quantity?: number | null;
  total?: number | null;
  total_amount?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  payment_method?: string | null;
  payment_proof_url?: string | null;
  payment_status?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: string;
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getAllOrders();

      const formattedOrders: Order[] = data.map((item) => {
        const totalValue = Number(
          item.total_amount ?? item.total ?? 0,
        );

        const productName =
          typeof item.products?.name === 'string'
            ? item.products.name
            : typeof item.product_name === 'string'
              ? item.product_name
              : 'Produto';

        return {
          id: item.id,

          customerName:
            item.customer_name || 'Cliente',

          customerPhone:
            item.customer_phone || '',

          customerAddress:
            item.customer_address || '',

          productName,

          quantity: Number(
            item.quantity ?? 1,
          ),

          status:
            (item.status as Order['status']) ||
            'pending',

          total: totalValue,

          totalValue,

          createdAt: item.created_at,

          paymentStatus:
            (item.payment_status as Order['paymentStatus']) ||
            'pending_payment',

          paymentMethod:
            item.payment_method || '',

          paymentProofUrl:
            item.payment_proof_url || '',

          notes:
            item.notes || '',
        };
      });

      setOrders(formattedOrders);
    } catch (error) {
      console.error(
        'Erro ao carregar pedidos:',
        error,
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        () => {

          void fetchOrders();
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const updatedOrder =
            payload.new as RealtimeOrder;

          const updatedId = updatedOrder.id;

          if (!updatedId) {
            return;
          }

          setOrders((currentOrders) =>
            currentOrders.map((order) => {
              if (order.id !== updatedId) {
                return order;
              }

              const nextTotal =
                updatedOrder.total_amount != null
                  ? Number(
                      updatedOrder.total_amount,
                    )
                  : updatedOrder.total != null
                    ? Number(
                        updatedOrder.total,
                      )
                    : order.total;

              return {
                ...order,

                status:
                  (updatedOrder.status as Order['status']) ??
                  order.status,

                paymentStatus:
                  (updatedOrder.payment_status as Order['paymentStatus']) ??
                  order.paymentStatus,

                total: nextTotal,

                totalValue: nextTotal,

                customerName:
                  updatedOrder.customer_name ??
                  order.customerName,

                customerPhone:
                  updatedOrder.customer_phone ??
                  order.customerPhone,

                customerAddress:
                  updatedOrder.customer_address ??
                  order.customerAddress,

                paymentMethod:
                  updatedOrder.payment_method ??
                  order.paymentMethod,

                paymentProofUrl:
                  updatedOrder.payment_proof_url ??
                  order.paymentProofUrl,

                notes:
                  updatedOrder.notes ??
                  order.notes,

                quantity:
                  updatedOrder.quantity ??
                  order.quantity,
              };
            }),
          );

          setSelectedOrder((currentOrder) => {
            if (
              !currentOrder ||
              currentOrder.id !== updatedId
            ) {
              return currentOrder;
            }

            const nextTotal =
              updatedOrder.total_amount != null
                ? Number(
                    updatedOrder.total_amount,
                  )
                : updatedOrder.total != null
                  ? Number(
                      updatedOrder.total,
                    )
                  : currentOrder.total;

            return {
              ...currentOrder,

              status:
                (updatedOrder.status as Order['status']) ??
                currentOrder.status,

              paymentStatus:
                (updatedOrder.payment_status as Order['paymentStatus']) ??
                currentOrder.paymentStatus,

              total: nextTotal,

              totalValue: nextTotal,

              customerName:
                updatedOrder.customer_name ??
                currentOrder.customerName,

              customerPhone:
                updatedOrder.customer_phone ??
                currentOrder.customerPhone,

              customerAddress:
                updatedOrder.customer_address ??
                currentOrder.customerAddress,

              paymentMethod:
                updatedOrder.payment_method ??
                currentOrder.paymentMethod,

              paymentProofUrl:
                updatedOrder.payment_proof_url ??
                currentOrder.paymentProofUrl,

              notes:
                updatedOrder.notes ??
                currentOrder.notes,

              quantity:
                updatedOrder.quantity ??
                currentOrder.quantity,
            };
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const deletedOrderId = String(
            payload.old?.id ?? '',
          );

          if (!deletedOrderId) {
            void fetchOrders();
            return;
          }

          /*
           * Remove imediatamente da tabela.
           */
          setOrders((currentOrders) =>
            currentOrders.filter(
              (order) =>
                order.id !== deletedOrderId,
            ),
          );

          setSelectedOrder((currentOrder) => {
            if (
              currentOrder?.id ===
              deletedOrderId
            ) {
              setIsModalOpen(false);
              return null;
            }

            return currentOrder;
          });
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            'Realtime de pedidos conectado.',
          );
        }

        if (status === 'CHANNEL_ERROR') {
          console.error(
            'Erro no canal Realtime de pedidos.',
          );
        }

        if (status === 'TIMED_OUT') {
          console.error(
            'Timeout no canal Realtime de pedidos.',
          );
        }

        if (status === 'CLOSED') {
          console.warn(
            'Canal Realtime de pedidos fechado.',
          );
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.customerName
          ?.toLowerCase()
          .includes(search) ||
        order.id
          ?.toLowerCase()
          .includes(search) ||
        order.productName
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === 'all' ||
        order.status === statusFilter;

      return Boolean(
        matchesSearch && matchesStatus,
      );
    });
  }, [
    orders,
    searchTerm,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) =>
          order.status === 'pending',
      ).length,

      production: orders.filter(
        (order) =>
          order.status === 'production',
      ).length,

      completed: orders.filter(
        (order) =>
          order.status === 'completed',
      ).length,
    };
  }, [orders]);

  const handleViewDetails = (
    order: Order,
  ) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSaveOrderStatus = async (
    newStatus: string,
  ) => {
    if (!selectedOrder) {
      return;
    }

    try {
      await orderService.updateOrderStatus(
        selectedOrder.id,
        {
          status: newStatus as
            | 'pending'
            | 'confirmed'
            | 'production'
            | 'completed',
        },
      );

      setSelectedOrder(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        'Erro ao atualizar estado do pedido:',
        error,
      );
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6 p-6">
      <section className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-black tracking-tight text-[#2b1810]">
              Gestão de Pedidos
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#5c3524]">
              Verifique os pagamentos, acompanhe a
              produção e finalize os pedidos.
            </p>
          </div>
        </div>
      </section>

      {!loading && (
        <section
          aria-label="Resumo dos pedidos"
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f4efe6] text-[#5c3524]">
                <ShoppingBag
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Total
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Pendentes
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <PackageCheck
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Em produção
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {stats.production}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <CheckCircle2
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Concluídos
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full flex-1">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c5338]"
              aria-hidden="true"
            />

            <input
              type="search"
              placeholder="Pesquisar por cliente, ID ou produto..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              aria-label="Pesquisar pedidos"
              className="w-full rounded-xl border border-[#e6dec5] bg-[#fdfbf7] py-2.5 pl-10 pr-10 text-xs text-[#2b1810] outline-none transition-all duration-200 placeholder:text-[#a47a64] focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg p-1 text-[#8c5338] transition-colors hover:bg-[#f4efe6] hover:text-[#2b1810]"
                aria-label="Limpar pesquisa"
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          <div className="flex w-full items-center gap-2 md:w-auto">
            <Filter
              className="h-4 w-4 shrink-0 text-[#8c5338]"
              aria-hidden="true"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              aria-label="Filtrar pedidos por estado"
              className="w-full cursor-pointer rounded-xl border border-[#e6dec5] bg-[#fdfbf7] px-3 py-2.5 text-xs text-[#2b1810] outline-none transition-all duration-200 focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 md:w-52"
            >
              <option value="all">
                Todos os estados
              </option>

              <option value="pending">
                Pendentes
              </option>

              <option value="production">
                Em produção
              </option>

              <option value="completed">
                Concluídos
              </option>
            </select>
          </div>
        </div>

        {!loading && (
          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-medium text-[#8c5338]">
            <span>
              {filteredOrders.length === 1
                ? '1 pedido encontrado'
                : `${filteredOrders.length} pedidos encontrados`}
            </span>

            {statusFilter !== 'all' && (
              <span className="rounded-full bg-[#f4efe6] px-2.5 py-1 font-bold text-[#5c3524]">
                {statusFilter === 'pending' &&
                  'Pendentes'}

                {statusFilter === 'production' &&
                  'Em produção'}

                {statusFilter === 'completed' &&
                  'Concluídos'}
              </span>
            )}
          </div>
        )}
      </section>

      {loading ? (
        <div
          className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#e6dec5] bg-white shadow-sm"
          role="status"
          aria-label="A carregar pedidos"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              className="h-8 w-8 animate-spin text-[#5c3524]"
              aria-hidden="true"
            />

            <span className="text-xs font-medium text-[#8c5338]">
              A carregar pedidos...
            </span>
          </div>
        </div>
      ) : (
        <OrderTable
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
        />
      )}

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSave={handleSaveOrderStatus}
      />
    </div>
  );
}