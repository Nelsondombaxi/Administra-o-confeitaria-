import { useState, useEffect } from 'react';
import { Menu, Sparkles, ExternalLink } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { orderService } from '../../services/orderService';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const [adminName, setAdminName] = useState('Raquel Dombaxi');
  const [businessName, setBusinessName] = useState('Veyra Confeitaria');

  useEffect(() => {
    async function loadTopbarData() {
      try {
        const data = await orderService.getSettings();
        if (data) {
          if (data.admin_dashboard_name) setAdminName(data.admin_dashboard_name);
          if (data.business_name) setBusinessName(data.business_name);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do Topbar:', error);
      }
    }

    loadTopbarData();
  }, []);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  return (
    <header className="h-20 bg-white border-b border-[#e6dec5] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl bg-[#f4efe6] text-[#5c3524] hover:bg-[#e6dec5] transition-all cursor-pointer border border-[#e6dec5]"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] border border-[#e6dec5]/70">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span className="text-xs font-semibold text-[#5c3524]">
            {businessName}
          </span>
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] text-[#8c5338] hover:text-[#2b1810] flex items-center gap-1 font-bold ml-1 transition-colors"
          >
            <span>Ver Loja</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <NotificationBell />

        <div className="flex items-center gap-3 pl-4 border-l border-[#e6dec5]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#2b1810] leading-tight">{adminName}</p>
            <p className="text-[10px] font-medium text-[#8c5338]">Painel Ativo</p>
          </div>

          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#2b1810] text-[#c5a059] font-serif font-bold flex items-center justify-center text-sm shadow-sm border border-[#c5a059]/30">
            {getInitial(adminName)}
          </div>
        </div>
      </div>
    </header>
  );
}