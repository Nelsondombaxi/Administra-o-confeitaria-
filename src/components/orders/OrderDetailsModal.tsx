import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import {
  AlertCircle,
  Cake,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  User,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { Order } from '../../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (
    updatedStatus: string,
  ) => void | Promise<void>;
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onSave,
}: OrderDetailsModalProps) {
  const [status, setStatus] = useState('pending');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (order) {
      const currentStatus = order.status || 'pending';
      setStatus(
        currentStatus === 'confirmed'
          ? 'production'
          : currentStatus,
      );
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const handleSubmit = async (
    event: FormEvent,
  ) => {
    event.preventDefault();
    try {
      setIsSaving(true);
      await onSave(status);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0,
    })
      .format(Number(amount) || 0)
      .replace('AOA', 'Kz');
  };

  const totalAmount = Number(
    order.totalValue ?? order.total ?? 0,
  );
  const depositAmount = totalAmount * 0.5;
  const remainingAmount =
    totalAmount - depositAmount;

  const customerName =
    order.customerName || 'Cliente sem nome';
  const customerPhone =
    order.customerPhone || 'Sem telefone';
  const customerAddress =
    order.customerAddress || 'Não informada';
  const notes = order.notes || '';
  const productName =
    order.productName || 'Produto não especificado';
  const quantity = Number(order.quantity ?? 1);
  const paymentMethod =
    order.paymentMethod || '';
  const paymentProofUrl =
    order.paymentProofUrl || '';

  const handleOpenProof = () => {
    if (!paymentProofUrl) {
      return;
    }
    window.open(
      paymentProofUrl,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const displayId = order.id
    ? `#${order.id.slice(0, 8).toUpperCase()}`
    : '#PED-0000';

  const paymentLabel =
    paymentMethod === 'EXPRESS'
      ? 'MCX Express'
      : 'Transferência Bancária';

  const paymentConfirmed =
    order.paymentStatus === 'paid';

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSaving ? () => undefined : onClose}
      title={`Pedido ${displayId}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <User
                className="h-4 w-4 text-[#8c5338]"
                aria-hidden="true"
              />

              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#5c3524]">
                Cliente
              </h3>
            </div>

            <div className="rounded-2xl border border-[#e6dec5] bg-[#fdfbf7] p-4">
              <p className="text-sm font-bold text-[#2b1810]">
                {customerName}
              </p>

              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-[#5c3524]">
                  <Phone
                    className="h-3.5 w-3.5 shrink-0 text-[#8c5338]"
                    aria-hidden="true"
                  />

                  <span>{customerPhone}</span>
                </div>

                <div className="flex items-start gap-2 text-[11px] leading-4 text-[#5c3524]">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8c5338]"
                    aria-hidden="true"
                  />

                  <span>{customerAddress}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <Cake
                className="h-4 w-4 text-[#8c5338]"
                aria-hidden="true"
              />

              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#5c3524]">
                Produto
              </h3>
            </div>

            <div className="rounded-2xl border border-[#e6dec5] bg-[#fdfbf7] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-bold text-[#2b1810]"
                    title={productName}
                  >
                    {productName}
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#8c5338]">
                    Quantidade: {quantity}
                  </p>
                </div>

                <span className="shrink-0 font-serif text-sm font-black text-[#2b1810]">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard
              className="h-4 w-4 text-[#8c5338]"
              aria-hidden="true"
            />

            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#5c3524]">
              Pagamento
            </h3>
          </div>

          <div className="rounded-2xl border border-[#e6dec5] bg-[#fdfbf7] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#2b1810]">
                  {paymentLabel}
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {paymentConfirmed ? (
                    <>
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-green-600"
                        aria-hidden="true"
                      />

                      <span className="text-[11px] font-semibold text-green-700">
                        Pagamento confirmado
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle
                        className="h-3.5 w-3.5 text-amber-600"
                        aria-hidden="true"
                      />

                      <span className="text-[11px] font-semibold text-amber-700">
                        Aguardando confirmação
                      </span>
                    </>
                  )}
                </div>
              </div>

              {paymentProofUrl ? (
                <button
                  type="button"
                  onClick={handleOpenProof}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#e6dec5] bg-[#f4efe6] px-3 py-2 text-[11px] font-bold text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#e6dec5] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50"
                >
                  <FileText
                    className="h-3.5 w-3.5 text-[#8c5338]"
                    aria-hidden="true"
                  />

                  <span>Ver comprovativo</span>
                </button>
              ) : (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
                  Sem comprovativo
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-amber-800">
              Sinal pago
            </span>

            <span className="mt-1 block font-serif text-base font-black text-amber-950">
              {formatCurrency(depositAmount)}
            </span>

            <span className="mt-0.5 block text-[10px] text-amber-800/70">
              50% do total
            </span>
          </div>

          <div className="rounded-2xl border border-[#e6dec5] bg-[#f4efe6] p-3">
            <span className="block text-[10px] font-bold uppercase tracking-wide text-[#8c5338]">
              Restante
            </span>

            <span className="mt-1 block font-serif text-base font-black text-[#2b1810]">
              {formatCurrency(remainingAmount)}
            </span>

            <span className="mt-0.5 block text-[10px] text-[#8c5338]">
              Valor por pagar
            </span>
          </div>
        </section>

        {notes && (
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare
                className="h-4 w-4 text-[#8c5338]"
                aria-hidden="true"
              />

              <h3 className="text-[11px] font-black uppercase tracking-wider text-[#5c3524]">
                Observações
              </h3>
            </div>

            <div className="rounded-2xl border border-[#e6dec5] bg-[#fdfbf7] p-4">
              <p className="text-xs leading-5 text-[#5c3524]">
                “{notes}”
              </p>
            </div>
          </section>
        )}

        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <PackageCheck
              className="h-4 w-4 text-[#8c5338]"
              aria-hidden="true"
            />

            <label
              htmlFor="order-status"
              className="text-[11px] font-black uppercase tracking-wider text-[#5c3524]"
            >
              Estado do pedido
            </label>
          </div>

          <select
            id="order-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={isSaving}
            className="w-full cursor-pointer rounded-xl border border-[#e6dec5] bg-[#fdfbf7] px-3.5 py-3 text-xs font-semibold text-[#2b1810] outline-none transition-all duration-200 focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="pending">
              Pendente
            </option>

            <option value="production">
              Em produção
            </option>

            <option value="completed">
              Concluído
            </option>
          </select>

          <p className="text-[10px] leading-4 text-[#8c5338]">
            Confirme o pagamento antes de colocar o
            pedido em produção.
          </p>
        </section>

        <div className="flex flex-col-reverse gap-2 border-t border-[#f4efe6] pt-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#e6dec5] bg-[#f4efe6] px-4 text-xs font-bold text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#e6dec5] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#2b1810] bg-[#2b1810] px-5 text-xs font-bold text-[#c5a059] shadow-sm transition-all duration-200 hover:bg-[#5c3524] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />

                <span>A guardar...</span>
              </>
            ) : (
              <>
                <CheckCircle2
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>Guardar alteração</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}