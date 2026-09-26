import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FolderTree,
  Loader2,
  Plus,
  Search,
  Tags,
  X,
} from 'lucide-react';

import { categoryService } from '../../services/categoryService';

import { CategoryTable } from '../../components/categories/CategoryTable';
import { CategoryModal } from '../../components/categories/CategoryModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

import type { Category } from '../../types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data = await categoryService.getAllCategories();

      const formattedCategories: Category[] = data.map(
        (category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description ?? '',
          imageUrl: category.image_url ?? '',
          productCount: category.productCount,
        }),
      );

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);

      setErrorMessage(
        'Não foi possível carregar as categorias. Tente novamente.',
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return categories;
    }

    return categories.filter((category) => {
      const name = category.name.toLowerCase();

      const description =
        category.description?.toLowerCase() ?? '';

      const slug = category.slug?.toLowerCase() ?? '';

      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        slug.includes(normalizedSearch)
      );
    });
  }, [categories, searchTerm]);

  const handleOpenAdd = () => {
    setErrorMessage('');
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setErrorMessage('');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setErrorMessage('');
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCategory = async (data: {
    name: string;
    description?: string;
    image_url?: string;
  }) => {
    try {
      setIsSaving(true);
      setErrorMessage('');

      const name = data.name.trim();

      if (!name) {
        setErrorMessage(
          'O nome da categoria é obrigatório.',
        );
        return;
      }

      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (!slug) {
        setErrorMessage(
          'Não foi possível gerar um slug válido para a categoria.',
        );
        return;
      }

      const payload = {
        name,
        slug,
        description:
          data.description?.trim() || null,
        image_url:
          data.image_url?.trim() || null,
      };

      if (selectedCategory) {
        await categoryService.updateCategory(
          selectedCategory.id,
          payload,
        );
      } else {
        await categoryService.createCategory(payload);
      }

      setIsModalOpen(false);
      setSelectedCategory(null);

      await fetchCategories();
    } catch (error) {
      console.error(
        'Erro ao guardar categoria:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível guardar a categoria.';

      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage('');

      await categoryService.deleteCategory(
        categoryToDelete.id,
      );

      setCategoryToDelete(null);
      setIsDeleteDialogOpen(false);

      await fetchCategories();
    } catch (error) {
      console.error(
        'Erro ao eliminar categoria:',
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível eliminar a categoria.';

      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const totalCategories = categories.length;

  const totalProducts = categories.reduce(
    (total, category) =>
      total + (category.productCount ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#e6dec5] bg-[#f4efe6] shadow-sm">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#c5a059]/30 bg-white text-[#5c3524] shadow-sm">
              <FolderTree
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <h1 className="font-serif text-2xl font-black tracking-tight text-[#2b1810]">
                Gestão de Categorias
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-6 text-[#5c3524]">
                Organize os seus produtos por categorias
                para manter a vitrine simples e fácil de
                navegar.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={isSaving || isDeleting}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#c5a059]/40 bg-[#5c3524] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#3d2318] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus
              className="h-4 w-4 text-[#c5a059]"
              aria-hidden="true"
            />

            <span>Nova categoria</span>
          </button>
        </div>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <span className="flex-1">
            {errorMessage}
          </span>

          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="cursor-pointer rounded-lg p-1 text-red-500 transition-colors hover:bg-red-100"
            aria-label="Fechar mensagem de erro"
          >
            <X
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4efe6] text-[#5c3524]">
                <Tags
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Categorias
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {totalCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4efe6] text-[#5c3524]">
                <FolderTree
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#8c5338]">
                  Produtos organizados
                </p>

                <p className="mt-0.5 font-serif text-xl font-black text-[#2b1810]">
                  {totalProducts}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c5338]"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Pesquisar por nome, descrição ou slug..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            aria-label="Pesquisar categoria"
            className="w-full rounded-xl border border-[#e6dec5] bg-[#fdfbf7] py-2.5 pl-10 pr-10 text-xs text-[#2b1810] outline-none transition-all duration-200 placeholder:text-[#a47a64] focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg p-1 text-[#8c5338] transition-colors hover:bg-[#f4efe6] hover:text-[#2b1810]"
              aria-label="Limpar pesquisa"
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {searchTerm.trim() && !loading && (
          <div className="mt-3 text-[11px] font-medium text-[#8c5338]">
            {filteredCategories.length === 1
              ? '1 categoria encontrada'
              : `${filteredCategories.length} categorias encontradas`}
          </div>
        )}
      </section>

      {loading ? (
        <div
          className="flex min-h-[280px] items-center justify-center rounded-2xl border border-[#e6dec5] bg-white shadow-sm"
          role="status"
          aria-label="A carregar categorias"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2
              className="h-8 w-8 animate-spin text-[#5c3524]"
              aria-hidden="true"
            />

            <span className="text-xs font-medium text-[#8c5338]">
              A carregar categorias...
            </span>
          </div>
        </div>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={(id) => {
            const category = categories.find(
              (item) => item.id === id,
            );

            if (category) {
              handleDeleteClick(category);
            }
          }}
          hasSearch={Boolean(searchTerm.trim())}
        />
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Eliminar categoria?"
        message={
          categoryToDelete
            ? `Tens a certeza que queres eliminar "${categoryToDelete.name}"? Os produtos dessa categoria não serão eliminados.`
            : 'Tens a certeza que queres eliminar esta categoria?'
        }
      />

      {(isSaving || isDeleting) && (
        <div
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[#e6dec5] bg-white px-4 py-3 text-xs font-bold text-[#2b1810] shadow-lg"
          role="status"
        >
          <Loader2
            className="h-4 w-4 animate-spin text-[#5c3524]"
            aria-hidden="true"
          />

          <span>
            {isSaving
              ? 'A guardar categoria...'
              : 'A eliminar categoria...'}
          </span>
        </div>
      )}
    </div>
  );
}