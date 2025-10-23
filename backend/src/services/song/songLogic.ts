/**
 * @summary
 * Business logic for song management (in-memory storage)
 *
 * @module services/song
 */

import { Song, SongCreateRequest, SongUpdateRequest, SongListResponse } from './songTypes';

// In-memory storage
const songs: Song[] = [];
let nextId = 1;

/**
 * @summary
 * Creates a new song
 *
 * @function songCreate
 * @module services/song
 *
 * @param {SongCreateRequest} params - Song creation parameters
 *
 * @returns {Promise<Song>} Created song entity
 *
 * @throws {Error} When title or artist is missing
 *
 * @example
 * const song = await songCreate({
 *   title: 'Amazing Grace',
 *   artist: 'John Newton',
 *   lyrics: 'Amazing grace...',
 *   originalKey: 'G',
 *   category: 'Hymn'
 * });
 */
export async function songCreate(params: SongCreateRequest): Promise<Song> {
  if (!params.title || !params.artist) {
    throw new Error('Title and artist are required');
  }

  const now = new Date();
  const newSong: Song = {
    id: String(nextId++),
    title: params.title,
    artist: params.artist,
    lyrics: params.lyrics,
    originalKey: params.originalKey || null,
    category: params.category || null,
    dateCreated: now,
    dateModified: now,
  };

  songs.push(newSong);
  return newSong;
}

/**
 * @summary
 * Lists all songs
 *
 * @function songList
 * @module services/song
 *
 * @returns {Promise<SongListResponse[]>} Array of songs
 *
 * @example
 * const allSongs = await songList();
 */
export async function songList(): Promise<SongListResponse[]> {
  return songs.map((song) => ({
    id: song.id,
    title: song.title,
    artist: song.artist,
    originalKey: song.originalKey,
    category: song.category,
    dateCreated: song.dateCreated,
  }));
}

/**
 * @summary
 * Gets a specific song by ID
 *
 * @function songGet
 * @module services/song
 *
 * @param {string} id - Song identifier
 *
 * @returns {Promise<Song>} Song entity
 *
 * @throws {Error} When song is not found
 *
 * @example
 * const song = await songGet('1');
 */
export async function songGet(id: string): Promise<Song> {
  const song = songs.find((s) => s.id === id);
  if (!song) {
    throw new Error('Song not found');
  }
  return song;
}

/**
 * @summary
 * Updates an existing song
 *
 * @function songUpdate
 * @module services/song
 *
 * @param {SongUpdateRequest} params - Song update parameters
 *
 * @returns {Promise<Song>} Updated song entity
 *
 * @throws {Error} When song is not found
 *
 * @example
 * const updatedSong = await songUpdate({
 *   id: '1',
 *   title: 'Amazing Grace (Updated)',
 *   originalKey: 'D'
 * });
 */
export async function songUpdate(params: SongUpdateRequest): Promise<Song> {
  const song = songs.find((s) => s.id === params.id);
  if (!song) {
    throw new Error('Song not found');
  }

  if (params.title !== undefined) song.title = params.title;
  if (params.artist !== undefined) song.artist = params.artist;
  if (params.lyrics !== undefined) song.lyrics = params.lyrics;
  if (params.originalKey !== undefined) song.originalKey = params.originalKey;
  if (params.category !== undefined) song.category = params.category;
  song.dateModified = new Date();

  return song;
}

/**
 * @summary
 * Deletes a song
 *
 * @function songDelete
 * @module services/song
 *
 * @param {string} id - Song identifier
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When song is not found
 *
 * @example
 * await songDelete('1');
 */
export async function songDelete(id: string): Promise<void> {
  const index = songs.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error('Song not found');
  }
  songs.splice(index, 1);
}
