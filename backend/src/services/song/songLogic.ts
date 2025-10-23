/**
 * @summary
 * Business logic for song management (in-memory storage)
 *
 * @module services/song
 */

import {
  Song,
  SongCreateRequest,
  SongUpdateRequest,
  SongListResponse,
  SongDetailResponse,
  SongSearchParams,
  LyricLine,
  TransposedSong,
} from './songTypes';
import { transposeChord, detectOriginalKey } from './transposeLogic';

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
 * Gets detailed song view with formatted lyrics
 *
 * @function songGetDetail
 * @module services/song
 *
 * @param {string} id - Song identifier
 *
 * @returns {Promise<SongDetailResponse>} Song detail with formatted content
 *
 * @throws {Error} When song is not found
 *
 * @example
 * const songDetail = await songGetDetail('1');
 */
export async function songGetDetail(id: string): Promise<SongDetailResponse> {
  const song = songs.find((s) => s.id === id);
  if (!song) {
    throw new Error('Song not found');
  }

  /**
   * @rule {be-song-display-001} Parse lyrics into structured format
   * @description Lyrics are parsed line by line to identify chords and text
   */
  const formattedLyrics = parseLyrics(song.lyrics);

  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    lyrics: song.lyrics,
    originalKey: song.originalKey,
    category: song.category,
    dateCreated: song.dateCreated,
    dateModified: song.dateModified,
    formattedLyrics,
  };
}

/**
 * @summary
 * Parses lyrics text into structured format for display
 *
 * @function parseLyrics
 * @module services/song
 *
 * @param {string} lyrics - Raw lyrics text
 *
 * @returns {LyricLine[]} Structured lyric lines
 *
 * @example
 * const formatted = parseLyrics('    C        G\nVerse text here');
 */
