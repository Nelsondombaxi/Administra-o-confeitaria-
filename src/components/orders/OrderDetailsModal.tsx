import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { User, Cake, CreditCard, FileText, CheckCircle2, MessageSquare } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onSave: (updatedStatus: string) => void;
}

export function OrderDetailsModal({ isOpen, onClose, order, onSave }: OrderDetailsModalProps) {
  const [status, setStatus] = useState('pending_payment');

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'pending_payment');
    }
  }, [order]);

  if (!order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(status);
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(amount || 0).replace('AOA', 'Kz');
  };

  const totalAmount = order.total_amount || order.totalAmount || order.totalValue || order.total || 0;
  const depositAmount = order.deposit_amount || order.depositAmount || totalAmount * 0.5;
  const remainingAmount = order.remaining_amount || order.remainingAmount || (totalAmount - depositAmount);

  const customerName = order.customer_name || order.customerName || 'Cliente sem nome';
  const customerPhone = order.customer_phone || order.customerPhone || 'Sem telefone';
  const customerAddress = order.customer_address || order.customerAddress || 'Não informada';
  const notes = order.notes || null;

  const productName = order.products?.name || order.product_name || order.productName || 'Produto não especificado';
  const paymentMethod = order.payment_method || order.paymentMethod || 'Transferência Bancária';
  const paymentProofUrl = order.payment_proof_url || order.paymentProofUrl || null;

  const handleOpenProof = () => {
    if (paymentProofUrl) {
      window.open(paymentProofUrl, '_blank');
    } else {
      alert('Nenhum comprovativo de pagamento anexado a este pedido.');
    }
  };

  const displayId = order.id ? `#${order.id.slice(0, 8).toUpperCase()}` : '#PED-0000';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Pedido ${displayId}`}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <User className="w-4 h-4 text-[#8c5338]" />
            <span>Cliente</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] space-y-1">
            <p className="text-xs font-bold text-[#2b1810]">{customerName}</p>
            <p className="text-[11px] text-[#5c3524]">{customerPhone}</p>
            <p className="text-[11px] text-[#5c3524]">Morada: {customerAddress}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <Cake className="w-4 h-4 text-[#8c5338]" />
            <span>Produto</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#2b1810]">{productName}</p>
                <p className="text-[11px] text-[#5c3524] font-medium">Quantidade: 1</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#2b1810] block">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e6dec5]/60 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/50">
                <span className="text-amber-800/80 block text-[10px] font-semibold">Sinal Pago (50%)</span>
                <span className="font-bold text-amber-950">{formatCurrency(depositAmount)}</span>
              </div>
              <div className="bg-stone-100/70 p-2 rounded-xl border border-stone-200/60">
                <span className="text-stone-600 block text-[10px] font-semibold">Restante a Pagar</span>
                <span className="font-bold text-stone-900">{formatCurrency(remainingAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-[#8c5338]" />
              <span>Observações do Cliente</span>
            </div>
            <div className="bg-[#fdfbf7] p-3 rounded-2xl border border-[#e6dec5]">
              <p className="text-[11px] text-[#5c3524] italic">"{notes}"</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#8c5338]" />
            <span>Pagamento</span>
          </div>
          <div className="bg-[#fdfbf7] p-3.5 rounded-2xl border border-[#e6dec5] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#2b1810]">
                {paymentMethod === 'express' ? 'MCX Express' : 'Transferência Bancária'}
              </p>
              <p className="text-[11px] text-[#5c3524]">
                Comprovativo: {paymentProofUrl ? 'Anexado' : 'Não enviado'}
              </p>
            </div>
            {paymentProofUrl && (
              <button 
                type="button"
                onClick={handleOpenProof}
                className="px-3 py-1.5 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] text-[#5c3524] text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-[#e6dec5]"
              >
                <FileText className="w-3.5 h-3.5 text-[#8c5338]" />
                <span>Ver comprovativo</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-[#2b1810] block">Estado do Pedido</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] font-semibold focus:outline-none focus:border-[#c5a059]"
          >
            <option value="pending_payment">Pendente (Pagamento)</option>
            <option value="confirmed">Pagamento Confirmado</option>
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