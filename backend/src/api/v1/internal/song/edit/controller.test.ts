import { Request, Response, NextFunction } from 'express';
import { editHandler } from './controller';
import * as songService from '@/services/song';

jest.mock('@/services/song');

describe('Song Edit Controller', () => {
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

  describe('editHandler', () => {
    it('should edit a song successfully', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'Updated Song Title',
        lyrics: 'Updated lyrics with chords',
      };

      const mockUpdatedSong = {
        id: '1',
        title: 'Updated Song Title',
        artist: 'Original Artist',
        lyrics: 'Updated lyrics with chords',
        originalKey: 'G',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      (songService.songUpdate as jest.Mock).mockResolvedValue(mockUpdatedSong);

      await editHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedSong,
      });
    });

    it('should return 404 when song not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = {
        title: 'Updated Title',
      };

      (songService.songUpdate as jest.Mock).mockRejectedValue(new Error('Song not found'));

      await editHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for validation errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'a'.repeat(201),
      };

      await editHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should allow partial updates', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        originalKey: 'D',
      };

      const mockUpdatedSong = {
        id: '1',
        title: 'Original Title',
        artist: 'Original Artist',
        lyrics: 'Original lyrics',
        originalKey: 'D',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      (songService.songUpdate as jest.Mock).mockResolvedValue(mockUpdatedSong);

      await editHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedSong,
      });
    });
  });
});
