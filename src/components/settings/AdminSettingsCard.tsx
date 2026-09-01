import { ShieldCheck, LayoutDashboard } from 'lucide-react';

interface AdminSettingsCardProps {
  adminSystemName: string;
  adminDashboardName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdminSettingsCard({ adminSystemName, adminDashboardName, onChange }: AdminSettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[#f4efe6]">
        <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#2b1810] font-serif">Personalização do Admin</h3>
          <p className="text-xs text-[#5c3524]">Nomes e marcas apresentados apenas na gestão interna</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2b1810] block">Nome da Marca (Sistema)</label>
          <input
            type="text"
            name="admin_system_name"
            value={adminSystemName}
            onChange={onChange}
            placeholder="Ex: VEYRA"
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />
          <p className="text-[11px] text-[#8c5338]">Exibido no logótipo superior da barra lateral.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2b1810] flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5 text-[#8c5338]" />
            <span>Nome de Exibição do Administrador</span>
          </label>
          <input
            type="text"
            name="admin_dashboard_name"
            value={adminDashboardName}
            onChange={onChange}
            placeholder="Ex: Raquel Dombaxi"
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />
          <p className="text-[11px] text-[#8c5338]">Utilizado na saudação do Dashboard e no perfil inferior.</p>
        </div>
      </div>
    </div>
  );
}