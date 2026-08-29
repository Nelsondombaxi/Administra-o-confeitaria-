import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { NotificationPanel } from '../notifications/NotificationPanel';

interface TopbarProps {
  activeTab: string;
  onOpenSidebar: () => void;
}

export function Topbar({ activeTab, onOpenSidebar }: TopbarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-stone-800 capitalize">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 relative transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {notificationsOpen && <NotificationPanel />}
        </div>

        <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}