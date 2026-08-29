import { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import { mockNotifications } from '../../data/mocks/notifications.mock';
import type { NotificationItemData } from '../../types';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItemData[]>(mockNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl bg-white border border-[#e6dec5] hover:border-[#c5a059] text-[#5c3524] flex items-center justify-center transition-all cursor-pointer relative shadow-sm"
      >
        <Bell className="w-4 h-4 text-[#2b1810]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a059] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#fdfbf7]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel 
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
}