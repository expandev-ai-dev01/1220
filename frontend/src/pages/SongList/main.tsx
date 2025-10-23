import { useNavigate } from 'react-router-dom';
import { useSongList } from '@/domain/song/hooks/useSongList';
import { Button } from '@/core/components/Button';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { SongListPageProps } from './types';

/**
 * @page SongListPage
 * @summary Page displaying list of all songs in the catalog
 * @domain song
 * @type list-page
 * @category song-management
 *
 * @routing
 * - Path: /songs
 * - Guards: Authentication required
 *
 * @layout
 * - Layout: RootLayout
 * - Sections: Header, List
 *
 * @data
 * - Sources: Song API
 * - Loading: Skeleton loading states
 * - Caching: 2 minutes stale time
 */
export const SongListPage = (props: SongListPageProps) => {
  const navigate = useNavigate();
  const { songs, isLoading, error, refetch } = useSongList();

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar músicas"
        message={error.message}
        onRetry={refetch}
        onBack={() => navigate('/')}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Músicas</h1>
          <p className="text-gray-600">
            {songs?.length || 0} {songs?.length === 1 ? 'música cadastrada' : 'músicas cadastradas'}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/songs/new')}>
          + Nova Música
        </Button>
      </div>

      {!songs || songs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="h-24 w-24 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma música cadastrada ainda
          </h3>
          <p className="text-gray-600 mb-6">Comece adicionando sua primeira música ao catálogo</p>
          <Button variant="primary" onClick={() => navigate('/songs/new')}>
            Cadastrar Primeira Música
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/songs/${song.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{song.title}</h3>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
                {song.originalKey && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {song.originalKey}
                  </span>
                )}
              </div>

              {song.category && (
                <div className="mb-3">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {song.category}
                  </span>
                </div>
              )}

              <div className="text-sm text-gray-500 line-clamp-3 font-mono whitespace-pre-wrap">
                {song.lyrics}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongListPage;
