import { useState } from 'react';
import { Button } from '@/core/components/Button';
import type { TransposeControlProps } from './types';

const SEMITONE_OPTIONS = [
  { value: -11, label: '-11 (1 tom abaixo)' },
  { value: -10, label: '-10' },
  { value: -9, label: '-9' },
  { value: -8, label: '-8' },
  { value: -7, label: '-7' },
  { value: -6, label: '-6 (meio tom abaixo)' },
  { value: -5, label: '-5' },
  { value: -4, label: '-4' },
  { value: -3, label: '-3' },
  { value: -2, label: '-2' },
  { value: -1, label: '-1 (meio tom abaixo)' },
  { value: 0, label: 'Tom Original' },
  { value: 1, label: '+1 (meio tom acima)' },
  { value: 2, label: '+2' },
  { value: 3, label: '+3' },
  { value: 4, label: '+4' },
  { value: 5, label: '+5' },
  { value: 6, label: '+6 (meio tom acima)' },
  { value: 7, label: '+7' },
  { value: 8, label: '+8' },
  { value: 9, label: '+9' },
  { value: 10, label: '+10' },
  { value: 11, label: '+11 (1 tom acima)' },
];

/**
 * @component TransposeControl
 * @summary Control panel for transposing song chords to different keys
 * @domain song
 * @type domain-component
 * @category control
 *
 * @props
 * @param {string | null} props.currentKey - Current musical key of the song
 * @param {Function} props.onTranspose - Handler for transpose action
 * @param {boolean} props.isTransposing - Loading state during transpose
 * @param {boolean} props.disabled - Disable all controls
 *
 * @styling
 * - Responsive: Mobile-first with stacked layout on small screens
 * - Interactive: Clear visual feedback for selected transpose value
 * - Accessible: Proper labels and keyboard navigation
 *
 * @accessibility
 * - ARIA: Proper labels for all controls
 * - Keyboard: Full keyboard navigation support
 * - Screen Reader: Clear descriptions of transpose options
 *
 * @examples
 * ```tsx
 * <TransposeControl
 *   currentKey="G"
 *   onTranspose={handleTranspose}
 *   isTransposing={isLoading}
 * />
 * ```
 */
export const TransposeControl = ({
  currentKey,
  onTranspose,
  isTransposing = false,
  disabled = false,
}: TransposeControlProps) => {
  const [selectedSemitones, setSelectedSemitones] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuickTranspose = (semitones: number) => {
    setSelectedSemitones(semitones);
    onTranspose(semitones);
  };

  const handleCustomTranspose = () => {
    onTranspose(selectedSemitones);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Transposição de Tom</h3>
          {currentKey && (
            <p className="text-sm text-gray-600 mt-1">
              Tom atual: <span className="font-medium text-blue-600">{currentKey}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled || isTransposing}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExpanded ? 'Ocultar opções' : 'Mais opções'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 mb-3">Transposição rápida:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleQuickTranspose(-1)}
              disabled={disabled || isTransposing}
            >
              -1 (meio tom ↓)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleQuickTranspose(1)}
              disabled={disabled || isTransposing}
            >
              +1 (meio tom ↑)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleQuickTranspose(-2)}
              disabled={disabled || isTransposing}
            >
              -2 (1 tom ↓)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleQuickTranspose(2)}
              disabled={disabled || isTransposing}
            >
              +2 (1 tom ↑)
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickTranspose(0)}
              disabled={disabled || isTransposing}
            >
              Tom Original
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 pt-4">
            <label htmlFor="semitones" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione a transposição:
            </label>
            <div className="flex gap-2">
              <select
                id="semitones"
                value={selectedSemitones}
                onChange={(e) => setSelectedSemitones(Number(e.target.value))}
                disabled={disabled || isTransposing}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {SEMITONE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                onClick={handleCustomTranspose}
                disabled={disabled || isTransposing}
                isLoading={isTransposing}
              >
                Aplicar
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Use a transposição para adaptar a música à sua voz ou
            instrumento. Valores positivos aumentam o tom, negativos diminuem.
          </p>
        </div>
      </div>
    </div>
  );
};
