import { useQuery } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongListOptions, UseSongListReturn } from './types';

/**
 * @hook useSongList
 * @summary Fetches and manages list of songs with caching
 * @domain song
 * @type domain-hook
 * @category data
 *
 * @dependencies
 * - @tanstack/react-query: Query management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongListOptions} options - Hook configuration
 * @param {SongListParams} options.filters - Optional filters for song list
 * @param {boolean} options.enabled - Whether query should run automatically
 *
 * @returns {UseSongListReturn} Hook return object
 * @returns {Song[]} returns.songs - List of songs
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Error} returns.error - Error state
 * @returns {Function} returns.refetch - Manual refetch function
 */
export const useSongList = (options: UseSongListOptions = {}): UseSongListReturn => {
  const { filters, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['songs', filters],
    queryFn: () => songService.list(filters),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    songs: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
