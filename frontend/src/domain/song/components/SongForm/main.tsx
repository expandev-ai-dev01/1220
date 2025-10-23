import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/Button';
import type { SongFormProps, SongFormData } from './types';

const songFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  artist: z.string().min(1, 'Artista é obrigatório').max(100, 'Nome do artista muito longo'),
  lyrics: z.string().min(1, 'Letra é obrigatória').max(5000, 'Letra muito longa'),
  originalKey: z.string().max(10, 'Tom muito longo').optional(),
  category: z.string().max(50, 'Categoria muito longa').optional(),
});

/**
 * @component SongForm
 * @summary Form for creating and editing songs with validation
 * @domain song
 * @type domain-component
 * @category form
 *
 * @props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onCancel - Cancel button handler
 * @param {boolean} props.isSubmitting - Submission loading state
 * @param {Partial<CreateSongDto>} props.initialData - Initial form values
 *
 * @examples
 * ```tsx
 * <SongForm
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   isSubmitting={isCreating}
 * />
 * ```
 */
export const SongForm = ({ onSubmit, onCancel, isSubmitting, initialData }: SongFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SongFormData>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      artist: initialData?.artist || '',
      lyrics: initialData?.lyrics || '',
      originalKey: initialData?.originalKey || '',
      category: initialData?.category || '',
    },
  });

  const handleFormSubmit = (data: SongFormData) => {
    onSubmit({
      title: data.title,
      artist: data.artist,
      lyrics: data.lyrics,
      originalKey: data.originalKey || null,
      category: data.category || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nome da música"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
          Artista *
        </label>
        <input
          id="artist"
          type="text"
          {...register('artist')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nome do artista ou banda"
        />
        {errors.artist && <p className="mt-1 text-sm text-red-600">{errors.artist.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="originalKey" className="block text-sm font-medium text-gray-700 mb-1">
            Tom Original
          </label>
          <input
            id="originalKey"
            type="text"
            {...register('originalKey')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: C, G, Am"
          />
          {errors.originalKey && (
            <p className="mt-1 text-sm text-red-600">{errors.originalKey.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <input
            id="category"
            type="text"
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Gospel, Louvor, Adoração"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-1">
          Letra com Cifras *
        </label>
        <textarea
          id="lyrics"
          {...register('lyrics')}
          rows={12}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Digite a letra da música com as cifras acima das palavras&#10;&#10;Exemplo:&#10;    C        G&#10;Verso 1 aqui&#10;    Am       F&#10;Verso 2 aqui"
        />
        {errors.lyrics && <p className="mt-1 text-sm text-red-600">{errors.lyrics.message}</p>}
        <p className="mt-1 text-sm text-gray-500">
          Dica: Coloque as cifras na linha acima da palavra correspondente
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Música'}
        </Button>
      </div>
    </form>
  );
};
