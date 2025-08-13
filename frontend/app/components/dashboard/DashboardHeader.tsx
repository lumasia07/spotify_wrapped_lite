'use client';

import { Music, Sparkles } from 'lucide-react';
import DashboardUserProfile from './DashboardUserProfile';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onLogout?: () => void;
}

const DashboardHeader = ({ 
  title = "Spotify Wrapped Lite", 
  subtitle,
  onLogout 
}: DashboardHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-slate-900/80 via-navy-900/60 to-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-400 text-xs">{subtitle}</p>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0">
            <DashboardUserProfile onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
