interface NotificationItemProps {
  type: 'red' | 'yellow';
  title: string;
  description: string;
  time: string;
  onClick?: () => void;
}

export function NotificationItem({ type, title, description, time, onClick }: NotificationItemProps) {
  const dotColor = type === 'red' ? 'bg-[#8c5338]' : 'bg-[#c5a059]';

  return (
    <div onClick={onClick} className="p-3.5 hover:bg-[#f4efe6] transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-1.5 shrink-0 shadow-sm`} />
        <div>
          <p className="text-xs font-bold text-[#2b1810]">{title}</p>
          <p className="text-xs text-[#5c3524] mt-0.5">{description}</p>
          <span className="text-[10px] text-[#b87351] mt-1 block font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
}