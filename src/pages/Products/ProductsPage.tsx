import { useState } from 'react';
import { mockProducts } from '../../data/mocks/products.mock';
import { ProductTable } from '../../components/products/ProductTable';
import { ProductModal } from '../../components/products/ProductModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Product } from '../../types/product';
import { Plus, Search } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveProduct = (data: any) => {
    if (selectedProduct) {
      setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...data } : p));
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: data.name,
        categoryId: '1',
        categoryName: data.category,
        description: data.description,
        price: data.price,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        available: data.available
      };
      setProducts([newProduct, ...products]);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Gestão de Produtos</h1>
          <p className="text-sm text-[#5c3524] mt-1">{products.length} produtos registados na vitrine.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5c3524] hover:bg-[#3d2318] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm border border-[#c5a059]/40 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#c5a059]" />
          <span>Adicionar produto</span>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Pesquisar por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fdfbf7] border border-[#e6dec5] rounded-xl text-xs text-[#2b1810] focus:outline-none focus:border-[#c5a059]"
          />
        </div>
      </div>

      <ProductTable 
        products={filteredProducts} 
        onEdit={handleEdit} 
        onDelete={(id) => {
          const prod = products.find(p => p.id === id);
          if (prod) handleDeleteClick(prod);
        }} 
      />

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar produto?"
        message={`Tens a certeza que queres eliminar "${productToDelete?.name}"?`}
      />
    </div>
  );
}