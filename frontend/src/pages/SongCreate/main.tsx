import { useNavigate } from 'react-router-dom';
import { SongForm } from '@/domain/song/components/SongForm';
import { useSongCreate } from '@/domain/song/hooks/useSongCreate';
import type { CreateSongDto } from '@/domain/song/types';
import type { SongCreatePageProps } from './types';

/**
 * @page SongCreatePage
 * @summary Page for creating new songs with lyrics and chords
 * @domain song
 * @type form-page
 * @category song-management
 *
 * @routing
 * - Path: /songs/new
 * - Guards: Authentication required
 *
 * @layout
 * - Layout: RootLayout
 * - Sections: Header, Form
 *
 * @data
 * - Sources: Song API
 * - Mutations: Create song
 *
 * @userFlows
 * - Primary: Fill form and submit to create song
 * - Success: Redirect to song list
 * - Error: Display error message
 */
export const SongCreatePage = (props: SongCreatePageProps) => {
  const navigate = useNavigate();

  const { createSong, isCreating } = useSongCreate({
    onSuccess: () => {
      navigate('/songs');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar música: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CreateSongDto) => {
    try {
      await createSong(data);
    } catch (error: unknown) {
      console.error('Error creating song:', error);
    }
  };

  const handleCancel = () => {
    navigate('/songs');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Nova Música</h1>
        <p className="text-gray-600">
          Preencha os campos abaixo para adicionar uma nova música ao catálogo
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <SongForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
      </div>
    </div>
  );
};

export default SongCreatePage;
