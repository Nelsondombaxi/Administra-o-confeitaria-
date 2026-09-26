import { supabase } from '../lib/supabase';

export interface ProductPayload {
  name: string;
  description?: string;
  price: number;
  category_id?: string | null;
  image_url?: string | null;
  is_active?: boolean;
}

export interface ProductRecord extends ProductPayload {
  id: string;
  created_at: string;
  updated_at?: string | null;

  // Relação com categories no Supabase
  categories?: {
    id: string;
    name: string;
    slug?: string;
    description?: string | null;
    image_url?: string | null;
  } | null;

  // Compatibilidade com o formato usado na interface
  imageUrl?: string;
  available?: boolean;
}

export const productService = {
  /**
   * Obtém apenas os produtos ativos.
   * Usado principalmente pela vitrine.
   */
  async getActiveProducts(): Promise<ProductRecord[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        'Erro ao buscar produtos ativos:',
        error
      );

      throw error;
    }

    return (data ?? []) as ProductRecord[];
  },

  /**
   * Obtém todos os produtos.
   * Usado pelo painel administrativo.
   */
  async getAllProducts(): Promise<ProductRecord[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        'Erro ao buscar produtos:',
        error
      );

      throw error;
    }

    return (data ?? []) as ProductRecord[];
  },

  /**
   * Cria um novo produto.
   */
  async createProduct(
    productData: ProductPayload
  ): Promise<ProductRecord> {
    const payload: ProductPayload = {
      name: productData.name.trim(),
      description: productData.description?.trim() ?? '',
      price: Number(productData.price),
      category_id: productData.category_id ?? null,
      image_url: productData.image_url ?? null,
      is_active: productData.is_active ?? true,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error(
        'Erro ao criar produto:',
        error
      );

      throw error;
    }

    return data as ProductRecord;
  },

  /**
   * Atualiza um produto existente.
   */
  async updateProduct(
    id: string,
    productData: ProductPayload
  ): Promise<ProductRecord> {
    if (!id) {
      throw new Error('ID do produto não informado.');
    }

    const payload: ProductPayload = {
      name: productData.name.trim(),
      description: productData.description?.trim() ?? '',
      price: Number(productData.price),
      category_id: productData.category_id ?? null,
      image_url: productData.image_url ?? null,
      is_active: productData.is_active ?? true,
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(
        `Erro ao atualizar produto ${id}:`,
        error
      );

      throw error;
    }

    return data as ProductRecord;
  },

  /**
   * Elimina um produto.
   */
  async deleteProduct(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('ID do produto não informado.');
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        `Erro ao eliminar produto ${id}:`,
        error
      );

      throw error;
    }

    return true;
  },
};