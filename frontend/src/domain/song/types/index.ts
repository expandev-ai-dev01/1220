export interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string | null;
  category: string | null;
  dateCreated: Date;
  dateModified: Date;
}

export interface SongDetail extends Song {
  formattedLyrics: FormattedLyricsLine[];
  transposedKey?: string;
}

export interface FormattedLyricsLine {
  type: 'chord' | 'text' | 'empty';
  content: string;
  chords?: string[];
}

export interface CreateSongDto {
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface UpdateSongDto {
  title?: string;
  artist?: string;
  lyrics?: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface SongListParams {
  search?: string;
  category?: string;
  artist?: string;
}

export interface SongSearchParams {
  query?: string;
  title?: string;
  artist?: string;
  category?: string;
  lyrics?: string;
}
