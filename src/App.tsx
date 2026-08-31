import { useState } from 'react';

import AdminLayout from './components/layout/AdminLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoginPage } from './pages/Login/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;

      case 'orders':
        return <OrdersPage />;

      case 'produtos':
        return <ProductsPage />;

      case 'categorias':
        return <CategoriesPage />;

      case 'configuracoes':
        return <SettingsPage />;

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