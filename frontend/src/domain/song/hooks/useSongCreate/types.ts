import type { Song, CreateSongDto } from '../../types';

export interface UseSongCreateOptions {
  onSuccess?: (song: Song) => void;
  onError?: (error: Error) => void;
}

export interface UseSongCreateReturn {
  createSong: (data: CreateSongDto) => Promise<Song>;
  isCreating: boolean;
  error: Error | null;
}
