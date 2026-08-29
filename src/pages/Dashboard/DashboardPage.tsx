export function DashboardPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Raquel Dombaxi</h1>
          <p className="text-sm text-[#5c3524] mt-1">Aqui está o resumo executivo da confeitaria Veyra.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f4efe6] rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-[#8c5338] uppercase tracking-wider relative z-10">Total Pedidos</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">24</p>
          <span className="text-[10px] text-[#5c3524] mt-1 block relative z-10">+12% em relação à semana passada</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider relative z-10">Pendentes</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">5</p>
          <span className="text-[10px] text-amber-800/80 mt-1 block relative z-10">A aguardar confirmação de pagamento</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e6dec5] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f4efe6] rounded-bl-full -z-0 opacity-50" />
          <p className="text-xs font-bold text-[#8c5338] uppercase tracking-wider relative z-10">Produtos Ativos</p>
          <p className="text-3xl font-black text-[#2b1810] mt-2 relative z-10 font-serif">18</p>
          <span className="text-[10px] text-[#5c3524] mt-1 block relative z-10">Disponíveis na vitrine</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e6dec5] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f4efe6]">
          <h3 className="text-base font-bold text-[#2b1810] font-serif">Pedidos recentes</h3>
          <button 
            onClick={() => onNavigate('orders')}
            className="text-xs text-[#8c5338] font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Ver todos
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 bg-[#fdfbf7] rounded-xl border border-[#e6dec5]/60 hover:bg-[#f4efe6]/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-[#2b1810] text-[#c5a059] px-2.5 py-1 rounded-lg">#1024</span>
              <div>
                <p className="text-sm font-bold text-[#2b1810]">João Silva</p>
                <p className="text-xs text-[#5c3524]">Bolo de Chocolate Supremo</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#2b1810] block">12.500 Kz</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">Pendente</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#fdfbf7] rounded-xl border border-[#e6dec5]/60 hover:bg-[#f4efe6]/50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-[#2b1810] text-[#c5a059] px-2.5 py-1 rounded-lg">#1023</span>
              <div>
                <p className="text-sm font-bold text-[#2b1810]">Ana Maria</p>
                <p className="text-xs text-[#5c3524]">Red Velvet Clássico</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#2b1810] block">20.000 Kz</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">Confirmado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}