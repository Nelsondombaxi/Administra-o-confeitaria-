import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import { Loader2, Save, CheckCircle2, X } from 'lucide-react';

import { VitrineSettingsCard } from '../../components/settings/VitrineSettingsCard';
import { PaymentSettingsCard } from '../../components/settings/PaymentSettingsCard';
import { AdminSettingsCard } from '../../components/settings/AdminSettingsCard';

import { useAdminSettings } from '../../contexts/AdminSettingsContext';

interface SettingsFormData {
  business_name: string;
  whatsapp_number: string;
  bank_1_name: string;
  bank_1_iban: string;
  bank_2_name: string;
  bank_2_iban: string;
  express_number: string;
  deposit_percentage: number;
  admin_system_name: string;
  admin_dashboard_name: string;
}

const DEFAULT_FORM_DATA: SettingsFormData = {
  business_name: 'Veyra Confeitaria',
  whatsapp_number: '+244 923 000 000',
  bank_1_name: 'Banco BAI',
  bank_1_iban: '',
  bank_2_name: 'Banco BIC',
  bank_2_iban: '',
  express_number: '',
  deposit_percentage: 50,
  admin_system_name: 'VEYRA',
  admin_dashboard_name: 'Raquel Dombaxi',
};

export function SettingsPage() {
  const {
    settings,
    loading,
    error: settingsError,
    updateSettings,
  } = useAdminSettings();

  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const [formData, setFormData] =
    useState<SettingsFormData>(DEFAULT_FORM_DATA);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!settings) {
      return;
    }

    const depositPercentage = Number(
      settings.deposit_percentage
    );

    setFormData({
      business_name:
        settings.business_name ||
        DEFAULT_FORM_DATA.business_name,

      whatsapp_number:
        settings.whatsapp_number ||
        DEFAULT_FORM_DATA.whatsapp_number,

      bank_1_name:
        settings.bank_1_name ||
        DEFAULT_FORM_DATA.bank_1_name,

      bank_1_iban:
        settings.bank_1_iban || '',

      bank_2_name:
        settings.bank_2_name ||
        DEFAULT_FORM_DATA.bank_2_name,

      bank_2_iban:
        settings.bank_2_iban || '',

      express_number:
        settings.express_number || '',

      deposit_percentage:
        Number.isFinite(depositPercentage)
          ? depositPercentage
          : DEFAULT_FORM_DATA.deposit_percentage,

      admin_system_name:
        settings.admin_system_name ||
        DEFAULT_FORM_DATA.admin_system_name,

      admin_dashboard_name:
        settings.admin_dashboard_name ||
        DEFAULT_FORM_DATA.admin_dashboard_name,
    });
  }, [loading, settings]);

  useEffect(() => {
    if (settingsError) {
      setErrorMessage(settingsError);
    }
  }, [settingsError]);

  useEffect(() => {
    if (!sucesso) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSucesso(false);
    }, 4000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [sucesso]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === 'deposit_percentage') {
        const numericValue = Number(value);

        return {
          ...previous,
          deposit_percentage: Number.isNaN(numericValue)
            ? 0
            : numericValue,
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setErrorMessage('');
      setSucesso(false);

      const depositPercentage = Math.min(
        100,
        Math.max(
          0,
          Number(formData.deposit_percentage),
        ),
      );

      const payload = {
        ...(settings?.id ? { id: settings.id } : {}),
        ...formData,
        deposit_percentage: depositPercentage,
        updated_at: new Date().toISOString(),
      };

      await updateSettings(payload);

      setFormData((previous) => ({
        ...previous,
        deposit_percentage: depositPercentage,
      }));

      setSucesso(true);
    } catch (error: unknown) {
      console.error(
        'Erro ao guardar configurações:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível guardar as configurações.';

      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        role="status"
        aria-label="A carregar configurações"
      >
        <Loader2
          className="h-8 w-8 animate-spin text-[#c5a059]"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between rounded-2xl border border-[#e6dec5] bg-[#f4efe6] p-6 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-black text-[#2b1810]">
            Definições do Sistema
          </h1>

          <p className="mt-1 text-sm text-[#5c3524]">
            Gerencie os dados da vitrine pública e as
            preferências do painel.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <VitrineSettingsCard
          businessName={formData.business_name}
          whatsappNumber={formData.whatsapp_number}
          onChange={handleChange}
        />

        <PaymentSettingsCard
          bank1Name={formData.bank_1_name}
          bank1Iban={formData.bank_1_iban}
          bank2Name={formData.bank_2_name}
          bank2Iban={formData.bank_2_iban}
          expressNumber={formData.express_number}
          depositPercentage={
            formData.deposit_percentage
          }
          onChange={handleChange}
        />

        <AdminSettingsCard
          adminSystemName={formData.admin_system_name}
          adminDashboardName={
            formData.admin_dashboard_name
          }
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#c5a059]/30 bg-[#2b1810] px-6 py-3 text-xs font-bold text-[#c5a059] shadow-sm transition-all hover:bg-[#5c3524] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Save
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}

            <span>
              {saving
                ? 'A guardar...'
                : 'Guardar Alterações'}
            </span>
          </button>
        </div>
      </form>

      {sucesso && (
        <div
          className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Configurações guardadas"
        >
          <div className="w-full max-w-sm animate-in overflow-hidden rounded-[2rem] border border-stone-200 bg-[#fffdf9] shadow-2xl zoom-in-95 duration-300">
            <div className="relative flex items-center justify-between bg-[#3d2314] p-4 text-white">
              <span className="text-sm font-bold tracking-tight">
                Sistema
              </span>

              <button
                type="button"
                onClick={() => setSucesso(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#52321c] transition-all hover:bg-[#633e24]"
                aria-label="Fechar confirmação"
              >
                <X
                  className="h-4 w-4 text-stone-200"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="space-y-3 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-[#3d2314]/10 text-[#3d2314]">
                <CheckCircle2
                  className="h-10 w-10"
                  aria-hidden="true"
                />
              </div>

              <h4 className="text-xl font-black text-[#3d2314]">
                Configurações Guardadas!
              </h4>

              <p className="text-sm font-medium text-stone-600">
                As alterações foram aplicadas com sucesso
                no sistema e na vitrine.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}