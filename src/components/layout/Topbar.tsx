import { Search } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';

export function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-[#e6dec5] px-8 flex items-center justify-between relative">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
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

        <div className="flex items-center gap-3 pl-4 border-l border-[#e6dec5]">
          <div className="w-10 h-10 rounded-2xl bg-[#2b1810] text-[#c5a059] font-serif font-bold flex items-center justify-center text-sm shadow-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}