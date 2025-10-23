import { Request, Response, NextFunction } from 'express';
import { listHandler, createHandler, getHandler, updateHandler, deleteHandler } from './controller';
import * as songService from '@/services/song';

jest.mock('@/services/song');

describe('Song Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('listHandler', () => {
    it('should return list of songs', async () => {
      const mockSongs = [
        {
          id: '1',
          title: 'Test Song',
          artist: 'Test Artist',
          originalKey: 'G',
          category: 'Hymn',
          dateCreated: new Date(),
        },
      ];

      (songService.songList as jest.Mock).mockResolvedValue(mockSongs);

      await listHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSongs,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (songService.songList as jest.Mock).mockRejectedValue(error);

      await listHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createHandler', () => {
    it('should create a new song', async () => {
      mockRequest.body = {
        title: 'New Song',
        artist: 'New Artist',
        lyrics: 'Test lyrics',
        originalKey: 'C',
        category: 'Gospel',
      };

      const mockCreatedSong = {
        id: '1',
        ...mockRequest.body,
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      (songService.songCreate as jest.Mock).mockResolvedValue(mockCreatedSong);

      await createHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCreatedSong,
      });
    });

    it('should return 400 for validation errors', async () => {
      mockRequest.body = {
        title: '',
        artist: 'Artist',
      };

      await createHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getHandler', () => {
    it('should return a specific song', async () => {
      mockRequest.params = { id: '1' };

      const mockSong = {
        id: '1',
        title: 'Test Song',
        artist: 'Test Artist',
        lyrics: 'Test lyrics',
        originalKey: 'G',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      (songService.songGet as jest.Mock).mockResolvedValue(mockSong);

      await getHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSong,
      });
    });

    it('should return 404 when song not found', async () => {
      mockRequest.params = { id: '999' };

      (songService.songGet as jest.Mock).mockRejectedValue(new Error('Song not found'));

      await getHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateHandler', () => {
    it('should update a song', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'Updated Song',
      };

      const mockUpdatedSong = {
        id: '1',
        title: 'Updated Song',
        artist: 'Test Artist',
        lyrics: 'Test lyrics',
        originalKey: 'G',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
      };

      (songService.songUpdate as jest.Mock).mockResolvedValue(mockUpdatedSong);

      await updateHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedSong,
      });
    });
  });

  describe('deleteHandler', () => {
    it('should delete a song', async () => {
      mockRequest.params = { id: '1' };

      (songService.songDelete as jest.Mock).mockResolvedValue(undefined);

      await deleteHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 404 when song not found', async () => {
      mockRequest.params = { id: '999' };

      (songService.songDelete as jest.Mock).mockRejectedValue(new Error('Song not found'));

      await deleteHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
