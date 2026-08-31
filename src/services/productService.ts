import { supabase } from '../lib/supabase';

export const productService = {
  // Obter todos os produtos ativos (para a vitrine)
  async getActiveProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Obter todos os produtos (para o painel administrativo)
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Criar um novo produto (Admin)
  async createProduct(productData: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar produto (Admin)
  async updateProduct(id: string, productData: any) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remover produto (Admin)
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};