import type { ChangeEvent } from 'react';
import { Phone, Store } from 'lucide-react';

interface VitrineSettingsCardProps {
  businessName: string;
  whatsappNumber: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function VitrineSettingsCard({
  businessName,
  whatsappNumber,
  onChange,
}: VitrineSettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[#f4efe6]">
        <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
          <Store className="w-4 h-4" aria-hidden="true" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#2b1810] font-serif">
            Configurações da Vitrine
          </h3>

          <p className="text-xs text-[#5c3524]">
            Dados públicos exibidos diretamente aos clientes na loja online
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="business_name"
            className="text-xs font-bold text-[#2b1810] block"
          >
            Nome da Confeitaria
          </label>

          <input
            id="business_name"
            type="text"
            name="business_name"
            value={businessName}
            onChange={onChange}
            placeholder="Ex: Veyra Confeitaria"
            autoComplete="organization"
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />

          <p className="text-[11px] text-[#8c5338]">
            Nome visível no cabeçalho da loja online.
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="whatsapp_number"
            className="text-xs font-bold text-[#2b1810] flex items-center gap-1.5"
          >
            <Phone
              className="w-3.5 h-3.5 text-[#8c5338]"
              aria-hidden="true"
            />

            <span>Número de Atendimento (WhatsApp)</span>
          </label>

          <input
            id="whatsapp_number"
            type="tel"
            name="whatsapp_number"
            value={whatsappNumber}
            onChange={onChange}
            placeholder="Ex: +244 923 000 000"
            autoComplete="tel"
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />

          <p className="text-[11px] text-[#8c5338]">
            Redireciona o cliente ao clicar no botão "Atendimento".
          </p>
        </div>
      </div>
    </div>
  );
}