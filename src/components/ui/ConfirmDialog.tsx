import {
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Eliminar',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => undefined : onClose}
      title={title}
    >
      {/* Container principal para organizar o conteúdo do modal */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-semibold text-[#2b1810]">
              Esta ação não pode ser desfeita.
            </p>

            <p className="mt-1.5 text-xs leading-5 text-[#8c5338]">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#f4efe6] pt-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-10 cursor-pointer items-center justify-center rounded-xl border border-[#e6dec5] bg-[#f4efe6] px-4 text-xs font-bold text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#e6dec5] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-600 bg-red-600 px-4 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:border-red-700 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                <span>A eliminar...</span>
              </>
            ) : (
              <>
                <Trash2
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}