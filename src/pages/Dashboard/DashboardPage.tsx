export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Olá, Administrador 👋</h1>
        <p className="text-sm text-stone-500">Aqui está o resumo da sua confeitaria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Pedidos</p>
          <p className="text-3xl font-black text-stone-900 mt-2">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pendentes</p>
          <p className="text-3xl font-black text-stone-900 mt-2">5</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Produtos Ativos</p>
          <p className="text-3xl font-black text-stone-900 mt-2">18</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 mb-4">Pedidos recentes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-sm font-bold text-stone-800">#1024</span>
            <span className="text-sm text-stone-600">João Silva</span>
            <span className="text-sm font-semibold text-stone-900">12.500 Kz</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">Pendente</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
            <span className="text-sm font-bold text-stone-800">#1023</span>
            <span className="text-sm text-stone-600">Ana Maria</span>
            <span className="text-sm font-semibold text-stone-900">20.000 Kz</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">Confirmado</span>
          </div>
        </div>
      </div>
    </div>
  );
}