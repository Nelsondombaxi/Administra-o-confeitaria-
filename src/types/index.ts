export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  productName: string;
  totalValue: number;
  status: 'pending' | 'confirmed' | 'production' | 'completed';
  createdAt: string;
}

export interface NotificationItemData {
  id: string;
  type: 'order' | 'proof';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
}