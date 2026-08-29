import type { Order } from '../../types';

export const mockOrders: Order[] = [
  {
    id: 'PED-1042',
    customerName: 'Mariana Silva',
    productName: 'Bolo de Chocolate Supremo',
    totalValue: 25000,
    status: 'production',
    createdAt: 'Hoje, 14:30',
  },
  {
    id: 'PED-1041',
    customerName: 'Carlos Alberto',
    productName: 'Red Velvet Clássico',
    totalValue: 30000,
    status: 'confirmed',
    createdAt: 'Hoje, 11:15',
  },
  {
    id: 'PED-1040',
    customerName: 'Ana Joaquina',
    productName: 'Cupcake de Baunilha e Doce de Leite',
    totalValue: 7500,
    status: 'pending',
    createdAt: 'Ontem, 18:45',
  },
  {
    id: 'PED-1039',
    customerName: 'Beatriz Costa',
    productName: 'Caixa de Doces Finos Sortidos',
    totalValue: 45000,
    status: 'completed',
    createdAt: '26 Ago, 10:20',
  },
];