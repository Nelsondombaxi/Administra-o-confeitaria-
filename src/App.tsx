import { useEffect, useState } from 'react';

import AdminLayout from './components/layout/AdminLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { OrdersPage } from './pages/Orders/OrdersPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { LoginPage } from './pages/Login/LoginPage';

const AUTH_STORAGE_KEY = 'veyra_auth';

type ActiveTab =
  | 'dashboard'
  | 'orders'
  | 'produtos'
  | 'categorias'
  | 'configuracoes';

const isValidActiveTab = (
  tab: string,
): tab is ActiveTab => {
  return (
    tab === 'dashboard' ||
    tab === 'orders' ||
    tab === 'produtos' ||
    tab === 'categorias' ||
    tab === 'configuracoes'
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(
      () =>
        localStorage.getItem(AUTH_STORAGE_KEY) ===
        'true',
    );

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        'true',
      );
    } else {
      localStorage.removeItem(
        AUTH_STORAGE_KEY,
      );
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleDashboardNavigate = (
    tab: string,
  ) => {
    if (isValidActiveTab(tab)) {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersPage />;

      case 'produtos':
        return <ProductsPage />;

      case 'categorias':
        return <CategoriesPage />;

      case 'configuracoes':
        return <SettingsPage />;

      case 'dashboard':
      default:
        return (
          <DashboardPage
            onNavigate={handleDashboardNavigate}
          />
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

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