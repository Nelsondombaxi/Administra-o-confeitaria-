import { useState, useEffect } from 'react';

import AdminLayout from './components/layout/AdminLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoginPage } from './pages/Login/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('veyra_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('veyra_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('veyra_auth');
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
        return <DashboardPage onNavigate={setActiveTab} />;

      case 'orders':
        return <OrdersPage />;

      case 'produtos':
        return <ProductsPage />;

      case 'categorias':
        return <CategoriesPage />;

      case 'configuracoes':
        return <SettingsPage />;

      default:
        return <DashboardPage onNavigate={setActiveTab} />;
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