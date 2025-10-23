/**
 * @summary
 * Type definitions for song management
 *
 * @module services/song
 */

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

export interface SongCreateRequest {
  title: string;
  artist: string;
  lyrics: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface SongUpdateRequest {
  id: string;
  title?: string;
  artist?: string;
  lyrics?: string;
  originalKey?: string | null;
  category?: string | null;
}

export interface SongListResponse {
  id: string;
  title: string;
  artist: string;
  originalKey: string | null;
  category: string | null;
  dateCreated: Date;
}

export interface LyricLine {
  type: 'chord' | 'text' | 'empty';
  content: string;
}

export interface SongDetailResponse {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string | null;
  category: string | null;
  dateCreated: Date;
  dateModified: Date;
  formattedLyrics: LyricLine[];
}

export interface SongSearchParams {
  query?: string | null;
  title?: string | null;
  artist?: string | null;
  category?: string | null;
  lyrics?: string | null;
}

export interface TransposedSong {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string | null;
  transposedKey: string | null;
  category: string | null;
  dateCreated: Date;
  dateModified: Date;
  formattedLyrics: LyricLine[];
}
