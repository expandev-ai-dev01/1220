import { Button } from '@/core/components/Button';
import { TransposeControl } from '../TransposeControl';
import type { SongViewerProps } from './types';

/**
 * @component SongViewer
 * @summary Displays song with formatted lyrics and chords for reading and performance
 * @domain song
 * @type domain-component
 * @category display
 *
 * @props
 * @param {SongDetail} props.songDetail - Song detail with formatted content
 * @param {Function} props.onTranspose - Transpose handler
 * @param {Function} props.onEdit - Edit button handler
 * @param {Function} props.onBack - Back button handler
 * @param {boolean} props.isTransposing - Transposing loading state
 *
 * @styling
 * - Responsive: Mobile-first design with larger text for readability
 * - Typography: Monospace font for chord alignment
 * - Layout: Centered content with clear visual hierarchy
 *
 * @accessibility
 * - ARIA: Semantic HTML with proper heading structure
 * - Keyboard: All interactive elements keyboard accessible
 * - Screen Reader: Clear content structure and labels
 *
 * @examples
 * ```tsx
 * <SongViewer
 *   songDetail={songDetail}
 *   onTranspose={handleTranspose}
 *   onEdit={() => navigate(`/songs/${id}/edit`)}
 *   onBack={() => navigate('/songs')}
 *   isTransposing={isLoading}
 * />
 * ```
 */
export const SongViewer = ({
  songDetail,
  onTranspose,
  onEdit,
  onBack,
  isTransposing = false,
}: SongViewerProps) => {
  const renderLyricsLine = (line: any, index: number) => {
    if (line.type === 'empty') {
      return <div key={index} className="h-4" />;
    }

    if (line.type === 'chord') {
      return (
        <div key={index} className="text-blue-600 font-bold font-mono text-sm md:text-base">
          {line.content}
        </div>
      );
    }

    return (
      <div key={index} className="text-gray-900 font-mono text-sm md:text-base">
        {line.content}
      </div>
    );
  };

  const displayKey = songDetail.transposedKey || songDetail.originalKey;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{songDetail.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{songDetail.artist}</p>
            <div className="flex flex-wrap gap-2">
              {displayKey && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  Tom: {displayKey}
                  {songDetail.transposedKey &&
                    songDetail.transposedKey !== songDetail.originalKey && (
                      <span className="ml-1 text-xs">(transposto de {songDetail.originalKey})</span>
                    )}
                </span>
              )}
              {songDetail.category && (
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded">
                  {songDetail.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
            <div className="whitespace-pre-wrap">
              {songDetail.formattedLyrics?.map((line, index) => renderLyricsLine(line, index))}
            </div>
          </div>
        </div>
      </div>

      {onTranspose && (
        <TransposeControl
          currentKey={displayKey}
          onTranspose={onTranspose}
          isTransposing={isTransposing}
        />
      )}

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="flex gap-2">
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              ← Voltar
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="primary" onClick={onEdit}>
              Editar Música
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
