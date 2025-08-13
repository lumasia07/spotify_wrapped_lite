'use client';

import { useState } from 'react';
import { LogOut, Music, Crown, Users, Globe, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../shared/UserAvatar';
import { USER_PROFILE_STYLES, PREMIUM_CHECK } from '../shared/userProfileStyles';

interface DashboardUserProfileProps {
  className?: string;
  onLogout?: () => void;
}

const DashboardUserProfile = ({ className = '', onLogout }: DashboardUserProfileProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const isPremium = PREMIUM_CHECK(user.product);

  return (
    <div className={`relative ${className}`}>
      {/* User Profile Button - Compact Version */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-full px-3 py-2 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        aria-label="User profile menu"
      >
        {/* Avatar - Smaller */}
        <UserAvatar user={user} size="small" />

        {/* User Info - Minimal */}
        <div className="hidden sm:flex flex-col min-w-0 text-left">
          <div className="text-white text-sm font-medium truncate max-w-24">
            {user.spotify_display_name || user.name}
          </div>
          {isPremium && (
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Premium</span>
            </div>
          )}
        </div>

        {/* Dropdown Icon */}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className={USER_PROFILE_STYLES.dropdown.backdrop}
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-gradient-to-br from-slate-900/95 via-navy-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Extended User Info */}
            <div className="p-5 border-b border-slate-600/30">
              <div className="flex items-start gap-4">
                {/* Large Avatar */}
                <UserAvatar user={user} size="large" />
                
                {/* Detailed User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-lg font-bold mb-1">
                    {user.spotify_display_name || user.name}
                  </div>
                  {user.email && (
                    <div className="text-slate-400 text-sm mb-3 truncate">
                      {user.email}
                    </div>
                  )}
                  
                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Subscription */}
                    {user.product && (
                      <div className="flex items-center gap-2">
                        <Crown className={`w-4 h-4 ${isPremium ? 'text-yellow-400' : 'text-slate-400'}`} />
                        <div>
                          <div className={`text-xs font-medium uppercase tracking-wide ${isPremium ? 'text-yellow-400' : 'text-slate-400'}`}>
                            {user.product}
                          </div>
                          <div className="text-xs text-slate-500">
                            Subscription
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Followers */}
                    {user.followers_count !== undefined && user.followers_count !== null && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="text-xs text-white font-medium">
                            {user.followers_count.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            Followers
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Country */}
                    {user.country && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="text-xs text-white font-medium uppercase">
                            {user.country}
                          </div>
                          <div className="text-xs text-slate-500">
                            Country
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Spotify ID */}
                    {user.spotify_id && (
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs text-white font-medium truncate">
                            {user.spotify_id}
                          </div>
                          <div className="text-xs text-slate-500">
                            Spotify ID
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="p-3">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 focus:outline-none focus:bg-slate-700/50"
              >
                <Settings className="w-5 h-5 text-slate-400" />
                <span className="font-medium">Profile Settings</span>
              </button>
              
              <div className="h-px bg-slate-600/30 my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 focus:outline-none focus:bg-red-500/10"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardUserProfile;
