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
