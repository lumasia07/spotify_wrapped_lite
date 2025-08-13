import { apiClient } from './api';

export interface Track {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url?: string;
  duration_ms: number;
  popularity: number;
}

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
  followers: {
    total: number;
  };
  popularity: number;
}

export interface RecentlyPlayed {
  track: Track;
  played_at: string;
  context: {
    type: string;
    href: string;
  } | null;
}

export interface SpotifyResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next?: string;
  previous?: string;
}

export interface TopItemsResponse<T> {
  success: boolean;
  data: SpotifyResponse<T>;
  meta: {
    time_range: string;
    limit: number;
    offset: number;
  };
}

export interface RecentlyPlayedResponse {
  success: boolean;
  data: SpotifyResponse<RecentlyPlayed>;
  meta: {
    limit: number;
    after?: string;
    before?: string;
  };
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

class SpotifyService {
  /**
   * Get user's top tracks
   */
  async getTopTracks(
    timeRange: TimeRange = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopItemsResponse<Track>> {
    const response = await apiClient.get('/spotify/top-tracks', {
      params: {
        time_range: timeRange,
        limit,
        offset
      }
    });
    return response.data;
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(
    timeRange: TimeRange = 'medium_term',
    limit: number = 20,
    offset: number = 0
  ): Promise<TopItemsResponse<Artist>> {
    const response = await apiClient.get('/spotify/top-artists', {
      params: {
        time_range: timeRange,
        limit,
        offset
      }
    });
    return response.data;
  }

  /**
   * Get user's recently played tracks
   */
  async getRecentlyPlayed(
    limit: number = 50,
    after?: string,
    before?: string
  ): Promise<RecentlyPlayedResponse> {
    const response = await apiClient.get('/spotify/recently-played', {
      params: {
        limit,
        after,
        before
      }
    });
    return response.data;
  }

  /**
   * Get user's Spotify profile
   */
  async getProfile() {
    const response = await apiClient.get('/spotify/profile');
    return response.data;
  }

  /**
   * Format duration from milliseconds to mm:ss
   */
  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get the best image URL from Spotify images array
   */
  getBestImageUrl(images: Array<{ url: string; height: number; width: number }>, preferredSize: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!images || images.length === 0) return null;

    // Sort by size
    const sortedImages = [...images].sort((a, b) => (b.height || 0) - (a.height || 0));

    switch (preferredSize) {
      case 'small':
        return sortedImages[sortedImages.length - 1]?.url || sortedImages[0]?.url;
      case 'large':
        return sortedImages[0]?.url;
      case 'medium':
      default:
        const midIndex = Math.floor(sortedImages.length / 2);
        return sortedImages[midIndex]?.url || sortedImages[0]?.url;
    }
  }

  /**
   * Format number with commas
   */
  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}

export const spotifyService = new SpotifyService();
