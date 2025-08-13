'use client';

import Image from 'next/image';
import { User, Crown } from 'lucide-react';
import { USER_PROFILE_STYLES, PREMIUM_CHECK } from './userProfileStyles';

interface UserAvatarProps {
  user: {
    avatar_url?: string;
    name: string;
    spotify_display_name?: string;
    product?: string;
  };
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showPremiumBadge?: boolean;
  className?: string;
}

const UserAvatar = ({ 
  user, 
  size = 'medium', 
  showPremiumBadge = true,
  className = '' 
}: UserAvatarProps) => {
  const isPremium = PREMIUM_CHECK(user.product);
  const sizeClass = USER_PROFILE_STYLES.avatar[size];
  
  // Calculate icon size based on avatar size
  const iconSizes = {
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-6 h-6',
    large: 'w-7 h-7',
    xlarge: 'w-8 h-8'
  };

  const badgeSizes = {
    small: 'w-3 h-3',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
    xlarge: 'w-4 h-4'
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.spotify_display_name || user.name}
          width={size === 'small' ? 32 : size === 'medium' ? 48 : size === 'large' ? 56 : 64}
          height={size === 'small' ? 32 : size === 'medium' ? 48 : size === 'large' ? 56 : 64}
          className={`${sizeClass} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClass} bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center`}>
          <User className={`${iconSizes[size]} text-black`} />
        </div>
      )}
      
      {/* Premium Badge */}
      {showPremiumBadge && isPremium && (
        <div className={USER_PROFILE_STYLES.badge.premium}>
          <Crown className={`${badgeSizes[size]} ${USER_PROFILE_STYLES.badge.premiumIcon}`} />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
