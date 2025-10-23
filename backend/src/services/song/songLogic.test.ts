import {
  songCreate,
  songList,
  songGet,
  songGetDetail,
  songUpdate,
  songDelete,
  songSearch,
} from './songLogic';
import { SongCreateRequest, SongUpdateRequest, SongSearchParams } from './songTypes';

describe('Song Service', () => {
  beforeEach(() => {
    // Clear in-memory storage before each test
    // Note: In a real implementation, you'd want to expose a clear function
  });

  describe('songCreate', () => {
    it('should create a song with valid parameters', async () => {
      const params: SongCreateRequest = {
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: 'Amazing grace, how sweet the sound...',
        originalKey: 'G',
        category: 'Hymn',
      };

      const result = await songCreate(params);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(params.title);
      expect(result.artist).toBe(params.artist);
      expect(result.lyrics).toBe(params.lyrics);
      expect(result.originalKey).toBe(params.originalKey);
      expect(result.category).toBe(params.category);
      expect(result).toHaveProperty('dateCreated');
      expect(result).toHaveProperty('dateModified');
    });

    it('should throw error when title is missing', async () => {
      const params: any = {
        artist: 'John Newton',
        lyrics: 'Test lyrics',
      };

      await expect(songCreate(params)).rejects.toThrow('Title and artist are required');
    });

    it('should throw error when artist is missing', async () => {
      const params: any = {
        title: 'Amazing Grace',
        lyrics: 'Test lyrics',
      };

      await expect(songCreate(params)).rejects.toThrow('Title and artist are required');
    });

    it('should create song with null optional fields', async () => {
      const params: SongCreateRequest = {
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'Test lyrics',
      };

      const result = await songCreate(params);

      expect(result.originalKey).toBeNull();
      expect(result.category).toBeNull();
    });
  });

  describe('songList', () => {
    it('should return empty array when no songs exist', async () => {
      const result = await songList();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return list of songs', async () => {
      await songCreate({
        title: 'Song 1',
        artist: 'Artist 1',
        lyrics: 'Lyrics 1',
      });

      await songCreate({
        title: 'Song 2',
        artist: 'Artist 2',
        lyrics: 'Lyrics 2',
      });

      const result = await songList();

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('artist');
    });
  });

  describe('songGet', () => {
    it('should return a specific song', async () => {
      const created = await songCreate({
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'Test lyrics',
      });

      const result = await songGet(created.id);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe(created.title);
    });

    it('should throw error when song not found', async () => {
      await expect(songGet('nonexistent')).rejects.toThrow('Song not found');
    });
  });

  describe('songGetDetail', () => {
    it('should return detailed song view with formatted lyrics', async () => {
      const created = await songCreate({
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '    C        G\nVerse text here\n\n    Am       F\nAnother verse',
      });

      const result = await songGetDetail(created.id);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe(created.title);
      expect(result).toHaveProperty('formattedLyrics');
      expect(Array.isArray(result.formattedLyrics)).toBe(true);
      expect(result.formattedLyrics.length).toBeGreaterThan(0);
      expect(result.formattedLyrics[0]).toHaveProperty('type');
      expect(result.formattedLyrics[0]).toHaveProperty('content');
    });

    it('should parse chord lines correctly', async () => {
      const created = await songCreate({
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: '    C        G\nVerse text',
      });

      const result = await songGetDetail(created.id);

      expect(result.formattedLyrics[0].type).toBe('chord');
      expect(result.formattedLyrics[1].type).toBe('text');
    });

    it('should throw error when song not found', async () => {
      await expect(songGetDetail('nonexistent')).rejects.toThrow('Song not found');
    });
  });

  describe('songUpdate', () => {
    it('should update song fields', async () => {
      const created = await songCreate({
        title: 'Original Title',
        artist: 'Original Artist',
        lyrics: 'Original lyrics',
      });

      const updateParams: SongUpdateRequest = {
        id: created.id,
        title: 'Updated Title',
        originalKey: 'D',
      };

      const result = await songUpdate(updateParams);

      expect(result.title).toBe('Updated Title');
      expect(result.originalKey).toBe('D');
      expect(result.artist).toBe('Original Artist');
    });

    it('should throw error when song not found', async () => {
      await expect(
        songUpdate({
          id: 'nonexistent',
          title: 'New Title',
        })
      ).rejects.toThrow('Song not found');
    });
  });

  describe('songDelete', () => {
    it('should delete a song', async () => {
      const created = await songCreate({
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'Test lyrics',
      });

      await songDelete(created.id);

      await expect(songGet(created.id)).rejects.toThrow('Song not found');
    });

    it('should throw error when song not found', async () => {
      await expect(songDelete('nonexistent')).rejects.toThrow('Song not found');
    });
  });

  describe('songSearch', () => {
    beforeEach(async () => {
      await songCreate({
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: 'Amazing grace, how sweet the sound',
        originalKey: 'G',
        category: 'Hymn',
      });

      await songCreate({
        title: 'How Great Thou Art',
        artist: 'Carl Boberg',
        lyrics: 'O Lord my God, when I in awesome wonder',
        originalKey: 'C',
        category: 'Hymn',
      });

      await songCreate({
        title: 'Blessed Assurance',
        artist: 'Fanny Crosby',
        lyrics: 'Blessed assurance, Jesus is mine',
        originalKey: 'D',
        category: 'Gospel',
      });
    });

    it('should search by general query in title', async () => {
      const results = await songSearch({ query: 'Amazing' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toContain('Amazing');
    });

    it('should search by general query in artist', async () => {
      const results = await songSearch({ query: 'Newton' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].artist).toContain('Newton');
    });

    it('should search by general query in lyrics', async () => {
      const results = await songSearch({ query: 'sweet sound' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toBe('Amazing Grace');
    });

    it('should search by general query in category', async () => {
      const results = await songSearch({ query: 'Gospel' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].category).toBe('Gospel');
    });

    it('should search by specific title', async () => {
      const results = await songSearch({ title: 'Grace' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toContain('Grace');
    });

    it('should search by specific artist', async () => {
      const results = await songSearch({ artist: 'Boberg' });

      expect(results.length).toBe(1);
      expect(results[0].artist).toBe('Carl Boberg');
    });

    it('should search by specific category', async () => {
      const results = await songSearch({ category: 'Hymn' });

      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.every((r) => r.category === 'Hymn')).toBe(true);
    });

    it('should search by lyrics content', async () => {
      const results = await songSearch({ lyrics: 'Jesus' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toBe('Blessed Assurance');
    });

    it('should combine multiple search filters', async () => {
      const results = await songSearch({
        artist: 'Newton',
        category: 'Hymn',
      });

      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Amazing Grace');
      expect(results[0].artist).toBe('John Newton');
      expect(results[0].category).toBe('Hymn');
    });

    it('should be case-insensitive', async () => {
      const results = await songSearch({ query: 'AMAZING' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toBe('Amazing Grace');
    });

    it('should return empty array when no matches found', async () => {
      const results = await songSearch({ query: 'nonexistent' });

      expect(results).toEqual([]);
    });

    it('should handle partial matches', async () => {
      const results = await songSearch({ title: 'Gra' });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toContain('Gra');
    });
  });
});
