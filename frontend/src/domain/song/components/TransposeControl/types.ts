export interface TransposeControlProps {
  currentKey: string | null;
  onTranspose: (semitones: number) => void;
  isTransposing?: boolean;
  disabled?: boolean;
}
