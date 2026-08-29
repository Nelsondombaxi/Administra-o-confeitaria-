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
    <header className="h-16 bg-[#fdfbf7] border-b border-[#e6dec5] px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden text-[#5c3524] hover:text-[#2b1810] cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-[#2b1810] capitalize tracking-wide">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] flex items-center justify-center text-[#5c3524] relative transition-all cursor-pointer border border-[#e6dec5]"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#8c5338] rounded-full animate-pulse" />
          </button>

          {notificationsOpen && <NotificationPanel />}
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#2b1810] text-[#c5a059] flex items-center justify-center font-bold text-sm shadow-sm border border-[#c5a059]/30">
          A
        </div>
      </div>
    </header>
  );
}