import { supabase } from '../lib/supabase';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string | null;
  productCount: number;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
}

interface CategoryQueryResult {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string | null;
  products?: Array<{
    id: string;
  }> | null;
}

const formatCategory = (
  category: CategoryQueryResult,
): CategoryRecord => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description ?? null,
  image_url: category.image_url ?? null,
  created_at: category.created_at,
  updated_at: category.updated_at,
  productCount: category.products?.length ?? 0,
});

const normalizePayload = (
  categoryData: CategoryPayload,
): CategoryPayload => {
  const name = categoryData.name.trim();
  const slug = categoryData.slug.trim();

  if (!name) {
    throw new Error(
      'O nome da categoria é obrigatório.',
    );
  }

  if (!slug) {
    throw new Error(
      'O slug da categoria é obrigatório.',
    );
  }

  return {
    name,
    slug,
    description:
      categoryData.description?.trim() || null,
    image_url:
      categoryData.image_url?.trim() || null,
  };
};

export const categoryService = {
  async getAllCategories(): Promise<CategoryRecord[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products (
          id
        )
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error(
        'Erro ao buscar categorias:',
        error,
      );

      throw error;
    }

    const categories =
      (data ?? []) as CategoryQueryResult[];

    return categories.map(formatCategory);
  },

  async createCategory(
    categoryData: CategoryPayload,
  ): Promise<CategoryRecord> {
    const payload =
      normalizePayload(categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert(payload)
      .select(`
        *,
        products (
          id
        )
      `)
      .single();

    if (error) {
      console.error(
        'Erro ao criar categoria:',
        error,
      );

      throw error;
    }

    return formatCategory(
      data as CategoryQueryResult,
    );
  },

  async updateCategory(
    id: string,
    categoryData: UpdateCategoryPayload,
  ): Promise<CategoryRecord> {
    if (!id) {
      throw new Error(
        'ID da categoria não informado.',
      );
    }

    const payload: UpdateCategoryPayload = {};

    if (categoryData.name !== undefined) {
      const name = categoryData.name.trim();

      if (!name) {
        throw new Error(
          'O nome da categoria não pode ficar vazio.',
        );
      }

      payload.name = name;
    }

    if (categoryData.slug !== undefined) {
      const slug = categoryData.slug.trim();

      if (!slug) {
        throw new Error(
          'O slug da categoria não pode ficar vazio.',
        );
      }

      payload.slug = slug;
    }

    if (categoryData.description !== undefined) {
      payload.description =
        categoryData.description?.trim() || null;
    }

    if (categoryData.image_url !== undefined) {
      payload.image_url =
        categoryData.image_url?.trim() || null;
    }

    if (Object.keys(payload).length === 0) {
      throw new Error(
        'Nenhuma alteração foi informada.',
      );
    }

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select(`
        *,
        products (
          id
        )
      `)
      .single();

    if (error) {
      console.error(
        `Erro ao atualizar categoria ${id}:`,
        error,
      );

      throw error;
    }

    return formatCategory(
      data as CategoryQueryResult,
    );
  },

  async deleteCategory(
    id: string,
  ): Promise<boolean> {
    if (!id) {
      throw new Error(
        'ID da categoria não informado.',
      );
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        `Erro ao eliminar categoria ${id}:`,
        error,
      );

      throw error;
    }

    return true;
  },
};