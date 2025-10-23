import type { CreateSongDto } from '../../types';

export interface SongFormProps {
  onSubmit: (data: CreateSongDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<CreateSongDto>;
}

export interface SongFormData {
  title: string;
  artist: string;
  lyrics: string;
  originalKey: string;
  category: string;
}
