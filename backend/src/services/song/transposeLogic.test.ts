import { transposeChord, detectOriginalKey, calculateInterval } from './transposeLogic';

describe('Transpose Logic', () => {
  describe('transposeChord', () => {
    it('should transpose simple major chords up', () => {
      expect(transposeChord('C', 2)).toBe('D');
      expect(transposeChord('D', 2)).toBe('E');
      expect(transposeChord('G', 2)).toBe('A');
    });

    it('should transpose simple major chords down', () => {
      expect(transposeChord('D', -2)).toBe('C');
      expect(transposeChord('E', -2)).toBe('D');
      expect(transposeChord('A', -2)).toBe('G');
    });

    it('should transpose minor chords', () => {
      expect(transposeChord('Am', 2)).toBe('Bm');
      expect(transposeChord('Dm', -3)).toBe('Bm');
      expect(transposeChord('Em', 5)).toBe('Am');
    });

    it('should transpose seventh chords', () => {
      expect(transposeChord('G7', 2)).toBe('A7');
      expect(transposeChord('C7', -3)).toBe('A7');
      expect(transposeChord('D7', 5)).toBe('G7');
    });

    it('should transpose major seventh chords', () => {
      expect(transposeChord('Cmaj7', 2)).toBe('Dmaj7');
      expect(transposeChord('Gmaj7', -2)).toBe('Fmaj7');
    });

    it('should transpose suspended chords', () => {
      expect(transposeChord('Csus4', 2)).toBe('Dsus4');
      expect(transposeChord('Gsus2', -3)).toBe('Esus2');
    });

    it('should transpose diminished chords', () => {
      expect(transposeChord('Cdim', 2)).toBe('Ddim');
      expect(transposeChord('Gdim7', -2)).toBe('Fdim7');
    });

    it('should transpose augmented chords', () => {
      expect(transposeChord('Caug', 2)).toBe('Daug');
      expect(transposeChord('Gaug', -3)).toBe('Eaug');
    });

    it('should transpose sharp chords', () => {
      expect(transposeChord('C#', 2)).toBe('D#');
      expect(transposeChord('F#', 2)).toBe('G#');
      expect(transposeChord('G#m', -1)).toBe('Gm');
    });

    it('should transpose flat chords to sharp equivalents', () => {
      expect(transposeChord('Db', 2)).toBe('D#');
      expect(transposeChord('Eb', 2)).toBe('F');
      expect(transposeChord('Bbm', -2)).toBe('G#m');
    });

    it('should handle slash chords', () => {
      expect(transposeChord('C/G', 2)).toBe('D/G');
      expect(transposeChord('G/B', -2)).toBe('F/B');
    });

    it('should wrap around chromatic scale', () => {
      expect(transposeChord('B', 2)).toBe('C#');
      expect(transposeChord('C', -2)).toBe('A#');
      expect(transposeChord('A', 3)).toBe('C');
    });

    it('should handle extreme transpositions', () => {
      expect(transposeChord('C', 11)).toBe('B');
      expect(transposeChord('C', -11)).toBe('C#');
    });

    it('should preserve chord when transposing by 0 semitones', () => {
      expect(transposeChord('C', 0)).toBe('C');
      expect(transposeChord('Am7', 0)).toBe('Am7');
    });

    it('should handle empty or invalid chords', () => {
      expect(transposeChord('', 2)).toBe('');
      expect(transposeChord('X', 2)).toBe('X');
    });
  });

  describe('detectOriginalKey', () => {
    it('should detect key from first chord line', () => {
      const lyrics = '    C        G\nVerse text here';
      expect(detectOriginalKey(lyrics)).toBe('C');
    });

    it('should detect minor key', () => {
      const lyrics = '    Am       F\nVerse text here';
      expect(detectOriginalKey(lyrics)).toBe('Am');
    });

    it('should detect key with seventh chord', () => {
      const lyrics = '    G7       C\nVerse text here';
      expect(detectOriginalKey(lyrics)).toBe('G7');
    });

    it('should skip text lines and find first chord line', () => {
      const lyrics = 'Verse 1\n\n    D        A\nText here';
      expect(detectOriginalKey(lyrics)).toBe('D');
    });

    it('should return null when no chords found', () => {
      const lyrics = 'Just text\nNo chords here';
      expect(detectOriginalKey(lyrics)).toBeNull();
    });

    it('should return null for empty lyrics', () => {
      expect(detectOriginalKey('')).toBeNull();
    });
  });

  describe('calculateInterval', () => {
    it('should calculate interval between major keys', () => {
      expect(calculateInterval('C', 'D')).toBe(2);
      expect(calculateInterval('G', 'A')).toBe(2);
      expect(calculateInterval('C', 'G')).toBe(7);
    });

    it('should calculate interval going down', () => {
      expect(calculateInterval('D', 'C')).toBe(11);
      expect(calculateInterval('G', 'E')).toBe(9);
    });

    it('should calculate interval with minor chords', () => {
      expect(calculateInterval('Am', 'Bm')).toBe(2);
      expect(calculateInterval('Dm', 'Am')).toBe(7);
    });

    it('should calculate interval with sharp keys', () => {
      expect(calculateInterval('C#', 'D#')).toBe(2);
      expect(calculateInterval('F#', 'G#')).toBe(2);
    });

    it('should calculate interval with flat keys', () => {
      expect(calculateInterval('Db', 'Eb')).toBe(2);
      expect(calculateInterval('Bb', 'C')).toBe(2);
    });

    it('should return 0 for same key', () => {
      expect(calculateInterval('C', 'C')).toBe(0);
      expect(calculateInterval('Am', 'Am')).toBe(0);
    });

    it('should return 0 for invalid keys', () => {
      expect(calculateInterval('X', 'Y')).toBe(0);
      expect(calculateInterval('', 'C')).toBe(0);
    });
  });
});
