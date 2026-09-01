import { supabase } from '../lib/supabase';

export const orderService = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id: string, updates: { payment_status?: string; status?: string }) {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

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