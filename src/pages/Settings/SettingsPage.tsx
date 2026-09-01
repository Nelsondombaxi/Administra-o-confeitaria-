import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { VitrineSettingsCard } from '../../components/settings/VitrineSettingsCard';
import { PaymentSettingsCard } from '../../components/settings/PaymentSettingsCard';
import { AdminSettingsCard } from '../../components/settings/AdminSettingsCard';
import { Save, Loader2, CheckCircle2, X } from 'lucide-react';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [settingsId, setSettingsId] = useState<string | number | null>(null);

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await orderService.getSettings();
        if (data) {
          setSettingsId(data.id);
          setFormData({
            business_name: data.business_name || 'Veyra Confeitaria',
            whatsapp_number: data.whatsapp_number || '+244 923 000 000',
            bank_1_name: data.bank_1_name || 'Banco BAI',
            bank_1_iban: data.bank_1_iban || '',
            bank_2_name: data.bank_2_name || 'Banco BIC',
            bank_2_iban: data.bank_2_iban || '',
            express_number: data.express_number || '',
            deposit_percentage: data.deposit_percentage ?? 50,
            admin_system_name: data.admin_system_name || 'VEYRA',
            admin_dashboard_name: data.admin_dashboard_name || 'Raquel Dombaxi',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...(settingsId ? { id: settingsId } : {}),
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const updated = await orderService.updateSettings(payload);

      if (updated?.id) {
        setSettingsId(updated.id);
      }

      setSucesso(true);
      setTimeout(() => setSucesso(false), 4000);
    } catch (error) {
      console.error('Erro ao guardar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12 relative">
      <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Definições do Sistema</h1>
          <p className="text-sm text-[#5c3524] mt-1">Gerencie os dados da vitrine pública e as preferências do painel.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          depositPercentage={formData.deposit_percentage}
          onChange={handleChange}
        />

        <AdminSettingsCard
          adminSystemName={formData.admin_system_name}
          adminDashboardName={formData.admin_dashboard_name}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm border border-[#c5a059]/30 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'A guardar...' : 'Guardar Alterações'}</span>
          </button>
        </div>
      </form>

      {sucesso && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#fffdf9] rounded-[2rem] max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-300 transition-all">
            <div className="bg-[#3d2314] text-white p-4 flex justify-between items-center relative">
              <span className="font-bold text-sm tracking-tight">Sistema</span>
              <button
                type="button"
                onClick={() => setSucesso(false)}
                className="w-8 h-8 rounded-full bg-[#52321c] flex items-center justify-center hover:bg-[#633e24] transition-all cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-200" />
              </button>
            </div>
            <div className="p-8 text-center space-y-3">
              <div className="w-16 h-16 bg-[#3d2314]/10 text-[#3d2314] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-[#3d2314]">Configurações Guardadas!</h4>
              <p className="text-sm text-stone-600 font-medium">
                As alterações foram aplicadas com sucesso no sistema e na vitrine.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}