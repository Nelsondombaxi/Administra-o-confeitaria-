import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-[#e6dec5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl bg-[#f4efe6] text-[#5c3524] hover:bg-[#e6dec5] transition-all cursor-pointer border border-[#e6dec5]"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Pesquisar no painel..."
            className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-[#e6dec5]">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-[#2b1810] text-[#c5a059] font-serif font-bold flex items-center justify-center text-xs md:text-sm shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}