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
