export const ROUTES = {
  HOME: '/',
  SONGS: '/songs',
  SONG_CREATE: '/songs/new',
  SONG_DETAIL: (id: string) => `/songs/${id}`,
  NOT_FOUND: '*',
} as const;
