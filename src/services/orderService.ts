import { supabase } from '../lib/supabase';

export const orderService = {
  // Obter todas as encomendas com os dados do produto (Admin)
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Atualizar o status de uma encomenda ou dados de pagamento (Admin)
  async updateOrderStatus(id: string, updates: { payment_status?: string; status?: string }) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obter as configurações gerais (como taxas, dados de pagamento, etc.)
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  // Atualizar as configurações gerais (Admin)
  async updateSettings(settingsData: any) {
    const { data, error } = await supabase
      .from('settings')
      .update(settingsData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};