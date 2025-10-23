import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongSearchOptions, UseSongSearchReturn } from './types';
import type { SongSearchParams, Song } from '../../types';

/**
 * @hook useSongSearch
 * @summary Handles song search with multiple filter options
 * @domain song
 * @type domain-hook
 * @category data
 *
 * @dependencies
 * - @tanstack/react-query: Query management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongSearchOptions} options - Hook configuration
 * @param {SongSearchParams} options.filters - Initial search filters
 * @param {boolean} options.enabled - Whether query should run automatically
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 *
 * @returns {UseSongSearchReturn} Hook return object
 * @returns {Song[]} returns.songs - Search results
 * @returns {boolean} returns.isSearching - Searching state
 * @returns {Error} returns.error - Error state
 * @returns {Function} returns.search - Function to perform search
 * @returns {Function} returns.clearSearch - Function to clear search results
 *
 * @examples
 * ```tsx
 * const { songs, isSearching, search, clearSearch } = useSongSearch({
 *   onSuccess: (results) => console.log('Found:', results.length)
 * });
 *
 * // Search by title
 * search({ title: 'Amazing' });
 *
 * // Search by multiple criteria
 * search({ artist: 'Newton', category: 'Hymn' });
 *
 * // Clear search
 * clearSearch();
 * ```
 */
export const useSongSearch = (options: UseSongSearchOptions = {}): UseSongSearchReturn => {
  const { filters: initialFilters, enabled = false, onSuccess, onError } = options;
  const [searchFilters, setSearchFilters] = useState<SongSearchParams | undefined>(initialFilters);

  const { data, isLoading, error } = useQuery({
    queryKey: ['song-search', searchFilters],
    queryFn: () => songService.search(searchFilters!),
    enabled: enabled && !!searchFilters && Object.keys(searchFilters).length > 0,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (data && onSuccess) {
      onSuccess(data);
    }
  }, [data, onSuccess]);

  useEffect(() => {
    if (error && onError) {
      onError(error as Error);
    }
  }, [error, onError]);

  const search = (filters: SongSearchParams) => {
    setSearchFilters(filters);
  };

  const clearSearch = () => {
    setSearchFilters(undefined);
  };

  return {
    songs: data,
    isSearching: isLoading,
    error: error as Error | null,
    search,
    clearSearch,
  };
};
