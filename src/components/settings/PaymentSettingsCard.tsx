import { CreditCard, Percent, Smartphone, Landmark } from 'lucide-react';

interface PaymentSettingsCardProps {
  bank1Name: string;
  bank1Iban: string;
  bank2Name: string;
  bank2Iban: string;
  expressNumber: string;
  depositPercentage: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PaymentSettingsCard({
  bank1Name,
  bank1Iban,
  bank2Name,
  bank2Iban,
  expressNumber,
  depositPercentage,
  onChange,
}: PaymentSettingsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-[#f4efe6]">
        <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#8c5338] flex items-center justify-center border border-[#e6dec5]">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#2b1810] font-serif">Métodos de Pagamento</h3>
          <p className="text-xs text-[#5c3524]">Contas bancárias e dados de pagamento apresentados no checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#e6dec5]">
          <div className="flex items-center gap-2 border-b border-[#e6dec5]/60 pb-2">
            <Landmark className="w-4 h-4 text-[#8c5338]" />
            <span className="text-xs font-bold text-[#8c5338]">Conta Bancária Principal</span>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">Nome do Banco</label>
            <input
              type="text"
              name="bank_1_name"
              value={bank1Name}
              onChange={onChange}
              placeholder="Ex: Banco BAI"
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">IBAN</label>
            <input
              type="text"
              name="bank_1_iban"
              value={bank1Iban}
              onChange={onChange}
              placeholder="AO06 0000 ..."
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] font-mono focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        <div className="space-y-3 bg-[#fdfbf7] p-4 rounded-xl border border-[#e6dec5]">
          <div className="flex items-center gap-2 border-b border-[#e6dec5]/60 pb-2">
            <Landmark className="w-4 h-4 text-[#8c5338]" />
            <span className="text-xs font-bold text-[#8c5338]">Conta Bancária Secundária</span>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">Nome do Banco</label>
            <input
              type="text"
              name="bank_2_name"
              value={bank2Name}
              onChange={onChange}
              placeholder="Ex: Banco BIC"
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">IBAN</label>
            <input
              type="text"
              name="bank_2_iban"
              value={bank2Iban}
              onChange={onChange}
              placeholder="AO06 0000 ..."
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] font-mono focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e6dec5] space-y-2">
          <div className="flex items-center gap-2 border-b border-[#e6dec5]/60 pb-2">
            <Smartphone className="w-4 h-4 text-[#8c5338]" />
            <span className="text-xs font-bold text-[#8c5338]">Multicaixa Express</span>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">Número de Telefone</label>
            <input
              type="text"
              name="express_number"
              value={expressNumber}
              onChange={onChange}
              placeholder="Ex: 923 000 000"
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e6dec5] space-y-2">
          <div className="flex items-center gap-2 border-b border-[#e6dec5]/60 pb-2">
            <Percent className="w-4 h-4 text-[#8c5338]" />
            <span className="text-xs font-bold text-[#8c5338]">Percentagem de Sinal</span>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#5c3524] block mb-1">Valor da Entrada (%)</label>
            <input
              type="number"
              name="deposit_percentage"
              value={depositPercentage}
              onChange={onChange}
              min={1}
              max={100}
              className="w-full px-3 py-2 bg-white border border-[#e6dec5] rounded-lg text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}