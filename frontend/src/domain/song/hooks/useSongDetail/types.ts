import type { SongDetail } from '../../types';

export interface UseSongDetailOptions {
  songId: string;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export interface UseSongDetailReturn {
  songDetail: SongDetail | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
