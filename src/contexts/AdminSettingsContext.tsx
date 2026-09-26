import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  orderService,
  type SettingsData,
} from '../services/orderService';

interface AdminSettingsContextValue {
  settings: SettingsData | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (data: Partial<SettingsData>) => Promise<void>;
}

const AdminSettingsContext =
  createContext<AdminSettingsContextValue | undefined>(undefined);

interface AdminSettingsProviderProps {
  children: ReactNode;
}

export function AdminSettingsProvider({
  children,
}: AdminSettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = useCallback(async () => {
    try {
      setError(null);

      const data = await orderService.getSettings();

      setSettings(data);
    } catch (error: unknown) {
      console.error(
        'Erro ao carregar configurações do Admin:',
        error
      );

      setError('Não foi possível carregar as configurações.');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = useCallback(
    async (data: Partial<SettingsData>) => {
      const updatedSettings = await orderService.updateSettings(data);

      setSettings(updatedSettings);
      setError(null);
    },
    []
  );

  return (
    <AdminSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings,
        updateSettings,
      }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);

  if (!context) {
    throw new Error(
      'useAdminSettings deve ser usado dentro de AdminSettingsProvider.'
    );
  }

  return context;
}