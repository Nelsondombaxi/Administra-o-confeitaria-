import { useState } from 'react';
import AdminLayout from './components/layout/AdminLayout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProductsPage } from './pages/Products/ProductsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    alert('Simulação de Logout efetuada com sucesso!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'pedidos':
        return <div className="p-6"><h1 className="text-2xl font-bold">Página de Pedidos (Em construção)</h1></div>;
      case 'produtos':
        return <ProductsPage />;
      case 'categorias':
        return <div className="p-6"><h1 className="text-2xl font-bold">Página de Categorias (Em construção)</h1></div>;
      case 'configuracoes':
        return <div className="p-6"><h1 className="text-2xl font-bold">Página de Configurações (Em construção)</h1></div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}