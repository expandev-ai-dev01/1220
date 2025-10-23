import type { Song, UpdateSongDto } from '../../types';

export interface UseSongUpdateOptions {
  onSuccess?: (song: Song) => void;
  onError?: (error: Error) => void;
}

export interface UseSongUpdateReturn {
  updateSong: (id: string, data: UpdateSongDto) => Promise<Song>;
  isUpdating: boolean;
  error: Error | null;
}
