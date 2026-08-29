import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { User, Cake, CreditCard, FileText, CheckCircle2 } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSave: (updatedStatus: string) => void;
}

export function OrderDetailsModal({ isOpen, onClose, order, onSave }: OrderDetailsModalProps) {
  const [status, setStatus] = useState('Pendente');

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'Pendente');
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido #${order.id || 'PED-1042'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <User className="w-4 h-4 text-[#8c5338]" />
            <span>Cliente</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] space-y-1">
            <p className="text-xs font-bold text-[#2b1810]">{order.customerName || 'Mariana Silva'}</p>
            <p className="text-[11px] text-[#5c3524]">+244 923 000 000</p>
            <p className="text-[11px] text-[#5c3524]">Morada: Rua Principal, Luanda</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <Cake className="w-4 h-4 text-[#8c5338]" />
            <span>Produto</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] space-y-1">
            <p className="text-xs font-bold text-[#2b1810]">{order.productName || 'Bolo de Chocolate Supremo'}</p>
            <div className="flex justify-between text-[11px] text-[#5c3524] pt-1">
              <span>Quantidade: 1</span>
              <span className="font-bold text-[#2b1810]">Total: {order.total || '25.000 Kz'}</span>
            </div>
            <p className="text-[11px] text-[#8c5338]">Sinal: 12.500 Kz</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#8c5338]" />
            <span>Pagamento</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#2b1810]">Transferência Bancária</p>
              <p className="text-[11px] text-[#5c3524]">Banco BAI</p>
            </div>
            <button 
              type="button"
              onClick={() => alert('Visualizar comprovativo de pagamento (Mock)')}
              className="px-3 py-1.5 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-[#e6dec5]"
            >
              <FileText className="w-3.5 h-3.5 text-[#8c5338]" />
              <span>Ver comprovativo</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2b1810]">Estado do Pedido</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Produção">Em Produção</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f4efe6]">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-xs font-bold transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2b1810] hover:bg-[#5c3524] text-[#c5a059] text-xs font-bold transition-all cursor-pointer shadow-sm border border-[#c5a059]/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar alteração</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}