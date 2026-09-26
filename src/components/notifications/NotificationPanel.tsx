import {
  Bell,
  Check,
  CheckCircle,
  FileText,
  PackageCheck,
  X,
} from 'lucide-react';

import type { NotificationItemData } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: NotificationItemData[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({
  isOpen,
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) {
  if (!isOpen) {
    return null;
  }

  const icons = {
    order: Bell,
    proof: FileText,
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <>
      {/* Overlay mobile */}
      <div
        className="fixed inset-0 z-40 bg-[#2b1810]/10 backdrop-blur-[1px] md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel */}
      <div
        role="dialog"
        aria-label="Notificações"
        className="absolute right-0 z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-[360px] overflow-hidden rounded-2xl border border-[#e6dec5] bg-white shadow-[0_16px_40px_rgba(43,24,16,0.14)] animate-in fade-in slide-in-from-top-2 duration-200 sm:mt-3 sm:w-96"
      >
        {/* Cabeçalho */}
        <div className="border-b border-[#e6dec5] bg-[#fdfbf7] px-3.5 py-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#c5a059]/30 bg-[#f4efe6] text-[#5c3524] sm:h-10 sm:w-10 sm:rounded-xl">
                <Bell
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-[#fdfbf7] bg-[#c5a059]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-xs font-black text-[#2b1810] sm:text-sm">
                    Notificações
                  </h3>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#2b1810] px-1.5 py-0.5 text-[8px] font-bold text-[#c5a059] sm:px-2 sm:text-[9px]">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[9px] font-medium text-[#8c5338] sm:text-[10px]">
                  {unreadCount === 0
                    ? 'Tudo em dia'
                    : unreadCount === 1
                      ? '1 por ler'
                      : `${unreadCount} por ler`}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  title="Marcar todas como lidas"
                  aria-label="Marcar todas como lidas"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#8c5338] transition-all hover:bg-[#f4efe6] hover:text-[#2b1810] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 sm:h-8 sm:w-8"
                >
                  <Check
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    aria-hidden="true"
                  />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                title="Fechar notificações"
                aria-label="Fechar notificações"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#8c5338] transition-all hover:bg-[#f4efe6] hover:text-[#2b1810] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 sm:h-8 sm:w-8"
              >
                <X
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="max-h-[min(55vh,340px)] overflow-y-auto p-2 sm:max-h-[420px] sm:p-2.5">
          {notifications.length === 0 ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center px-5 py-8 text-center sm:min-h-[260px] sm:px-6 sm:py-10">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e6dec5] bg-[#f4efe6] text-[#c5a059] sm:h-14 sm:w-14 sm:rounded-2xl">
                <CheckCircle
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  aria-hidden="true"
                />
              </div>

              <h4 className="mt-3 font-serif text-xs font-black text-[#2b1810] sm:mt-4 sm:text-sm">
                Tudo tranquilo por aqui
              </h4>

              <p className="mt-1 max-w-[200px] text-[9px] leading-4 text-[#8c5338] sm:mt-1.5 sm:max-w-[220px] sm:text-[10px] sm:leading-5">
                Não tens novas notificações neste
                momento.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 sm:space-y-2">
              {notifications.map((notification) => {
                const IconComponent =
                  icons[
                    notification.type as keyof typeof icons
                  ] || PackageCheck;

                const timestamp =
                  notification.timestamp ||
                  (notification as any).createdAt ||
                  (notification as any).time ||
                  (notification as any).date;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      onMarkAsRead(notification.id)
                    }
                    className={`group flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 sm:gap-3 sm:p-3 ${
                      notification.unread
                        ? 'border-[#c5a059]/30 bg-[#f4efe6]/80 hover:border-[#c5a059]/50 hover:bg-[#f4efe6]'
                        : 'border-[#e6dec5]/70 bg-white hover:border-[#c5a059]/30 hover:bg-[#fdfbf7]'
                    }`}
                  >
                    {/* Ícone */}
                    <div
                      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl ${
                        notification.unread
                          ? 'border-[#5c3524] bg-[#5c3524] text-[#fdfbf7]'
                          : 'border-[#e6dec5] bg-[#f4efe6] text-[#8c5338]'
                      }`}
                    >
                      <IconComponent
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />

                      {notification.unread && (
                        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full border-2 border-[#f4efe6] bg-[#c5a059]" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`min-w-0 truncate font-serif text-[10px] sm:text-xs ${
                            notification.unread
                              ? 'font-black text-[#2b1810]'
                              : 'font-bold text-[#5c3524]'
                          }`}
                        >
                          {notification.title}
                        </h4>

                        {timestamp && (
                          <span className="shrink-0 pt-0.5 text-[8px] font-medium text-[#a4775e] sm:text-[9px]">
                            {timestamp}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-0.5 line-clamp-2 text-[9px] leading-3.5 sm:mt-1 sm:text-[10px] sm:leading-4 ${
                          notification.unread
                            ? 'text-[#5c3524]'
                            : 'text-[#8c5338]'
                        }`}
                      >
                        {notification.description}
                      </p>

                      {notification.unread && (
                        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />

                          <span className="text-[8px] font-bold text-[#8c5338] sm:text-[9px]">
                            Não lida
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé */}
        {notifications.length > 0 && (
          <div className="border-t border-[#e6dec5] bg-[#fdfbf7] px-3 py-2 sm:px-4 sm:py-2.5">
            <p className="text-center text-[8px] font-medium text-[#a4775e] sm:text-[9px]">
              Toca numa notificação para a marcar
              como lida
            </p>
          </div>
        )}
      </div>
    </>
  );
}