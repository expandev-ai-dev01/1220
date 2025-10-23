import { authenticatedClient } from '@/core/lib/api';
import type {
  Song,
  SongDetail,
  CreateSongDto,
  UpdateSongDto,
  SongListParams,
  SongSearchParams,
} from '../types';

/**
 * @service songService
 * @summary Song management service for authenticated endpoints
 * @domain song
 * @type rest-service
 * @apiContext internal
 *
 * @description
 * All methods in this service use authenticatedClient which targets:
 * /api/v1/internal/song/...
 *
 * Authentication token is automatically added by interceptor.
 */
export const songService = {
  /**
   * @endpoint GET /api/v1/internal/song
   * @summary Fetches list of songs with filters
   */
  async list(params?: SongListParams): Promise<Song[]> {
    const response = await authenticatedClient.get('/song', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/song/:id
   * @summary Fetches single song by ID
   */
  async getById(id: string): Promise<Song> {
    const response = await authenticatedClient.get(`/song/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/song/:id/detail
   * @summary Fetches detailed song view with formatted content for display
   */
  async getDetail(id: string): Promise<SongDetail> {
    const response = await authenticatedClient.get(`/song/${id}/detail`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/song
   * @summary Creates new song
   */
  async create(data: CreateSongDto): Promise<Song> {
    const response = await authenticatedClient.post('/song', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/song/:id
   * @summary Updates existing song
   */
  async update(id: string, data: UpdateSongDto): Promise<Song> {
    const response = await authenticatedClient.put(`/song/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/song/:id
   * @summary Deletes song
   */
  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/song/${id}`);
  },

  /**
   * @endpoint POST /api/v1/internal/song/:id/transpose
   * @summary Transposes song chords to a different musical key
   */
  async transpose(id: string, semitones: number): Promise<SongDetail> {
    const response = await authenticatedClient.post(`/song/${id}/transpose`, { semitones });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/song/search
   * @summary Searches songs by title, artist, category or lyrics content
   */
  async search(params: SongSearchParams): Promise<Song[]> {
    const response = await authenticatedClient.get('/song/search', { params });
    return response.data.data;
  },
};
