'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { spotifyService, Artist, TimeRange } from '../../services/spotifyService';

interface TopArtistsProps {
  limit?: number;
  showTimeRangeSelector?: boolean;
  className?: string;
}

const TopArtists = ({ 
  limit = 20, 
  showTimeRangeSelector = true,
  className = '' 
}: TopArtistsProps) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  const timeRangeOptions = [
    { value: 'short_term' as TimeRange, label: 'Last 4 weeks' },
    { value: 'medium_term' as TimeRange, label: 'Last 6 months' },
    { value: 'long_term' as TimeRange, label: 'All time' },
  ];

  const fetchTopArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await spotifyService.getTopArtists(timeRange, limit);
      setArtists(response.data.items);
    } catch (err: unknown) {
      console.error('Error fetching top artists:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to load top artists'
        : 'Failed to load top artists';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [timeRange, limit]);

  useEffect(() => {
    fetchTopArtists();
  }, [fetchTopArtists]);

  const handleArtistClick = (artist: Artist) => {
    if (artist.external_urls?.spotify) {
      window.open(artist.external_urls.spotify, '_blank');
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Top Artists</h3>
              <p className="text-slate-400 text-sm">Loading your favorites...</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/30 to-slate-700/20 backdrop-blur-sm border border-slate-700/30 animate-pulse">
              <div className="w-6 text-center">
                <div className="w-4 h-4 bg-slate-600/50 rounded"></div>
              </div>
              <div className="w-14 h-14 bg-slate-600/50 rounded-full"></div>
              <div className="flex-1">
                <div className="w-36 h-4 bg-slate-600/50 rounded mb-2"></div>
                <div className="w-28 h-3 bg-slate-600/50 rounded"></div>
              </div>
              <div className="w-16 h-8 bg-slate-600/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-500/20">
            <Users className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Something went wrong</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">{error}</p>
          <button
            onClick={fetchTopArtists}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Top Artists</h3>
            <p className="text-slate-400 text-sm">{artists.length} artists</p>
          </div>
        </div>
        
        {showTimeRangeSelector && (
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-200"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Artist List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {artists.map((artist, index) => (
          <div
            key={artist.id}
            onClick={() => handleArtistClick(artist)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-800/20 to-slate-700/10 hover:from-slate-700/30 hover:to-slate-600/20 backdrop-blur-sm border border-slate-700/20 hover:border-slate-600/40 transition-all duration-300 cursor-pointer group"
          >
            {/* Ranking */}
            <div className="w-6 text-center flex-shrink-0">
              <span className="text-slate-400 text-sm font-semibold group-hover:text-blue-400 transition-colors">
                {index + 1}
              </span>
            </div>

            {/* Artist Image */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-700/50 flex-shrink-0 shadow-lg">
              {artist.images.length > 0 ? (
                <Image
                  src={spotifyService.getBestImageUrl(artist.images, 'small') || ''}
                  alt={artist.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-500" />
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors duration-200 text-base">
                {artist.name}
              </h4>
              <div className="flex items-center gap-3 text-slate-400 text-sm group-hover:text-slate-300 transition-colors">
                <span className="font-mono">{spotifyService.formatNumber(artist.followers.total)} followers</span>
                <span>•</span>
                <span className="font-mono">{artist.popularity}% popularity</span>
              </div>
            </div>

            {/* Genres */}
            <div className="hidden lg:block text-right text-sm text-slate-400 flex-shrink-0 max-w-40">
              <div className="truncate font-medium">
                {artist.genres.slice(0, 2).join(', ')}
                {artist.genres.length > 2 && '...'}
              </div>
              {artist.genres.length > 0 && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {artist.genres.length} genre{artist.genres.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* External Link */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-blue-400" />
            </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-500/20 to-slate-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-slate-500/20">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">No artists yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Start listening to music to see your top artists appear here!</p>
        </div>
      )}
    </div>
  );
};

export default TopArtists;
