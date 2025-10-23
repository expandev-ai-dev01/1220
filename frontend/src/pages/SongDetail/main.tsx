import { useParams, useNavigate } from 'react-router-dom';
import { useSongDetail } from '@/domain/song/hooks/useSongDetail';
import { useSongTranspose } from '@/domain/song/hooks/useSongTranspose';
import { SongViewer } from '@/domain/song/components/SongViewer';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { SongDetailPageProps } from './types';

/**
 * @page SongDetailPage
 * @summary Page displaying detailed view of a song with formatted lyrics, chords, and transpose functionality
 * @domain song
 * @type detail-page
 * @category song-management
 *
 * @routing
 * - Path: /songs/:id
 * - Params: { id: string }
 * - Guards: Authentication required
 *
 * @layout
 * - Layout: RootLayout
 * - Sections: Header, Content, Transpose Control, Actions
 *
 * @data
 * - Sources: Song Detail API, Transpose API
 * - Loading: Spinner loading state
 * - Caching: 5 minutes stale time
 *
 * @userFlows
 * - Primary: View song with formatted lyrics and chords
 * - Secondary: Transpose song to different key
 * - Tertiary: Navigate to edit or back to list
 * - Error: Display error message with retry option
 */
export const SongDetailPage = (props: SongDetailPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { songDetail, isLoading, error, refetch } = useSongDetail({
    songId: id!,
    onError: (err: Error) => {
      console.error('Error loading song detail:', err);
    },
  });

  const { transposeSong, isTransposing } = useSongTranspose({
    songId: id!,
    onSuccess: (transposedSong) => {
      console.log('Song transposed successfully to:', transposedSong.transposedKey);
    },
    onError: (err: Error) => {
      alert(`Erro ao transpor música: ${err.message}`);
    },
  });

  const handleTranspose = async (semitones: number) => {
    try {
      await transposeSong(semitones);
    } catch (error: unknown) {
      console.error('Error transposing song:', error);
    }
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar música"
        message={error.message}
        onRetry={refetch}
        onBack={() => navigate('/songs')}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="large" />;
  }

  if (!songDetail) {
    return (
      <ErrorMessage
        title="Música não encontrada"
        message="A música solicitada não foi encontrada no catálogo."
        onBack={() => navigate('/songs')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SongViewer
        songDetail={songDetail}
        onTranspose={handleTranspose}
        onEdit={() => navigate(`/songs/${id}/edit`)}
        onBack={() => navigate('/songs')}
        isTransposing={isTransposing}
      />
    </div>
  );
};

export default SongDetailPage;
