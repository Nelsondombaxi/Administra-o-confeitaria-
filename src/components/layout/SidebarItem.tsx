import type { ComponentType } from 'react';

interface SidebarItemProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  isActive: boolean;
  onClick: () => void;
}

export function SidebarItem({
  label,
  icon: Icon,
  badge,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex w-full cursor-pointer items-center justify-between
        rounded-xl px-4 py-3 text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? 'border-l-4 border-[#c5a059] bg-[#5c3524] font-bold text-white shadow-sm'
            : 'text-[#f4efe6]/70 hover:bg-[#3d2318] hover:text-white'
        }
      `}
    >
      <span className="flex items-center gap-3">
        <Icon
          aria-hidden="true"
          className={`h-5 w-5 transition-colors ${
            isActive ? 'text-[#c5a059]' : 'text-[#b87351]'
          }`}
        />

        <span>{label}</span>
      </span>

      {badge && (
        <span
          aria-label={`${badge} pedidos pendentes`}
          className="rounded-full bg-[#c5a059] px-2 py-0.5 text-[10px] font-black text-[#2b1810]"
        >
          {badge}
        </span>
      )}
    </button>
  );
}