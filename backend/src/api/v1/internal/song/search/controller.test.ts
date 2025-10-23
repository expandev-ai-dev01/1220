import { Request, Response, NextFunction } from 'express';
import { searchHandler } from './controller';
import * as songService from '@/services/song';

jest.mock('@/services/song');

describe('Song Search Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      query: {},
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('searchHandler', () => {
    it('should search songs by general query', async () => {
      mockRequest.query = { query: 'Amazing' };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResults,
      });
    });

    it('should search songs by title', async () => {
      mockRequest.query = { title: 'Grace' };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(songService.songSearch).toHaveBeenCalledWith({ title: 'Grace' });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockResults,
      });
    });

    it('should search songs by artist', async () => {
      mockRequest.query = { artist: 'Newton' };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(songService.songSearch).toHaveBeenCalledWith({ artist: 'Newton' });
    });

    it('should search songs by category', async () => {
      mockRequest.query = { category: 'Hymn' };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(songService.songSearch).toHaveBeenCalledWith({ category: 'Hymn' });
    });

    it('should search songs by lyrics content', async () => {
      mockRequest.query = { lyrics: 'sweet sound' };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(songService.songSearch).toHaveBeenCalledWith({ lyrics: 'sweet sound' });
    });

    it('should search with multiple filters', async () => {
      mockRequest.query = {
        artist: 'Newton',
        category: 'Hymn',
      };

      const mockResults = [
        {
          id: '1',
          title: 'Amazing Grace',
          artist: 'John Newton',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songSearch as jest.Mock).mockResolvedValue(mockResults);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(songService.songSearch).toHaveBeenCalledWith({
        artist: 'Newton',
        category: 'Hymn',
      });
    });

    it('should return empty array when no matches found', async () => {
      mockRequest.query = { query: 'nonexistent' };

      (songService.songSearch as jest.Mock).mockResolvedValue([]);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });

    it('should return 400 for invalid search parameters', async () => {
      mockRequest.query = {
        title: 'a'.repeat(201),
      };

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      mockRequest.query = { query: 'test' };
      const error = new Error('Database error');
      (songService.songSearch as jest.Mock).mockRejectedValue(error);

      await searchHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
