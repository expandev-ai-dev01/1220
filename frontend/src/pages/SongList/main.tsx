import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSongList } from '@/domain/song/hooks/useSongList';
import { useSongSearch } from '@/domain/song/hooks/useSongSearch';
import { SongSearchForm } from '@/domain/song/components/SongSearchForm';
import { Button } from '@/core/components/Button';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { SongSearchParams } from '@/domain/song/types';
import type { SongListPageProps } from './types';

/**
 * @page SongListPage
 * @summary Page displaying list of all songs with search functionality
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
 * - Sections: Header, Search Form, List
 *
 * @data
 * - Sources: Song API, Search API
 * - Loading: Skeleton loading states
 * - Caching: 2 minutes stale time
 *
 * @userFlows
 * - Primary: View all songs in catalog
 * - Secondary: Search songs by multiple criteria
 * - Tertiary: Navigate to song details or create new song
 */
export const SongListPage = (props: SongListPageProps) => {
  const navigate = useNavigate();
  const [isSearchMode, setIsSearchMode] = useState(false);

  const {
    songs: allSongs,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useSongList({
    enabled: !isSearchMode,
  });

  const {
    songs: searchResults,
    isSearching,
    error: searchError,
    search,
    clearSearch,
  } = useSongSearch({
    enabled: isSearchMode,
  });

  const handleSearch = (filters: SongSearchParams) => {
    setIsSearchMode(true);
    search(filters);
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    clearSearch();
  };

  const displaySongs = isSearchMode ? searchResults : allSongs;
  const isLoading = isSearchMode ? isSearching : isLoadingAll;
  const error = isSearchMode ? searchError : errorAll;

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar músicas"
        message={error.message}
        onRetry={isSearchMode ? () => {} : refetchAll}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Músicas</h1>
          <p className="text-gray-600">
            {isSearchMode
              ? `${displaySongs?.length || 0} resultado(s) encontrado(s)`
              : `${displaySongs?.length || 0} ${
                  displaySongs?.length === 1 ? 'música cadastrada' : 'músicas cadastradas'
                }`}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/songs/new')}>
          + Nova Música
        </Button>
      </div>

      <div className="mb-8">
        <SongSearchForm
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner size="large" />
      ) : !displaySongs || displaySongs.length === 0 ? (
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
            {isSearchMode ? 'Nenhuma música encontrada' : 'Nenhuma música cadastrada ainda'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isSearchMode
              ? 'Tente ajustar os filtros de busca ou limpar a pesquisa'
              : 'Comece adicionando sua primeira música ao catálogo'}
          </p>
          {isSearchMode ? (
            <Button variant="secondary" onClick={handleClearSearch}>
              Limpar Busca
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/songs/new')}>
              Cadastrar Primeira Música
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySongs.map((song) => (
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
