import type { SongDetail } from '../../types';

export interface SongViewerProps {
  songDetail: SongDetail;
  onTranspose?: (semitones: number) => void;
  onEdit?: () => void;
  onBack?: () => void;
  isTransposing?: boolean;
}
