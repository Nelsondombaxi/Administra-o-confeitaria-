import type { NotificationItemData } from '../../types';

export const mockNotifications: NotificationItemData[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Novo pedido recebido',
    description: 'Mariana Silva fez um pedido de 25.000 Kz.',
    timestamp: 'Há 5 minutos',
    unread: true,
  },
  {
    id: 'notif-2',
    type: 'proof',
    title: 'Comprovativo enviado',
    description: 'Carlos Alberto enviou o talão de transferência.',
    timestamp: 'Há 25 minutos',
    unread: true,
  },
  {
    id: 'notif-3',
    type: 'order',
    title: 'Pedido confirmado',
    description: 'O pagamento de Ana Joaquina foi validado.',
    timestamp: 'Há 2 horas',
    unread: false,
  },
];