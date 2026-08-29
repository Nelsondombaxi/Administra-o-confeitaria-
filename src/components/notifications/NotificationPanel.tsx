import { Bell, Check } from 'lucide-react';
import type { NotificationItemData } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: NotificationItemData[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationPanel({ isOpen, notifications, onClose, onMarkAsRead, onMarkAllAsRead }: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl border border-[#e6dec5] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-[#fdfbf7] border-b border-[#f4efe6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#2b1810]">Notificações</h3>
              <p className="text-[10px] text-[#5c3524]">Tens {notifications.filter(n => n.unread).length} por ler</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={onMarkAllAsRead}
              title="Marcar todas como lidas"
              className="p-1.5 rounded-lg hover:bg-[#f4efe6] text-[#5c3524] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-[#f4efe6]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#5c3524]">
              Não tens novas notificações.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => onMarkAsRead(n.id)}
                className={`p-4 transition-all hover:bg-[#fdfbf7] cursor-pointer ${n.unread ? 'bg-[#fffdf9]' : 'opacity-60'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#2b1810]">{n.title}</h4>
                  <span className="text-[10px] text-[#8c5338] shrink-0">{(n as any).createdAt || (n as any).time || (n as any).date}</span>
                </div>
                <p className="text-[11px] text-[#5c3524] mt-1">{n.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}