import { Modal } from '../ui/Modal';
import { ProductForm } from './ProductForm';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSave: (data: any) => void;
}

export function ProductModal({ isOpen, onClose, product, onSave }: ProductModalProps) {
  const isEditing = !!product;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Editar Produto' : 'Adicionar Produto'}
    >
      <ProductForm 
        initialData={product} 
        onSave={(data) => {
          onSave(data);
          onClose();
        }} 
        onCancel={onClose} 
      />
    </Modal>
  );
}