'use client';

import { useState } from 'react';
import { LogOut, Music, Crown, Users, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserAvatar from '../shared/UserAvatar';
import { USER_PROFILE_STYLES, PREMIUM_CHECK } from '../shared/userProfileStyles';

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  const handleDashboard = () => {
    window.location.href = '/dashboard';
  };

  const isPremium = PREMIUM_CHECK(user.product);

  return (
    <div className="relative">
      {/* User Avatar/Button - Mobile First Design */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${USER_PROFILE_STYLES.button.profile} p-1.5 sm:p-2 pr-3 sm:pr-4 ${USER_PROFILE_STYLES.button.base}`}
        aria-label="User menu"
      >
        {/* Avatar */}
        <UserAvatar user={user} size="small" />

        {/* Name - Hidden on small screens */}
        <span className="text-white font-medium text-sm sm:text-base hidden sm:block truncate max-w-24 lg:max-w-none">
          {user.spotify_display_name || user.name}
        </span>
      </button>

      {/* Dropdown Menu - Mobile Optimized */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className={USER_PROFILE_STYLES.dropdown.backdrop}
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className={`${USER_PROFILE_STYLES.dropdown.menu} ${USER_PROFILE_STYLES.dropdown.menuWide}`}>
            {/* User Info Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <UserAvatar user={user} size="large" />
                
                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <div className={`${USER_PROFILE_STYLES.text.name} text-lg`}>
                    {user.spotify_display_name || user.name}
                  </div>
                  {user.email && (
                    <div className={USER_PROFILE_STYLES.text.email}>
                      {user.email}
                    </div>
                  )}
                  
                  {/* User Stats */}
                  <div className="flex items-center gap-4 mt-2">
                    {/* Subscription Type */}
                    {user.product && (
                      <div className="flex items-center gap-1.5">
                        <Crown className={`w-3.5 h-3.5 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium uppercase tracking-wide ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {user.product}
                        </span>
                      </div>
                    )}
                    
                    {/* Followers */}
                    {user.followers_count !== undefined && user.followers_count !== null && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className={USER_PROFILE_STYLES.text.stat}>
                          {user.followers_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    {/* Country */}
                    {user.country && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`${USER_PROFILE_STYLES.text.stat} uppercase`}>
                          {user.country}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={handleDashboard}
                className={`w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors ${USER_PROFILE_STYLES.button.base} focus:bg-white/10`}
              >
                <Music className="w-5 h-5 text-green-400" />
                <span className="font-medium">Dashboard</span>
              </button>
              
              <div className="h-px bg-white/10 my-2" />
              
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors ${USER_PROFILE_STYLES.button.base} focus:bg-red-500/10`}
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

export default UserProfile;
