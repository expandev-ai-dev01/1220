import type { Song, SongListParams } from '../../types';

export interface UseSongListOptions {
  filters?: SongListParams;
  enabled?: boolean;
}

export interface UseSongListReturn {
  songs: Song[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
