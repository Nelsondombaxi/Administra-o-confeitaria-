import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-[#e6dec5] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-[#f4efe6] flex items-center justify-between bg-[#fdfbf7]">
          <h3 className="text-base font-bold text-[#2b1810] font-serif">{title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#f4efe6] hover:bg-[#e6dec5] flex items-center justify-center text-[#5c3524] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}