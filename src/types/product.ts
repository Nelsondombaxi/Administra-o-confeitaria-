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