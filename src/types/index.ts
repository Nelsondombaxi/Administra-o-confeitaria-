export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string | null;
  categoryName: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'production'
  | 'completed';

export type PaymentMethod =
  | 'IBAN'
  | 'EXPRESS'
  | string;

export type PaymentStatus =
  | 'pending_payment'
  | 'paid'
  | 'failed'
  | 'refunded'
  | string;

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  quantity: number;
  total: number;
  totalValue: number;
  status: OrderStatus;
  createdAt: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentProofUrl: string;
  notes: string;
}

export interface NotificationItemData {
  id: string;
  type: 'order' | 'proof';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}