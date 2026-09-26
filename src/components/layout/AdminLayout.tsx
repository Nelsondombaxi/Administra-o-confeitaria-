import { useState, type ReactNode } from 'react';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AdminSettingsProvider } from '../../contexts/AdminSettingsContext';

type ActiveTab =
  | 'dashboard'
  | 'orders'
  | 'produtos'
  | 'categorias'
  | 'configuracoes';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
}

export default function AdminLayout({
  children,
  activeTab,
  setActiveTab,
  onLogout,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <AdminSettingsProvider>
      <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#2b1810]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogout={onLogout}
        />

        <div className="flex min-h-screen w-full min-w-0 flex-col md:pl-64">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-x-hidden p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminSettingsProvider>
  );
}