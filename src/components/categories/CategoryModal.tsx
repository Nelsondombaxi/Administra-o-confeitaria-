import { Modal } from '../ui/Modal';
import { CategoryForm } from './CategoryForm';
import type { Category } from '../../types';

export interface CategoryFormData {
  name: string;
  description?: string;
  image_url?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (data: CategoryFormData) => void | Promise<void>;
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
  onSave,
}: CategoryModalProps) {
  const isEditing = Boolean(category);

  const handleSave = async (data: CategoryFormData) => {
    await onSave(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Categoria' : 'Nova Categoria'}
    >
      <CategoryForm
        initialData={category}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}