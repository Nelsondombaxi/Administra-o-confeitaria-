import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  FolderTree,
  Loader2,
  Package,
  Plus,
  Search,
  XCircle,
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

import { ProductTable } from '../../components/products/ProductTable';
import { ProductModal } from '../../components/products/ProductModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

import type { Product } from '../../types/product';
import type { ProductFormData } from '../../components/products/ProductModal';

const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60';

type AdminProduct = Product & {
  categoryName: string;
};

type CategoryList = Awaited<
  ReturnType<typeof categoryService.getAllCategories>
>;

export function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] =
    useState<CategoryList>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<AdminProduct | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const [productToDelete, setProductToDelete] =
    useState<AdminProduct | null>(null);

  const [errorMessage, setErrorMessage] =
    useState('');

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setErrorMessage('');

        const [prodData, catData] =
          await Promise.all([
            productService.getAllProducts(),
            categoryService.getAllCategories(),
          ]);

        const formattedProducts: AdminProduct[] =
          (prodData ?? []).map((product) => {
            const categoryId =
              typeof product.category_id ===
              'string'
                ? product.category_id
                : null;

            const categoryName =
              product.categories?.name ||
              'Sem categoria';

            const imageUrl =
              product.image_url?.trim() ||
              product.imageUrl?.trim() ||
              DEFAULT_PRODUCT_IMAGE;

            const available =
              typeof product.is_active ===
              'boolean'
                ? product.is_active
                : typeof product.available ===
                    'boolean'
                  ? product.available
                  : true;

            return {
              id: product.id,
              name: product.name,
              description:
                product.description ?? '',
              price: Number(
                product.price ?? 0,
              ),
              imageUrl,
              categoryId,
              categoryName,
              available,
            };
          });

        setProducts(formattedProducts);
        setCategories(catData ?? []);
      } catch (error) {
        console.error(
          'Erro ao carregar produtos e categorias:',
          error,
        );

        setProducts([]);
        setCategories([]);

        setErrorMessage(
          'Não foi possível carregar os produtos. Tenta novamente.',
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    const productsChannel = supabase
      .channel('admin-products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        () => {
          void fetchData(false);
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            'Realtime de produtos conectado.',
          );
        }

        if (status === 'CHANNEL_ERROR') {
          console.error(
            'Erro no canal Realtime de produtos.',
          );
        }

        if (status === 'TIMED_OUT') {
          console.error(
            'Timeout no canal Realtime de produtos.',
          );
        }
      });

    const categoriesChannel = supabase
      .channel('admin-categories-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
        },
        () => {
          void fetchData(false);
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            'Realtime de categorias conectado.',
          );
        }

        if (status === 'CHANNEL_ERROR') {
          console.error(
            'Erro no canal Realtime de categorias.',
          );
        }

        if (status === 'TIMED_OUT') {
          console.error(
            'Timeout no canal Realtime de categorias.',
          );
        }
      });

    return () => {
      void supabase.removeChannel(
        productsChannel,
      );

      void supabase.removeChannel(
        categoriesChannel,
      );
    };
  }, [fetchData]);

  const normalizedSearch =
    searchTerm.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const productName =
        product.name?.toLowerCase() ?? '';

      const categoryName =
        product.categoryName?.toLowerCase() ?? '';

      return (
        productName.includes(
          normalizedSearch,
        ) ||
        categoryName.includes(
          normalizedSearch,
        )
      );
    });
  }, [products, normalizedSearch]);

  const availableProducts = useMemo(
    () =>
      products.filter(
        (product) => product.available,
      ).length,
    [products],
  );

  const unavailableProducts =
    products.length - availableProducts;

  const handleOpenAdd = () => {
    setErrorMessage('');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    const adminProduct =
      product as AdminProduct;

    setErrorMessage('');
    setSelectedProduct(adminProduct);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const product = products.find(
      (item) => item.id === id,
    );

    if (!product) {
      setErrorMessage(
        'Não foi possível encontrar o produto selecionado.',
      );
      return;
    }

    setErrorMessage('');
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseProductModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (
    data: ProductFormData,
  ) => {
    try {
      setSaving(true);
      setErrorMessage('');

      const name = data.name.trim();
      const description =
        data.description.trim();
      const price = Number(data.price);
      const categoryId =
        data.categoryId || null;

      const imageUrl =
        data.imageUrl.trim() ||
        DEFAULT_PRODUCT_IMAGE;

      const isActive = Boolean(
        data.available,
      );

      if (!name) {
        setErrorMessage(
          'O nome do produto é obrigatório.',
        );
        return;
      }

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {
        setErrorMessage(
          'Introduz um preço válido para o produto.',
        );
        return;
      }

      if (!categoryId) {
        setErrorMessage(
          'Seleciona uma categoria para o produto.',
        );
        return;
      }

      const payload = {
        name,
        description,
        price,
        category_id: categoryId,
        image_url: imageUrl,
        is_active: isActive,
      };

      if (selectedProduct) {
        await productService.updateProduct(
          selectedProduct.id,
          payload,
        );
      } else {
        await productService.createProduct(
          payload,
        );
      }

      setIsModalOpen(false);
      setSelectedProduct(null);

      await fetchData(false);
    } catch (error) {
      console.error(
        'Erro ao guardar produto:',
        error,
      );

      setErrorMessage(
        'Não foi possível guardar o produto. Verifica os dados e tenta novamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMessage('');

      await productService.deleteProduct(
        productToDelete.id,
      );

      setProductToDelete(null);
      setIsDeleteDialogOpen(false);

      await fetchData(false);
    } catch (error) {
      console.error(
        'Erro ao eliminar produto:',
        error,
      );

      setErrorMessage(
        'Não foi possível eliminar o produto. Tenta novamente.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden rounded-3xl border border-[#e6dec5] bg-[#f4efe6] shadow-sm">
        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-[#c5a059]/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-6 md:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2b1810] text-[#c5a059]">
                <Package
                  className="h-4.5 w-4.5"
                  aria-hidden="true"
                />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8c5338]">
                Catálogo
              </span>
            </div>

            <h1 className="font-serif text-2xl font-black tracking-tight text-[#2b1810] md:text-3xl">
              Gestão de Produtos
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#6f5141]">
              Gere os produtos apresentados na
              vitrine, categorias, preços e
              disponibilidade.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={saving || deleting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#c5a059]/40 bg-[#2b1810] px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#3d2318] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
          >
            <Plus
              className="h-4 w-4 text-[#c5a059]"
              aria-hidden="true"
            />

            <span>Adicionar produto</span>
          </button>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c5338]">
                Total
              </p>

              <p className="mt-1 text-2xl font-black text-[#2b1810]">
                {products.length}
              </p>

              <p className="mt-0.5 text-[11px] text-[#8c5338]">
                produtos registados
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4efe6] text-[#8c5338]">
              <Package
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c5338]">
                Disponíveis
              </p>

              <p className="mt-1 text-2xl font-black text-[#2b1810]">
                {availableProducts}
              </p>

              <p className="mt-0.5 text-[11px] text-[#8c5338]">
                disponíveis para venda
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8c5338]">
                Indisponíveis
              </p>

              <p className="mt-1 text-2xl font-black text-[#2b1810]">
                {unavailableProducts}
              </p>

              <p className="mt-0.5 text-[11px] text-[#8c5338]">
                fora da vitrine
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <XCircle
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Erro */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700 shadow-sm"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />

          <div className="min-w-0 flex-1">
            <p className="font-bold">
              Ocorreu um problema
            </p>

            <p className="mt-0.5 text-xs">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage('')}
            aria-label="Fechar mensagem de erro"
            className="cursor-pointer rounded-lg p-1 text-red-500 transition-colors hover:bg-red-100"
          >
            <XCircle
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      )}

      {/* Pesquisa */}
      <section className="rounded-2xl border border-[#e6dec5] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c5338]"
              aria-hidden="true"
            />

            <label
              htmlFor="product-search"
              className="sr-only"
            >
              Pesquisar produtos
            </label>

            <input
              id="product-search"
              type="search"
              placeholder="Pesquisar por nome ou categoria..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              className="w-full rounded-xl border border-[#e6dec5] bg-[#fdfbf7] py-3 pl-10 pr-10 text-xs text-[#2b1810] outline-none transition-all placeholder:text-[#9a806f] focus:border-[#c5a059] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/10"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar pesquisa"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#8c5338] transition-colors hover:text-[#2b1810]"
              >
                <XCircle
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#f4efe6] px-3 py-2">
            <FolderTree
              className="h-3.5 w-3.5 text-[#8c5338]"
              aria-hidden="true"
            />

            <span className="text-[11px] font-semibold text-[#5c3524]">
              {categories.length}{' '}
              {categories.length === 1
                ? 'categoria'
                : 'categorias'}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#f4efe6] pt-3">
          <p className="text-[11px] text-[#8c5338]">
            {searchTerm
              ? `${filteredProducts.length} resultado${
                  filteredProducts.length === 1
                    ? ''
                    : 's'
                } encontrado${
                  filteredProducts.length === 1
                    ? ''
                    : 's'
                }`
              : `${products.length} produto${
                  products.length === 1
                    ? ''
                    : 's'
                }`}
          </p>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="cursor-pointer text-[11px] font-bold text-[#5c3524] transition-colors hover:text-[#c5a059]"
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      </section>

      {/* Conteúdo */}
      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-2xl border border-[#e6dec5] bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4efe6]">
              <Loader2
                className="h-6 w-6 animate-spin text-[#5c3524]"
                aria-hidden="true"
              />
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-[#2b1810]">
                A carregar produtos
              </p>

              <p className="mt-1 text-xs text-[#8c5338]">
                Estamos a preparar o catálogo...
              </p>
            </div>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9ccb0] bg-white px-6 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4efe6] text-[#8c5338]">
            <Package
              className="h-6 w-6"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-4 font-serif text-lg font-black text-[#2b1810]">
            {searchTerm
              ? 'Nenhum produto encontrado'
              : 'Ainda não existem produtos'}
          </h2>

          <p className="mt-1 max-w-sm text-xs leading-5 text-[#8c5338]">
            {searchTerm
              ? 'Tenta pesquisar por outro nome ou categoria.'
              : 'Adiciona o primeiro produto para começar a montar a vitrine.'}
          </p>

          {!searchTerm && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl bg-[#2b1810] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#3d2318]"
            >
              <Plus
                className="h-4 w-4 text-[#c5a059]"
                aria-hidden="true"
              />

              <span>
                Adicionar primeiro produto
              </span>
            </button>
          )}

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-5 cursor-pointer rounded-xl bg-[#f4efe6] px-4 py-2.5 text-xs font-bold text-[#5c3524] transition-colors hover:bg-[#e6dec5]"
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      )}

      {/* Modal de produto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* Confirmação de eliminação */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Eliminar produto?"
        message={
          productToDelete
            ? `Tens a certeza que queres eliminar "${productToDelete.name}"? Esta ação não pode ser desfeita.`
            : 'Tens a certeza que queres eliminar este produto?'
        }
      />

      {/* Indicador de operação */}
      {(saving || deleting) && (
        <div
          className="pointer-events-none fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[#e6dec5] bg-white px-4 py-3 text-xs font-semibold text-[#5c3524] shadow-xl"
          role="status"
          aria-live="polite"
        >
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />

          <span>
            {saving
              ? 'A guardar produto...'
              : 'A eliminar produto...'}
          </span>
        </div>
      )}
    </div>
  );
}