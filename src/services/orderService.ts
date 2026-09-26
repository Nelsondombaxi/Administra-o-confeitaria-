import { supabase } from '../lib/supabase';

export type OrderPaymentStatus =
  | 'pending_payment'
  | 'paid'
  | 'failed'
  | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'production'
  | 'completed';

export interface OrderStatusUpdates {
  payment_status?: OrderPaymentStatus;
  status?: OrderStatus;
}

export interface OrderWithProduct {
  id: string;
  product_id: string | null;
  quantity?: number | null;
  total?: number | null;
  total_amount?: number | null;
  deposit_amount?: number | null;
  remaining_amount?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  payment_method?: string | null;
  payment_proof_url?: string | null;
  notes?: string | null;
  payment_status?: OrderPaymentStatus | string | null;
  status?: OrderStatus | string | null;
  created_at: string;
  updated_at?: string | null;

  products?: {
    name: string;
  } | null;

  product_name?: string | null;

  [key: string]: unknown;
}

export interface SettingsData {
  id?: string;
  business_name?: string | null;
  whatsapp_number?: string | null;
  bank_1_name?: string | null;
  bank_1_iban?: string | null;
  bank_2_name?: string | null;
  bank_2_iban?: string | null;
  express_number?: string | null;
  deposit_percentage?: number | string | null;
  admin_system_name?: string | null;
  admin_dashboard_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export const orderService = {
  async getAllOrders(): Promise<OrderWithProduct[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pedidos:', error);
      throw error;
    }

    return (data ?? []) as OrderWithProduct[];
  },

  async updateOrderStatus(
    id: string,
    updates: OrderStatusUpdates,
  ): Promise<OrderWithProduct> {
    if (!id) {
      throw new Error('ID do pedido não informado.');
    }

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

    if (error) {
      console.error(
        `Erro ao atualizar o pedido ${id}:`,
        error,
      );

      throw error;
    }

    return data as OrderWithProduct;
  },

  async getSettings(): Promise<SettingsData | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        'Erro ao buscar configurações:',
        error,
      );

      throw error;
    }

    return data as SettingsData | null;
  },

  async updateSettings(
    settingsData: SettingsData,
  ): Promise<SettingsData> {
    const { id, ...payload } = settingsData;

    if (id) {
      const { data, error } = await supabase
        .from('settings')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(
          'Erro ao atualizar configurações:',
          error,
        );

        throw error;
      }

      return data as SettingsData;
    }

    const { data, error } = await supabase
      .from('settings')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error(
        'Erro ao criar configurações:',
        error,
      );

      throw error;
    }

    return data as SettingsData;
  },
};