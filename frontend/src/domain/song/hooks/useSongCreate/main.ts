import { useMutation, useQueryClient } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongCreateOptions, UseSongCreateReturn } from './types';

/**
 * @hook useSongCreate
 * @summary Handles song creation with optimistic updates
 * @domain song
 * @type domain-hook
 * @category mutation
 *
 * @dependencies
 * - @tanstack/react-query: Mutation management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongCreateOptions} options - Hook configuration
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 *
 * @returns {UseSongCreateReturn} Hook return object
 * @returns {Function} returns.createSong - Function to create song
 * @returns {boolean} returns.isCreating - Creating state
 * @returns {Error} returns.error - Error state
 */
export const useSongCreate = (options: UseSongCreateOptions = {}): UseSongCreateReturn => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: songService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    createSong: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error as Error | null,
  };
};
