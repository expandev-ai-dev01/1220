import type { SongDetail } from '../../types';

export interface UseSongTransposeOptions {
  songId: string;
  onSuccess?: (transposedSong: SongDetail) => void;
  onError?: (error: Error) => void;
}

export interface UseSongTransposeReturn {
  transposeSong: (semitones: number) => Promise<SongDetail>;
  isTransposing: boolean;
  error: Error | null;
  transposedSong: SongDetail | undefined;
}
