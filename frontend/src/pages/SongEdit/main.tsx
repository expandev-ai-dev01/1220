import { useParams, useNavigate } from 'react-router-dom';
import { useSongDetail } from '@/domain/song/hooks/useSongDetail';
import { useSongUpdate } from '@/domain/song/hooks/useSongUpdate';
import { SongForm } from '@/domain/song/components/SongForm';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { UpdateSongDto } from '@/domain/song/types';
import type { SongEditPageProps } from './types';

/**
 * @page SongEditPage
 * @summary Page for editing existing songs with lyrics and chords
 * @domain song
 * @type form-page
 * @category song-management
 *
 * @routing
 * - Path: /songs/:id/edit
 * - Params: { id: string }
 * - Guards: Authentication required
 *
 * @layout
 * - Layout: RootLayout
 * - Sections: Header, Form
 *
 * @data
 * - Sources: Song API
 * - Mutations: Update song
 *
 * @userFlows
 * - Primary: Load existing song, edit form, and submit to update
 * - Success: Redirect to song detail
 * - Error: Display error message
 */
export const SongEditPage = (props: SongEditPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { songDetail, isLoading, error, refetch } = useSongDetail({
    songId: id!,
    onError: (err: Error) => {
      console.error('Error loading song for edit:', err);
    },
  });

  const { updateSong, isUpdating } = useSongUpdate({
    onSuccess: () => {
      navigate(`/songs/${id}`);
    },
    onError: (error: Error) => {
      alert(`Erro ao atualizar música: ${error.message}`);
    },
  });

  const handleSubmit = async (data: UpdateSongDto) => {
    try {
      await updateSong(id!, data);
    } catch (error: unknown) {
      console.error('Error updating song:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/songs/${id}`);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Música</h1>
        <p className="text-gray-600">Atualize as informações da música "{songDetail.title}"</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <SongForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isUpdating}
          initialData={{
            title: songDetail.title,
            artist: songDetail.artist,
            lyrics: songDetail.lyrics,
            originalKey: songDetail.originalKey,
            category: songDetail.category,
          }}
        />
      </div>
    </div>
  );
};

export default SongEditPage;