function parseLyrics(lyrics: string): LyricLine[] {
  const lines = lyrics.split('\n');
  const result: LyricLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /**
     * @rule {be-chord-detection-001} Detect chord lines
     * @description Lines with only chords (letters, numbers, spaces) are chord lines
     */
    const isChordLine = /^[\s]*[A-G][#b]?[\w\/]*([\s]+[A-G][#b]?[\w\/]*)*[\s]*$/.test(line);

    if (isChordLine && line.trim().length > 0) {
      result.push({
        type: 'chord',
        content: line,
      });
    } else if (line.trim().length === 0) {
      result.push({
        type: 'empty',
        content: '',
      });
    } else {
      result.push({
        type: 'text',
        content: line,
      });
    }
  }

  return result;
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

/**
 * @summary
 * Searches songs by multiple criteria
 *
 * @function songSearch
 * @module services/song
 *
 * @param {SongSearchParams} params - Search parameters
 *
 * @returns {Promise<SongListResponse[]>} Array of matching songs
 *
 * @example
 * const results = await songSearch({ query: 'Amazing' });
 * const results = await songSearch({ artist: 'Newton', category: 'Hymn' });
 */
export async function songSearch(params: SongSearchParams): Promise<SongListResponse[]> {
  let filteredSongs = [...songs];

  /**
   * @rule {be-search-001} General query searches across title, artist, and lyrics
   * @description When query parameter is provided, search in multiple fields
   */
  if (params.query) {
    const queryLower = params.query.toLowerCase();
    filteredSongs = filteredSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(queryLower) ||
        song.artist.toLowerCase().includes(queryLower) ||
        song.lyrics.toLowerCase().includes(queryLower) ||
        (song.category && song.category.toLowerCase().includes(queryLower))
    );
  }

  /**
   * @rule {be-search-002} Specific field filters are case-insensitive partial matches
   * @description Each filter narrows down the results further
   */
  if (params.title) {
    const titleLower = params.title.toLowerCase();
    filteredSongs = filteredSongs.filter((song) => song.title.toLowerCase().includes(titleLower));
  }

  if (params.artist) {
    const artistLower = params.artist.toLowerCase();
    filteredSongs = filteredSongs.filter((song) => song.artist.toLowerCase().includes(artistLower));
  }

  if (params.category) {
    const categoryLower = params.category.toLowerCase();
    filteredSongs = filteredSongs.filter(
      (song) => song.category && song.category.toLowerCase().includes(categoryLower)
    );
  }

  if (params.lyrics) {
    const lyricsLower = params.lyrics.toLowerCase();
    filteredSongs = filteredSongs.filter((song) => song.lyrics.toLowerCase().includes(lyricsLower));
  }

  return filteredSongs.map((song) => ({
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
 * Transposes song chords to a different musical key
 *
 * @function songTranspose
 * @module services/song
 *
 * @param {string} id - Song identifier
 * @param {number} semitones - Number of semitones to transpose (-11 to 11)
 *
 * @returns {Promise<TransposedSong>} Transposed song with new chords
 *
 * @throws {Error} When song is not found
 * @throws {Error} When semitones is out of range
 *
 * @example
 * const transposed = await songTranspose('1', 2); // Transpose up 2 semitones
 * const transposed = await songTranspose('1', -3); // Transpose down 3 semitones
 */
export async function songTranspose(id: string, semitones: number): Promise<TransposedSong> {
  const song = songs.find((s) => s.id === id);
  if (!song) {
    throw new Error('Song not found');
  }

  if (semitones < -11 || semitones > 11) {
    throw new Error('Semitones must be between -11 and 11');
  }

  /**
   * @rule {be-transpose-001} Transpose all chords in lyrics
   * @description Parse lyrics, identify chord lines, and transpose each chord
   */
  const transposedLyrics = transposeLyrics(song.lyrics, semitones);

  /**
   * @rule {be-transpose-002} Calculate new key from original key
   * @description If original key is known, calculate the transposed key
   */
  let transposedKey: string | null = null;
  if (song.originalKey) {
    transposedKey = transposeChord(song.originalKey, semitones);
  } else {
    // Try to detect key from first chord in lyrics
    const detectedKey = detectOriginalKey(song.lyrics);
    if (detectedKey) {
      transposedKey = transposeChord(detectedKey, semitones);
    }
  }

  const formattedLyrics = parseLyrics(transposedLyrics);

  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    lyrics: transposedLyrics,
    originalKey: song.originalKey,
    transposedKey,
    category: song.category,
    dateCreated: song.dateCreated,
    dateModified: song.dateModified,
    formattedLyrics,
  };
}

/**
 * @summary
 * Transposes all chords in lyrics text
 *
 * @function transposeLyrics
 * @module services/song
 *
 * @param {string} lyrics - Original lyrics with chords
 * @param {number} semitones - Number of semitones to transpose
 *
 * @returns {string} Lyrics with transposed chords
 *
 * @example
 * const transposed = transposeLyrics('    C        G\nVerse', 2);
 * // Returns: '    D        A\nVerse'
 */
function transposeLyrics(lyrics: string, semitones: number): string {
  const lines = lyrics.split('\n');
  const transposedLines: string[] = [];

  for (const line of lines) {
    /**
     * @rule {be-chord-detection-001} Detect chord lines
     * @description Lines with only chords are transposed
     */
    const isChordLine = /^[\s]*[A-G][#b]?[\w\/]*([\s]+[A-G][#b]?[\w\/]*)*[\s]*$/.test(line);

    if (isChordLine && line.trim().length > 0) {
      transposedLines.push(transposeChordLine(line, semitones));
    } else {
      transposedLines.push(line);
    }
  }

  return transposedLines.join('\n');
}

/**
 * @summary
 * Transposes all chords in a single line
 *
 * @function transposeChordLine
 * @module services/song
 *
 * @param {string} line - Line containing chords
 * @param {number} semitones - Number of semitones to transpose
 *
 * @returns {string} Line with transposed chords
 *
 * @example
 * const transposed = transposeChordLine('    C        G', 2);
 * // Returns: '    D        A'
 */
function transposeChordLine(line: string, semitones: number): string {
  /**
   * @rule {be-chord-parsing-001} Parse individual chords from line
   * @description Match chord patterns and preserve spacing
   */
  const chordRegex = /[A-G][#b]?[\w\/]*/g;
  let result = line;
  const matches = Array.from(line.matchAll(new RegExp(chordRegex, 'g')));

  // Process matches in reverse to maintain string positions
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const originalChord = match[0];
    const transposedChord = transposeChord(originalChord, semitones);
    const startIndex = match.index!;
    const endIndex = startIndex + originalChord.length;

    result = result.substring(0, startIndex) + transposedChord + result.substring(endIndex);
  }

  return result;
}
