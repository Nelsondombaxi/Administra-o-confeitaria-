import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ProductTable } from '../../components/products/ProductTable';
import { ProductModal } from '../../components/products/ProductModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Product } from '../../types/product';
import { Plus, Search, Loader2 } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      
      // Mapear dados do Supabase para o formato esperado pelo componente/tipos
      const formattedProducts = (prodData || []).map((p: any) => ({
        ...p,
        categoryName: p.categories?.name || 'Sem categoria',
        imageUrl: p.image_url || p.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        available: p.is_active ?? p.available ?? true
      }));

      setProducts(formattedProducts);
      setCategories(catData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleSaveProduct = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category_id: data.categoryId || data.category_id,
        image_url: data.imageUrl || data.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        is_active: data.available ?? true
      };

      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, payload);
      } else {
        await productService.createProduct(payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao guardar produto:', error);
      alert('Erro ao guardar produto.');
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await productService.deleteProduct(productToDelete.id);
        setProductToDelete(null);
        setIsDeleteDialogOpen(false);
        fetchData();
      } catch (error) {
        console.error('Erro ao eliminar produto:', error);
        alert('Erro ao eliminar produto.');
      }
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#5c3524]" />
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          onEdit={handleEdit} 
          onDelete={(id) => {
            const prod = products.find(p => p.id === id);
            if (prod) handleDeleteClick(prod);
          }} 
        />
      )}

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        categories={categories}
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