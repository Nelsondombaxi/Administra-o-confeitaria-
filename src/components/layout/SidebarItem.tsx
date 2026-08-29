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
          ? 'bg-[#5c3524] text-white shadow-sm font-bold border-l-4 border-[#c5a059]' 
          : 'hover:bg-[#3d2318] hover:text-white text-[#f4efe6]/70'}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${isActive ? 'text-[#c5a059]' : 'text-[#b87351]'}`} />
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-[#c5a059] text-[#2b1810] text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}