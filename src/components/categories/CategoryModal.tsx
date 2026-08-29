import { Modal } from '../ui/Modal';
import { CategoryForm } from './CategoryForm';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onSave: (data: any) => void;
}

export function CategoryModal({ isOpen, onClose, category, onSave }: CategoryModalProps) {
  const isEditing = !!category;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Editar Categoria' : 'Nova Categoria'}
    >
      <CategoryForm 
        initialData={category} 
        onSave={(data) => {
          onSave(data);
          onClose();
        }} 
        onCancel={onClose} 
      />
    </Modal>
  );
}