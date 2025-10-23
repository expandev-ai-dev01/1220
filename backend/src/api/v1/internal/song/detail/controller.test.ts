import { Request, Response, NextFunction } from 'express';
import { getDetailHandler } from './controller';
import * as songService from '@/services/song';

jest.mock('@/services/song');

describe('Song Detail Controller', () => {
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

  describe('getDetailHandler', () => {
    it('should return detailed song view', async () => {
      mockRequest.params = { id: '1' };

      const mockSongDetail = {
        id: '1',
        title: 'Amazing Grace',
        artist: 'John Newton',
        lyrics: 'Amazing grace, how sweet the sound',
        originalKey: 'G',
        category: 'Hymn',
        dateCreated: new Date(),
        dateModified: new Date(),
        formattedLyrics: [{ type: 'text', content: 'Amazing grace, how sweet the sound' }],
      };

      (songService.songGetDetail as jest.Mock).mockResolvedValue(mockSongDetail);

      await getDetailHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSongDetail,
      });
    });

    it('should return 404 when song not found', async () => {
      mockRequest.params = { id: '999' };

      (songService.songGetDetail as jest.Mock).mockRejectedValue(new Error('Song not found'));

      await getDetailHandler(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
