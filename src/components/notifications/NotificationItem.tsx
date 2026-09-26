import {
  Bell,
  Check,
  CheckCircle,
  FileText,
} from 'lucide-react';

import type { NotificationItemData } from '../../types';

interface NotificationItemProps {
  notification: NotificationItemData;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const icons = {
    order: Bell,
    proof: FileText,
  };

  const IconComponent =
    icons[notification.type] || CheckCircle;

  return (
    <button
      type="button"
      onClick={() =>
        onMarkAsRead(notification.id)
      }
      className={`group flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 ${
        notification.unread
          ? 'border-[#c5a059]/30 bg-[#f4efe6]/80 hover:border-[#c5a059]/50 hover:bg-[#f4efe6]'
          : 'border-[#e6dec5]/70 bg-white hover:border-[#c5a059]/30 hover:bg-[#fdfbf7]'
      }`}
    >
      {/* Ícone */}
      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
          notification.unread
            ? 'border-[#5c3524] bg-[#5c3524] text-[#fdfbf7] shadow-sm'
            : 'border-[#e6dec5] bg-[#f4efe6] text-[#8c5338]'
        }`}
      >
        <IconComponent
          className="h-4 w-4"
          aria-hidden="true"
        />

        {notification.unread && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#f4efe6] bg-[#c5a059]"
          />
        )}
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h5
            className={`min-w-0 truncate font-serif text-xs ${
              notification.unread
                ? 'font-black text-[#2b1810]'
                : 'font-bold text-[#5c3524]'
            }`}
            title={notification.title}
          >
            {notification.title}
          </h5>

          {notification.timestamp && (
            <span className="shrink-0 pt-0.5 text-[9px] font-medium text-[#a4775e]">
              {notification.timestamp}
            </span>
          )}
        </div>

        <p
          className={`mt-1 line-clamp-2 text-[10px] leading-4 ${
            notification.unread
              ? 'text-[#5c3524]'
              : 'text-[#8c5338]'
          }`}
        >
          {notification.description}
        </p>

        {notification.unread && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />

            <span className="text-[9px] font-bold text-[#8c5338] transition-colors duration-200 group-hover:text-[#2b1810]">
              Não lida
            </span>

            <Check
              className="h-3 w-3 text-[#c5a059] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </button>
  );
}