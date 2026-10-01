"use client";

import { Menu, Bell, X } from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
  mobileMenuOpen: boolean;
};

export default function Header({
  onMenuClick,
  mobileMenuOpen,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-medium text-gray-500">
          Business Management
        </p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            IE
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              Imran Endris
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}