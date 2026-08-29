import type { Product } from '../../types/product';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bolo de Chocolate Supremo',
    description: 'Massa fofinha de chocolate belo com recheio triplo de brigadeiro gourmet.',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
    categoryId: '1',
    categoryName: 'Bolos',
    available: true,
  },
  {
    id: '2',
    name: 'Red Velvet Clássico',
    description: 'Bolo avermelhado com toque subtil de cacau e recheio cremoso de cream cheese.',
    price: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=400',
    categoryId: '1',
    categoryName: 'Bolos',
    available: false,
  },
  {
    id: '3',
    name: 'Cupcake de Baunilha e Doce de Leite',
    description: 'Massa leve de baunilha com cobertura generosa e recheio artesanal de doce de leite.',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=400',
    categoryId: '2',
    categoryName: 'Cupcakes',
    available: true,
  },
];