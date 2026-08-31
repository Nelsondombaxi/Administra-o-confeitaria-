import { useState } from 'react';
import { Store, Bell, Save } from 'lucide-react';

export function SettingsPage() {
  const [storeName, setStoreName] = useState('Veyra Confeitaria');
  const [storeEmail, setStoreEmail] = useState('contacto@veyra.ao');
  const [storePhone, setStorePhone] = useState('+244 923 456 789');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [autoApproveProofs, setAutoApproveProofs] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Definições guardadas com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm">
        <h1 className="text-2xl font-black text-[#2b1810] font-serif">Definições do Sistema</h1>
        <p className="text-sm text-[#5c3524] mt-1">Gerencie as informações da confeitaria e as preferências gerais da plataforma.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Informações da Loja */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f4efe6]">
            <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2b1810] font-serif">Informações da Confeitaria</h3>
              <p className="text-xs text-[#5c3524]">Dados gerais apresentados aos clientes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2b1810]">Nome da Confeitaria</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2b1810]">E-mail de Contacto</label>
              <input 
                type="email" 
                value={storeEmail} 
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2b1810]">Telefone / WhatsApp</label>
              <input 
                type="text" 
                value={storePhone} 
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>
        </div>

        {/* Preferências e Notificações */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#f4efe6]">
            <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2b1810] font-serif">Notificações e Alertas</h3>
              <p className="text-xs text-[#5c3524]">Controle como recebe avisos sobre pedidos e comprovativos</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={enableNotifications} 
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#c5a059] rounded"
              />
              <span className="text-xs text-[#2b1810] font-medium">Ativar notificações sonoras e visuais para novos pedidos</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoApproveProofs} 
                onChange={(e) => setAutoApproveProofs(e.target.checked)}
                className="w-4 h-4 accent-[#c5a059] rounded"
              />
              <span className="text-xs text-[#2b1810] font-medium">Marcar comprovativos de pagamento como verificados automaticamente</span>
            </label>
          </div>
        </div>

        {/* Botão de Guardar */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm border border-[#c5a059]/30"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
}