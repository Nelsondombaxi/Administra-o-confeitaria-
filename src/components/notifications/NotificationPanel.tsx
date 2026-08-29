import type { NotificationItemData } from '../../types';
import { NotificationItem } from './NotificationItem';
import { CheckCheck, X } from 'lucide-react';

interface NotificationPanelProps {
  notifications: NotificationItemData[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ notifications, onClose, onMarkAsRead, onMarkAllAsRead }: NotificationPanelProps) {
  return (
    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl border border-[#e6dec5] shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-[#f4efe6]">
        <div>
          <h4 className="text-sm font-bold text-[#2b1810] font-serif">Notificações</h4>
          <span className="text-[10px] text-[#8c5338]">Central de alertas e comprovativos</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={onMarkAllAsRead}
            title="Marcar todas como lidas"
            className="p-1.5 rounded-lg hover:bg-[#f4efe6] text-[#5c3524] transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f4efe6] text-[#5c3524] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="py-3 space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-[#5c3524] py-6">Não há notificações no momento.</p>
        ) : (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={onMarkAsRead} 
            />
          ))
        )}
      </div>
    </div>
  );
}