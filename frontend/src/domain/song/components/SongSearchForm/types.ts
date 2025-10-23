import type { SongSearchParams } from '../../types';

export interface SongSearchFormProps {
  onSearch: (filters: SongSearchParams) => void;
  onClear: () => void;
  isSearching?: boolean;
  initialFilters?: SongSearchParams;
}

export interface SearchFormData {
  query: string;
  title: string;
  artist: string;
  category: string;
  lyrics: string;
}
