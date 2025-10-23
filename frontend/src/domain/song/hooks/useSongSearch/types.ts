import type { Song, SongSearchParams } from '../../types';

export interface UseSongSearchOptions {
  filters?: SongSearchParams;
  enabled?: boolean;
  onSuccess?: (songs: Song[]) => void;
  onError?: (error: Error) => void;
}

export interface UseSongSearchReturn {
  songs: Song[] | undefined;
  isSearching: boolean;
  error: Error | null;
  search: (filters: SongSearchParams) => void;
  clearSearch: () => void;
}
