import { Request, Response, NextFunction } from 'express';
import { transposeHandler } from './controller';
import * as songService from '@/services/song';

jest.mock('@/services/song');

describe('Song Transpose Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('transposeHandler', () => {
    it('should transpose song up by 2 semitones', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: 2 };

      const mockTransposedSong = {
        id: '1',
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: '    D        A\nVerse text here',
        originalKey: 'G',
        transposedKey: 'A',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
        formattedLyrics: [
          { type: 'chord', content: '    D        A' },
          { type: 'text', content: 'Verse text here' },
        ],
      };

      (songService.songTranspose as jest.Mock).mockResolvedValue(mockTransposedSong);

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTransposedSong,
      });
    });

    it('should transpose song down by 3 semitones', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: -3 };

      const mockTransposedSong = {
        id: '1',
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: '    A        E\nVerse text here',
        originalKey: 'G',
        transposedKey: 'E',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
        formattedLyrics: [
          { type: 'chord', content: '    A        E' },
          { type: 'text', content: 'Verse text here' },
        ],
      };

      (songService.songTranspose as jest.Mock).mockResolvedValue(mockTransposedSong);

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTransposedSong,
      });
    });

    it('should return 404 when song not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { semitones: 2 };

      (songService.songTranspose as jest.Mock).mockRejectedValue(new Error('Song not found'));

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for invalid semitones (too high)', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: 12 };

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for invalid semitones (too low)', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: -12 };

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 for non-integer semitones', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: 2.5 };

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { semitones: 2 };
      const error = new Error('Transpose error');
      (songService.songTranspose as jest.Mock).mockRejectedValue(error);

      await transposeHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
