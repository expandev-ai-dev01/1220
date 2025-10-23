import { useMutation, useQueryClient } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongUpdateOptions, UseSongUpdateReturn } from './types';

/**
 * @hook useSongUpdate
 * @summary Handles song update with cache invalidation
 * @domain song
 * @type domain-hook
 * @category mutation
 *
 * @dependencies
 * - @tanstack/react-query: Mutation management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongUpdateOptions} options - Hook configuration
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 *
 * @returns {UseSongUpdateReturn} Hook return object
 * @returns {Function} returns.updateSong - Function to update song
 * @returns {boolean} returns.isUpdating - Updating state
 * @returns {Error} returns.error - Error state
 */
export const useSongUpdate = (options: UseSongUpdateOptions = {}): UseSongUpdateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => songService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      queryClient.invalidateQueries({ queryKey: ['song-detail', data.id] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    updateSong: (id: string, data: any) => mutation.mutateAsync({ id, data }),
    isUpdating: mutation.isPending,
    error: mutation.error as Error | null,
  };
};
