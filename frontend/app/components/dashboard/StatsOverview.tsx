'use client';

import { TrendingUp, Users, Clock, Heart, PlayCircle, Music } from 'lucide-react';
import DashboardCard from './DashboardCard';

interface StatsOverviewProps {
  onCardClick?: (cardType: string) => void;
}

const StatsOverview = ({ onCardClick }: StatsOverviewProps) => {
  const handleCardClick = (cardType: string) => {
    if (onCardClick) {
      onCardClick(cardType);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Top Tracks */}
      <DashboardCard
        title="Top Tracks"
        description="Your most played songs"
        icon={TrendingUp}
        iconColor="text-green-400"
        iconBgColor="bg-green-500/20"
        onClick={() => handleCardClick('top-tracks')}
      >
        <p className="text-gray-300">Discover which tracks you&apos;ve been loving lately</p>
      </DashboardCard>

      {/* Top Artists */}
      <DashboardCard
        title="Top Artists"
        description="Your favorite musicians"
        icon={Users}
        iconColor="text-blue-400"
        iconBgColor="bg-blue-500/20"
        onClick={() => handleCardClick('top-artists')}
      >
        <p className="text-gray-300">See which artists dominate your playlists</p>
      </DashboardCard>

      {/* Recently Played */}
      <DashboardCard
        title="Recently Played"
        description="Your listening history"
        icon={Clock}
        iconColor="text-purple-400"
        iconBgColor="bg-purple-500/20"
        onClick={() => handleCardClick('recently-played')}
      >
        <p className="text-gray-300">Track your recent musical discoveries</p>
      </DashboardCard>

      {/* Music Taste */}
      <DashboardCard
        title="Music Taste"
        description="Your audio preferences"
        icon={Heart}
        iconColor="text-pink-400"
        iconBgColor="bg-pink-500/20"
        onClick={() => handleCardClick('music-taste')}
      >
        <p className="text-gray-300">Analyze your musical preferences and mood</p>
      </DashboardCard>

      {/* Playlists */}
      <DashboardCard
        title="Playlists"
        description="Your curated collections"
        icon={PlayCircle}
        iconColor="text-yellow-400"
        iconBgColor="bg-yellow-500/20"
        onClick={() => handleCardClick('playlists')}
      >
        <p className="text-gray-300">Explore your saved playlists and favorites</p>
      </DashboardCard>

      {/* Wrapped Summary */}
      <DashboardCard
        title="Your Wrapped"
        description="Complete music story"
        icon={Music}
        iconColor="text-green-400"
        iconBgColor="bg-green-500/30"
        gradient="from-green-500/20 to-blue-500/20"
        onClick={() => handleCardClick('wrapped-summary')}
      >
        <p className="text-gray-300">Get your comprehensive music summary</p>
      </DashboardCard>
    </div>
  );
};

export default StatsOverview;
