import { useState } from 'react';
import { Bell } from 'lucide-react';
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-[#f4efe6] hover:bg-[#e6dec5] flex items-center justify-center text-[#5c3524] transition-all cursor-pointer relative border border-[#e6dec5]"
      >
        <Bell className="w-4 h-4 text-[#2b1810]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c5a059] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#fdfbf7]">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        notifications={notifications}
        onClose={() => setIsOpen(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <NotificationToast toast={activeToast} onClose={closeToast} />
    </div>
  );
}