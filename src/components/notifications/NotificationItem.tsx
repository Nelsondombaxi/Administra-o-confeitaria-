interface NotificationItemProps {
  type: 'red' | 'yellow';
  title: string;
  description: string;
  time: string;
  onClick?: () => void;
}

export function NotificationItem({ type, title, description, time, onClick }: NotificationItemProps) {
  const dotColor = type === 'red' ? 'bg-red-500' : 'bg-amber-500';

  return (
    <div onClick={onClick} className="p-3 hover:bg-stone-50 transition-colors cursor-pointer">
      <div className="flex items-start gap-2.5">
        <span className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
        <div>
          <p className="text-xs font-bold text-stone-800">{title}</p>
          <p className="text-xs text-stone-600">{description}</p>
          <span className="text-[10px] text-stone-400 mt-1 block">{time}</span>
        </div>
      </div>
    </div>
  );
}