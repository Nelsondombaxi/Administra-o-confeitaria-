import { useState } from 'react';

import {
  Bell,
  BellRing,
} from 'lucide-react';

import { NotificationPanel } from './NotificationPanel';

import { NotificationToast } from './NotificationToast';

import { useOrderNotifications } from '../../hooks/useOrderNotifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    activeToast,
    closeToast,
    handleMarkAsRead,
    handleMarkAllAsRead,
  } = useOrderNotifications();

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const hasUnreadNotifications =
    unreadCount > 0;

  const displayCount =
    unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          hasUnreadNotifications
            ? `${unreadCount} notificações não lidas`
            : 'Notificações'
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 focus:ring-offset-1 md:h-11 md:w-11 ${
          isOpen
            ? 'border-[#c5a059]/50 bg-[#f4efe6] text-[#2b1810] shadow-sm'
            : 'border-[#e6dec5] bg-[#fdfbf7] text-[#5c3524] hover:border-[#c5a059]/40 hover:bg-[#f4efe6] hover:text-[#2b1810] hover:shadow-sm'
        }`}
      >
        {/* Fundo decorativo */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-xl bg-[#c5a059]/5 transition-opacity duration-200 ${
            isOpen
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
        />

        {/* Ícone */}
        <span className="relative flex items-center justify-center">
          {hasUnreadNotifications ? (
            <BellRing
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />
          ) : (
            <Bell
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />
          )}
        </span>

        {/* Indicador de notificações */}
        {hasUnreadNotifications && (
          <>
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-[#c5a059]"
            />

            <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#c5a059] px-1 text-[9px] font-black leading-none text-white shadow-sm">
              {displayCount}
            </span>
          </>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        notifications={notifications}
        onClose={() => setIsOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <NotificationToast
        toast={activeToast}
        onClose={closeToast}
      />
    </div>
  );
}