import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Settings, 
  LogOut, 
  User,
  X
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ isOpen, onClose, activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag, badge: '5' },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'categorias', label: 'Categorias', icon: FolderTree },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#2b1810] text-[#f4efe6] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#3d2318]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 border-b border-[#3d2318] flex justify-between items-center">
          <div>
            <h1 className="text-[#c5a059] font-black text-xl tracking-widest font-serif">VEYRA</h1>
            <p className="text-[10px] text-[#b87351] font-medium uppercase tracking-wider">Painel Administrativo</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-[#f4efe6]/60 hover:text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose();
              }}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-[#3d2318] space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-[#3d2318]/40 rounded-xl border border-[#3d2318]">
            <div className="w-9 h-9 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#f4efe6] truncate">Administrador</p>
              <p className="text-[10px] text-[#b87351] truncate">admin@veyra.com</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}