import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { NotificationItemData } from '../types';

export function useOrderNotifications() {
  const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
  const [activeToast, setActiveToast] = useState<NotificationItemData | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();

        const response = await fetch('/sounds/notification.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.warn('Erro ao carregar/decodificar o áudio:', err);
      }
    };

    fetchAudio();

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

          if (audioContextRef.current && audioBufferRef.current) {
            if (audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume();
            }

            const source = audioContextRef.current.createBufferSource();
            const gainNode = audioContextRef.current.createGain();

            source.buffer = audioBufferRef.current;
            gainNode.gain.value = 3.0; // Multiplica o volume original por 3 (300%)

            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            source.start(0);
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