import { Bell, X } from 'lucide-react';
import type { NotificationItemData } from '../../types';

interface NotificationToastProps {
  toast: NotificationItemData | null;
  onClose: () => void;
}

export function NotificationToast({ toast, onClose }: NotificationToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-xs w-full bg-[#2b1810] text-[#fdfbf7] p-4 rounded-2xl border border-[#c5a059]/40 shadow-2xl flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between border-b border-[#c5a059]/20 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#c5a059] uppercase tracking-wider">
            {toast.title}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#e6dec5]/60 hover:text-[#fdfbf7] transition-colors p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <p className="text-xs text-[#e6dec5] font-medium">{toast.description}</p>
        <span className="text-[10px] text-[#c5a059]/80 mt-1 block">
          {toast.timestamp}
        </span>
      </div>
    </div>
  );
}