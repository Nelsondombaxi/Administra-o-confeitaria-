import { Modal } from '../ui/Modal';

import { ProductForm } from './ProductForm';

import type { Product } from '../../types/product';

export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  categoryId: string;
  imageUrl: string;
  available: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: ProductCategory[];
  onSave: (
    data: ProductFormData
  ) => void | Promise<void>;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}: ProductModalProps) {
  const isEditing = Boolean(product);

  const handleSave = async (data: ProductFormData) => {
    await onSave(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Produto' : 'Adicionar Produto'}
    >
      <ProductForm
        initialData={product}
        categories={categories}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
}