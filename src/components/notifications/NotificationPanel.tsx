import { NotificationItem } from './NotificationItem';

export function NotificationPanel() {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 py-3 z-50 animate-in fade-in duration-200">
      <div className="px-4 pb-2 border-b border-stone-100 flex justify-between items-center">
        <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Notificações</span>
        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">2 novas</span>
      </div>

      <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
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