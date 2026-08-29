import React from 'react';

interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarItem({ label, icon: Icon, badge, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer
        ${isActive 
          ? 'bg-amber-600 text-white shadow-sm font-bold' 
          : 'hover:bg-stone-800 hover:text-white text-stone-400'}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}