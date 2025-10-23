import { useMutation, useQueryClient } from '@tanstack/react-query';
import { songService } from '../../services/songService';
import type { UseSongTransposeOptions, UseSongTransposeReturn } from './types';

/**
 * @hook useSongTranspose
 * @summary Handles song chord transposition to different musical keys
 * @domain song
 * @type domain-hook
 * @category mutation
 *
 * @dependencies
 * - @tanstack/react-query: Mutation management
 * - songService: API integration
 *
 * @parameters
 * @param {UseSongTransposeOptions} options - Hook configuration
 * @param {string} options.songId - ID of the song to transpose
 * @param {Function} options.onSuccess - Success callback with transposed song
 * @param {Function} options.onError - Error callback
 *
 * @returns {UseSongTransposeReturn} Hook return object
 * @returns {Function} returns.transposeSong - Function to transpose song by semitones
 * @returns {boolean} returns.isTransposing - Transposing state
 * @returns {Error} returns.error - Error state
 * @returns {SongDetail} returns.transposedSong - Transposed song result
 *
 * @sideEffects
 * - Updates query cache with transposed song data
 * - Invalidates song detail queries
 *
 * @examples
 * ```tsx
 * const { transposeSong, isTransposing } = useSongTranspose({
 *   songId: '123',
 *   onSuccess: (song) => console.log('Transposed to:', song.transposedKey)
 * });
 *
 * // Transpose up 2 semitones
 * await transposeSong(2);
 * ```
 */
export const useSongTranspose = (options: UseSongTransposeOptions): UseSongTransposeReturn => {
  const { songId, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (semitones: number) => songService.transpose(songId, semitones),
    onSuccess: (data) => {
      queryClient.setQueryData(['song-detail', songId], data);
      queryClient.invalidateQueries({ queryKey: ['song-detail', songId] });
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    transposeSong: mutation.mutateAsync,
    isTransposing: mutation.isPending,
    error: mutation.error as Error | null,
    transposedSong: mutation.data,
  };
};
