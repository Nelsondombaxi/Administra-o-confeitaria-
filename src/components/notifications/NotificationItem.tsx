import type { NotificationItemData } from '../../types';
import { Bell, FileText, CheckCircle } from 'lucide-react';

interface NotificationItemProps {
  notification: NotificationItemData;
  onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const icons = {
    order: Bell,
    proof: FileText,
  };

  const IconComponent = icons[notification.type] || CheckCircle;

  return (
    <div 
      onClick={() => onMarkAsRead(notification.id)}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
        notification.unread 
          ? 'bg-[#f4efe6]/70 border-[#c5a059]/40 hover:bg-[#f4efe6]' 
          : 'bg-white border-[#e6dec5] hover:bg-[#fdfbf7]'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
        notification.unread 
          ? 'bg-[#5c3524] text-[#fdfbf7] border-[#5c3524]' 
          : 'bg-[#f4efe6] text-[#8c5338] border-[#e6dec5]'
      }`}>
        <IconComponent className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h5 className="text-xs font-bold text-[#2b1810] font-serif truncate">{notification.title}</h5>
          <span className="text-[10px] text-[#8c5338] shrink-0">{notification.timestamp}</span>
        </div>
        <p className="text-xs text-[#5c3524] mt-0.5 line-clamp-2">{notification.description}</p>
      </div>

      {notification.unread && (
        <span className="w-2 h-2 rounded-full bg-[#c5a059] shrink-0 self-center" />
      )}
    </div>
  );
}