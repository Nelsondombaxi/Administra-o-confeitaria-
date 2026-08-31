import { supabase } from '../lib/supabase';

export const categoryService = {
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createCategory(categoryData: { name: string; slug: string; description?: string; image_url?: string }) {
    const payload = {
      ...categoryData,
      image_url: categoryData.image_url || null,
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, categoryData: { name?: string; slug?: string; description?: string; image_url?: string }) {
    const payload = {
      ...categoryData,
      image_url: categoryData.image_url || null,
    };

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};