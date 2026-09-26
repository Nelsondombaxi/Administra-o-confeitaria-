import { useEffect, useState } from 'react';

import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';

import { SidebarItem } from './SidebarItem';
import { orderService } from '../../services/orderService';
import { supabase } from '../../lib/supabase';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

type ActiveTab =
  | 'dashboard'
  | 'orders'
  | 'produtos'
  | 'categorias'
  | 'configuracoes';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

interface SidebarOrder {
  status?: string | null;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'orders',
    label: 'Pedidos',
    icon: ShoppingBag,
  },
  {
    id: 'produtos',
    label: 'Produtos',
    icon: Package,
  },
  {
    id: 'categorias',
    label: 'Categorias',
    icon: FolderTree,
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
  },
] satisfies Array<{
  id: ActiveTab;
  label: string;
  icon: typeof LayoutDashboard;
}>;

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onLogout,
}: SidebarProps) {
  const [pendingCount, setPendingCount] = useState<
    number | null
  >(null);

  const {
    settings,
    loading: settingsLoading,
  } = useAdminSettings();

  const systemName =
    settings?.admin_system_name?.trim() || '';

  const adminName =
    settings?.admin_dashboard_name?.trim() || '';

  useEffect(() => {
    let isMounted = true;

    const updatePendingCount = (
      orders: SidebarOrder[],
    ) => {
      const count = orders.filter(
        (order) => order.status === 'pending',
      ).length;

      setPendingCount(count > 0 ? count : null);
    };

    const loadPendingOrders = async () => {
      try {
        const ordersData =
          await orderService.getAllOrders();

        if (!isMounted) {
          return;
        }

        updatePendingCount(
          (ordersData ?? []) as SidebarOrder[],
        );
      } catch (error: unknown) {
        console.error(
          'Erro ao carregar pedidos pendentes da Sidebar:',
          error,
        );

        if (!isMounted) {
          return;
        }

        setPendingCount(null);
      }
    };

    /*
     * Carregamento inicial.
     */
    void loadPendingOrders();

    /*
     * Realtime:
     *
     * INSERT:
     * Novo pedido pendente -> +1
     *
     * UPDATE:
     * pending -> production -> -1
     * pending -> completed  -> -1
     * production -> pending -> +1
     *
     * DELETE:
     * Se o pedido eliminado estava pendente -> -1
     */
    const channel = supabase
      .channel('sidebar-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          if (!isMounted) {
            return;
          }

          if (payload.eventType === 'INSERT') {
            const newOrder =
              payload.new as SidebarOrder;

            if (newOrder.status === 'pending') {
              setPendingCount((current) => {
                return (current ?? 0) + 1;
              });
            }

            return;
          }

          if (payload.eventType === 'UPDATE') {
            const oldOrder =
              payload.old as SidebarOrder;

            const newOrder =
              payload.new as SidebarOrder;

            const wasPending =
              oldOrder.status === 'pending';

            const isPending =
              newOrder.status === 'pending';

            /*
             * O pedido entrou em pendente.
             */
            if (!wasPending && isPending) {
              setPendingCount((current) => {
                return (current ?? 0) + 1;
              });

              return;
            }

            /*
             * O pedido deixou de estar pendente.
             */
            if (wasPending && !isPending) {
              setPendingCount((current) => {
                const nextCount =
                  Math.max((current ?? 1) - 1, 0);

                return nextCount > 0
                  ? nextCount
                  : null;
              });
            }

            return;
          }

          if (payload.eventType === 'DELETE') {
            const deletedOrder =
              payload.old as SidebarOrder;

            if (deletedOrder.status === 'pending') {
              setPendingCount((current) => {
                const nextCount =
                  Math.max((current ?? 1) - 1, 0);

                return nextCount > 0
                  ? nextCount
                  : null;
              });
            }
          }
        },
      )
      .subscribe();

    return () => {
      isMounted = false;

      void supabase.removeChannel(channel);
    };
  }, []);

  const handleNavigation = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        aria-label="Navegação principal"
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-[#3d2318] bg-[#2b1810] text-[#f4efe6]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-[#3d2318] p-6">
          <div className="min-w-0">
            {!settingsLoading && systemName ? (
              <h1 className="truncate font-serif text-xl font-black uppercase tracking-widest text-[#c5a059]">
                {systemName}
              </h1>
            ) : (
              <div
                aria-hidden="true"
                className="h-6 w-28 animate-pulse rounded bg-[#c5a059]/20"
              />
            )}

            <p className="mt-1 truncate text-[10px] font-medium uppercase tracking-wider text-[#b87351]">
              Painel Administrativo
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="cursor-pointer text-[#f4efe6]/60 transition-colors hover:text-white md:hidden"
          >
            <X
              aria-hidden="true"
              className="h-6 w-6"
            />
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              badge={
                item.id === 'orders' &&
                pendingCount !== null
                  ? String(pendingCount)
                  : undefined
              }
              isActive={activeTab === item.id}
              onClick={() =>
                handleNavigation(item.id)
              }
            />
          ))}
        </nav>

        {/* Perfil e logout */}
        <div className="space-y-3 border-t border-[#3d2318] p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#3d2318] bg-[#3d2318]/40 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c5a059]/20 text-[#c5a059]">
              <User
                aria-hidden="true"
                className="h-5 w-5"
              />
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
              {!settingsLoading && adminName ? (
                <p className="truncate text-xs font-bold text-[#f4efe6]">
                  {adminName}
                </p>
              ) : (
                <div
                  aria-hidden="true"
                  className="h-3.5 w-24 animate-pulse rounded bg-[#f4efe6]/20"
                />
              )}

              <p className="truncate text-[10px] text-[#b87351]">
                Painel Ativo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-300 transition-all hover:bg-red-500/10"
          >
            <LogOut
              aria-hidden="true"
              className="h-4 w-4"
            />

            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}