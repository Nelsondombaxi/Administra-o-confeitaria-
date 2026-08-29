import { useState } from 'react';
import { Menu } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';

interface TopbarProps {
  activeTab: string;
  onOpenSidebar: () => void;
}

export function Topbar({ activeTab, onOpenSidebar }: TopbarProps) {
  return (
    <header className="h-16 bg-[#fdfbf7] border-b border-[#e6dec5] px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden text-[#5c3524] hover:text-[#2b1810] cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-base font-bold text-[#2b1810] capitalize tracking-wide font-serif">
          {activeTab}
        </h2>
      </div>

      <div className="flex items-center gap-4 relative">
        <NotificationBell />

        <div className="w-10 h-10 rounded-xl bg-[#2b1810] text-[#c5a059] flex items-center justify-center font-bold text-sm shadow-sm border border-[#c5a059]/30 font-serif">
          A
        </div>
      </div>
    </header>
  );
}