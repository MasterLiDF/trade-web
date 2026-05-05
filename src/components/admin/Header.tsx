'use client';

import { UserCircle, LogOut } from 'lucide-react';
import { MobileMenuButton } from './Sidebar';

interface HeaderProps {
  userInfo: { username: string } | null;
  onLogout: () => void;
  onMobileMenuClick: () => void;
}

export default function Header({
  userInfo,
  onLogout,
  onMobileMenuClick,
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile menu button */}
      <div className="flex items-center gap-4">
        <MobileMenuButton onClick={onMobileMenuClick} />
        <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
          皮革外贸管理后台
        </h1>
      </div>

      {/* Right: User info & logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-600">
          <UserCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">
            {userInfo?.username || '管理员'}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="
            flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
            text-red-600 hover:bg-red-50 rounded-lg
            transition-colors duration-200
          "
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">退出登录</span>
        </button>
      </div>
    </header>
  );
}
