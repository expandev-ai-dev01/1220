/**
 * @summary
 * Song service exports
 *
 * @module services/song
 */

export {
  songCreate,
  songList,
  songGet,
  songGetDetail,
  songUpdate,
  songDelete,
  songSearch,
  songTranspose,
} from './songLogic';
export { transposeChord, detectOriginalKey, calculateInterval } from './transposeLogic';
export type {
  Song,
  SongCreateRequest,
  SongUpdateRequest,
  SongListResponse,
  SongDetailResponse,
  SongSearchParams,
  LyricLine,
  TransposedSong,
} from './songTypes';
