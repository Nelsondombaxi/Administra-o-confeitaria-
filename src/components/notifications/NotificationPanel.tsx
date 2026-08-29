import { NotificationItem } from './NotificationItem';

export function NotificationPanel() {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-[#fdfbf7] rounded-2xl shadow-xl border border-[#e6dec5] py-3 z-50 animate-in fade-in duration-200">
      <div className="px-4 pb-2.5 border-b border-[#e6dec5] flex justify-between items-center">
        <span className="text-xs font-bold text-[#2b1810] uppercase tracking-wider font-serif">Notificações</span>
        <span className="text-[10px] bg-[#f4efe6] text-[#5c3524] px-2.5 py-0.5 rounded-full font-bold border border-[#e6dec5]">2 novas</span>
      </div>

      <div className="divide-y divide-[#e6dec5]/60 max-h-72 overflow-y-auto">
        <NotificationItem 
          type="red"
          title="Novo pedido #1024"
          description="João Silva — 12.500 Kz"
          time="há 2 minutos"
        />
        <NotificationItem 
          type="yellow"
          title="Comprovativo enviado"
          description="Pedido #1023 — Ana Maria"
          time="há 10 minutos"
        />
      </div>
    </div>
  );
}