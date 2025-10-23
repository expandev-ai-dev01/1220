import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongDetailOptions, UseSongDetailReturn } from './types';

/**
 * @hook useSongDetail
 * @summary Fetches detailed song view with formatted content for display
 * @domain song
 * @type domain-hook
 * @category data
 *
 * @dependencies
 * - @tanstack/react-query: Query management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongDetailOptions} options - Hook configuration
 * @param {string} options.songId - ID of the song to fetch
 * @param {boolean} options.enabled - Whether query should run automatically
 * @param {Function} options.onError - Error callback
 *
 * @returns {UseSongDetailReturn} Hook return object
 * @returns {SongDetail} returns.songDetail - Detailed song with formatted content
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Error} returns.error - Error state
 * @returns {Function} returns.refetch - Manual refetch function
 */
export const useSongDetail = (options: UseSongDetailOptions): UseSongDetailReturn => {
  const { songId, enabled = true, onError } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['song-detail', songId],
    queryFn: () => songService.getDetail(songId),
    enabled: enabled && !!songId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (error && onError) {
      onError(error as Error);
    }
  }, [error, onError]);

  return {
    songDetail: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
