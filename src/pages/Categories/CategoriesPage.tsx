import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { CategoryTable } from '../../components/categories/CategoryTable';
import { CategoryModal } from '../../components/categories/CategoryModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import type { Category } from '../../types';
import { Plus, Search, Loader2 } from 'lucide-react';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCategory = async (data: any) => {
    try {
      const slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const payload = { 
        name: data.name, 
        slug, 
        description: data.description,
        image_url: data.image_url 
      };

      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao guardar categoria:', error);
      alert('Erro ao guardar categoria.');
    }
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.deleteCategory(categoryToDelete.id);
        setCategoryToDelete(null);
        setIsDeleteDialogOpen(false);
        fetchCategories();
      } catch (error) {
        console.error('Erro ao eliminar categoria:', error);
        alert('Erro ao eliminar categoria.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4efe6] p-6 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#2b1810] font-serif">Gestão de Categorias</h1>
          <p className="text-sm text-[#5c3524] mt-1">Organize os seus produtos para facilitar a navegação.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-[#5c3524] hover:bg-[#3d2318] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm border border-[#c5a059]/40 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 text-[#c5a059]" />
          <span>Nova categoria</span>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#e6dec5] shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8c5338] absolute left-3.5 top-3" />
          <input 
            type="text"
            placeholder="Pesquisar categoria..."
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
        <CategoryTable 
          categories={filteredCategories} 
          onEdit={handleEdit} 
          onDelete={(id) => {
            const cat = categories.find(c => c.id === id);
            if (cat) handleDeleteClick(cat);
          }} 
        />
      )}

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoria?"
        message={`Tens a certeza que queres eliminar "${categoryToDelete?.name}"?`}
      />
    </div>
  );
}