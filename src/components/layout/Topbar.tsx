import {
  ExternalLink,
  Menu,
  Sparkles,
} from 'lucide-react';

import { NotificationBell } from '../notifications/NotificationBell';
import { useAdminSettings } from '../../contexts/AdminSettingsContext';

interface TopbarProps {
  onOpenSidebar: () => void;
}

const STORE_URL = 'https://confetariabuildcake.netlify.app/';

const getInitial = (name: string) => {
  const trimmedName = name.trim();

  return trimmedName
    ? trimmedName.charAt(0).toUpperCase()
    : '';
};

export function Topbar({
  onOpenSidebar,
}: TopbarProps) {
  const {
    settings,
    loading: settingsLoading,
  } = useAdminSettings();

  const adminName =
    settings?.admin_dashboard_name?.trim() || '';

  const businessName =
    settings?.business_name?.trim() || '';

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e6dec5]/80 bg-white/95 px-4 shadow-sm backdrop-blur-md md:px-8">
      {/* Lado esquerdo */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Menu mobile */}
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
          title="Abrir menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#e6dec5] bg-[#fdfbf7] text-[#5c3524] transition-all duration-200 hover:border-[#c5a059]/50 hover:bg-[#f4efe6] hover:text-[#2b1810] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 md:hidden"
        >
          <Menu
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        {/* Identificação da loja */}
        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#c5a059]/25 bg-[#f4efe6] text-[#c5a059]">
            <Sparkles
              aria-hidden="true"
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8c5338]">
              Loja
            </p>

            {!settingsLoading && businessName ? (
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <span
                  className="max-w-[200px] truncate text-xs font-bold text-[#2b1810]"
                  title={businessName}
                >
                  {businessName}
                </span>

                <a
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-bold text-[#8c5338] transition-all duration-200 hover:bg-[#f4efe6] hover:text-[#2b1810] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40"
                >
                  <span>Ver loja</span>

                  <ExternalLink
                    aria-hidden="true"
                    className="h-3 w-3"
                  />
                </a>
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="mt-1 h-3 w-32 animate-pulse rounded-md bg-[#e6dec5]"
              />
            )}
          </div>
        </div>
      </div>

      {/* Lado direito */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notificações */}
        <div className="flex items-center justify-center">
          <NotificationBell />
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-3 border-l border-[#e6dec5] pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            {!settingsLoading && adminName ? (
              <>
                <p
                  className="max-w-[150px] truncate text-xs font-bold leading-tight text-[#2b1810]"
                  title={adminName}
                >
                  {adminName}
                </p>

                <div className="mt-1 flex items-center justify-end gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8c5338]">
                    Painel ativo
                  </p>
                </div>
              </>
            ) : (
              <div
                aria-hidden="true"
                className="space-y-1.5"
              >
                <div className="ml-auto h-3 w-24 animate-pulse rounded-md bg-[#e6dec5]" />

                <div className="ml-auto h-2 w-16 animate-pulse rounded-md bg-[#f4efe6]" />
              </div>
            )}
          </div>

          {!settingsLoading && adminName ? (
            <div
              aria-label={`Perfil de ${adminName}`}
              title={adminName}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c5a059]/40 bg-[#2b1810] font-serif text-sm font-black text-[#c5a059] shadow-sm transition-all duration-200 hover:border-[#c5a059] hover:shadow-md md:h-11 md:w-11"
            >
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />

              {getInitial(adminName)}
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="h-10 w-10 animate-pulse rounded-xl bg-[#2b1810]/10 md:h-11 md:w-11"
            />
          )}
        </div>
      </div>
    </header>
  );
}