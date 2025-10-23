import { useState } from 'react';
import { Button } from '@/core/components/Button';
import type { SongSearchFormProps, SearchFormData } from './types';
import type { SongSearchParams } from '../../types';

/**
 * @component SongSearchForm
 * @summary Search form for filtering songs by multiple criteria
 * @domain song
 * @type domain-component
 * @category form
 *
 * @props
 * @param {Function} props.onSearch - Search handler with filters
 * @param {Function} props.onClear - Clear search handler
 * @param {boolean} props.isSearching - Searching loading state
 * @param {SongSearchParams} props.initialFilters - Initial filter values
 *
 * @styling
 * - Responsive: Mobile-first with stacked layout on small screens
 * - Interactive: Clear visual feedback for active filters
 * - Accessible: Proper labels and keyboard navigation
 *
 * @accessibility
 * - ARIA: Proper labels for all form fields
 * - Keyboard: Full keyboard navigation support
 * - Screen Reader: Clear descriptions of search options
 *
 * @examples
 * ```tsx
 * <SongSearchForm
 *   onSearch={handleSearch}
 *   onClear={handleClear}
 *   isSearching={isLoading}
 * />
 * ```
 */
export const SongSearchForm = ({
  onSearch,
  onClear,
  isSearching = false,
  initialFilters,
}: SongSearchFormProps) => {
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('simple');
  const [formData, setFormData] = useState<SearchFormData>({
    query: initialFilters?.query || '',
    title: initialFilters?.title || '',
    artist: initialFilters?.artist || '',
    category: initialFilters?.category || '',
    lyrics: initialFilters?.lyrics || '',
  });

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.query.trim()) {
      onSearch({ query: formData.query.trim() });
    }
  };

  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: SongSearchParams = {};

    if (formData.title.trim()) filters.title = formData.title.trim();
    if (formData.artist.trim()) filters.artist = formData.artist.trim();
    if (formData.category.trim()) filters.category = formData.category.trim();
    if (formData.lyrics.trim()) filters.lyrics = formData.lyrics.trim();

    if (Object.keys(filters).length > 0) {
      onSearch(filters);
    }
  };

  const handleClear = () => {
    setFormData({
      query: '',
      title: '',
      artist: '',
      category: '',
      lyrics: '',
    });
    onClear();
  };

  const hasActiveFilters =
    formData.query.trim() ||
    formData.title.trim() ||
    formData.artist.trim() ||
    formData.category.trim() ||
    formData.lyrics.trim();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Buscar Músicas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSearchMode('simple')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              searchMode === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Busca Simples
          </button>
          <button
            onClick={() => setSearchMode('advanced')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              searchMode === 'advanced'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Busca Avançada
          </button>
        </div>
      </div>

      {searchMode === 'simple' ? (
        <form onSubmit={handleSimpleSearch} className="space-y-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por título, artista, categoria ou letra
            </label>
            <div className="flex gap-2">
              <input
                id="query"
                type="text"
                value={formData.query}
                onChange={(e) => handleInputChange('query', e.target.value)}
                placeholder="Digite sua busca..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
              <Button type="submit" variant="primary" isLoading={isSearching}>
                Buscar
              </Button>
              {hasActiveFilters && (
                <Button type="button" variant="secondary" onClick={handleClear}>
                  Limpar
                </Button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              A busca será realizada em todos os campos da música
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAdvancedSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nome da música"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
            </div>

            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
                Artista
              </label>
              <input
                id="artist"
                type="text"
                value={formData.artist}
                onChange={(e) => handleInputChange('artist', e.target.value)}
                placeholder="Nome do artista ou banda"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Ex: Gospel, Louvor, Adoração"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
            </div>

            <div>
              <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo da Letra
              </label>
              <input
                id="lyrics"
                type="text"
                value={formData.lyrics}
                onChange={(e) => handleInputChange('lyrics', e.target.value)}
                placeholder="Palavras ou frases da letra"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSearching}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {hasActiveFilters && (
              <Button type="button" variant="secondary" onClick={handleClear}>
                Limpar Filtros
              </Button>
            )}
            <Button type="submit" variant="primary" isLoading={isSearching}>
              Buscar com Filtros
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Você pode combinar múltiplos filtros para refinar sua busca.
              Deixe em branco os campos que não deseja filtrar.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
