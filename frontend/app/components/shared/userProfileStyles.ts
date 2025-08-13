// Shared styling constants for user profile components
export const USER_PROFILE_STYLES = {
  avatar: {
    small: 'w-8 h-8 sm:w-10 sm:h-10',
    medium: 'w-12 h-12',
    large: 'w-14 h-14',
    xlarge: 'w-16 h-16'
  },
  dropdown: {
    backdrop: 'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm',
    menu: 'absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden',
    menuWide: 'w-72 sm:w-80'
  },
  button: {
    base: 'focus:outline-none transition-all duration-300',
    profile: 'flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-full hover:bg-black/30 focus:ring-2 focus:ring-green-500/50'
  },
  badge: {
    premium: 'absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1',
    premiumIcon: 'w-3 h-3 text-black fill-current'
  },
  text: {
    name: 'text-white font-semibold truncate',
    email: 'text-gray-400 text-sm truncate',
    stat: 'text-xs text-gray-400',
    statLabel: 'text-xs text-gray-500'
  }
} as const;

export const PREMIUM_CHECK = (product: string | undefined) => product === 'premium';
