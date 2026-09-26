import {
  Bell,
  CheckCircle2,
  X,
} from 'lucide-react';

import type { NotificationItemData } from '../../types';

interface NotificationToastProps {
  toast: NotificationItemData | null;
  onClose: () => void;
}

export function NotificationToast({
  toast,
  onClose,
}: NotificationToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-3 z-[60] w-[calc(100vw-1.5rem)] max-w-[340px] animate-in slide-in-from-right-3 fade-in duration-300 sm:bottom-5 sm:right-5 sm:max-w-sm"
    >
      <div className="relative overflow-hidden rounded-xl border border-[#c5a059]/30 bg-[#2b1810] text-[#fdfbf7] shadow-[0_16px_40px_rgba(43,24,16,0.22)] sm:rounded-2xl sm:shadow-[0_20px_50px_rgba(43,24,16,0.25)]">
        {/* Linha decorativa */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-[#c5a059]"
        />

        {/* Brilho */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#c5a059]/10 sm:-right-10 sm:-top-10 sm:h-24 sm:w-24"
        />

        <div className="relative p-3 sm:p-4">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#c5a059]/30 bg-[#c5a059]/10 text-[#c5a059] sm:h-9 sm:w-9 sm:rounded-xl">
                <Bell
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />

                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full border-2 border-[#2b1810] bg-[#c5a059] sm:h-2.5 sm:w-2.5"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#c5a059] sm:text-[9px] sm:tracking-[0.16em]">
                  Nova notificação
                </p>

                <h4
                  className="mt-0.5 truncate font-serif text-[11px] font-black text-[#fdfbf7] sm:text-xs"
                  title={toast.title}
                >
                  {toast.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar notificação"
              title="Fechar"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#e6dec5]/60 transition-all duration-200 hover:bg-white/10 hover:text-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50"
            >
              <X
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="mt-2.5 rounded-lg border border-white/5 bg-black/10 p-2.5 sm:mt-3 sm:rounded-xl sm:p-3">
            <div className="flex items-start gap-2">
              <CheckCircle2
                className="mt-0.5 h-3 w-3 shrink-0 text-[#c5a059] sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />

              <div className="min-w-0">
                <p className="line-clamp-2 text-[10px] font-medium leading-4 text-[#e6dec5] sm:text-[11px] sm:leading-5">
                  {toast.description}
                </p>

                {toast.timestamp && (
                  <span className="mt-1 block text-[8px] font-medium text-[#c5a059]/70 sm:mt-1.5 sm:text-[9px]">
                    {toast.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Indicador */}
          <div className="mt-2 flex items-center gap-1.5 sm:mt-3 sm:gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059]" />

            <span className="text-[8px] font-medium text-[#e6dec5]/60 sm:text-[9px]">
              Nova atividade no painel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}