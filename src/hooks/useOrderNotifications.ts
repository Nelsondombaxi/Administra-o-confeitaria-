import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { NotificationItemData } from '../types';

export function useOrderNotifications() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  const [activeToast, setActiveToast] = useState<NotificationItemData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');

    const channel = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        async (payload) => {
          const newOrder = payload.new;

          let productName = 'Produto';
          if (newOrder.product_id) {
            const { data } = await supabase
              .from('products')
              .select('name')
              .eq('id', newOrder.product_id)
              .single();
            if (data) productName = data.name;
          }

          const customerName = newOrder.customer_name || 'Cliente';
          const formattedTime = new Date().toLocaleTimeString('pt-AO', {
            hour: '2-digit',
            minute: '2-digit',
          });

          const newNotification: NotificationItemData = {
            id: newOrder.id || String(Date.now()),
            type: 'order',
            title: 'Novo Pedido Recebido',
            description: `${customerName} encomendou ${productName}`,
            timestamp: formattedTime,
            unread: true,
          };

          setNotifications((prev) => [newNotification, ...prev]);
          setActiveToast(newNotification);

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
              console.warn('O navegador bloqueou o som por falta de clique na página:', err);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return {
    notifications,
    activeToast,
    closeToast: () => setActiveToast(null),
    handleMarkAsRead,
    handleMarkAllAsRead,
  };
}