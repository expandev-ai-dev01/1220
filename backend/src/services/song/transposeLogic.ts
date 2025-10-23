/**
 * @summary
 * Chord transposition logic for musical key changes
 *
 * @module services/song/transpose
 */

/**
 * @constant NOTES
 * @description Chromatic scale of musical notes
 */
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * @constant FLAT_TO_SHARP
 * @description Mapping of flat notes to their sharp equivalents
 */
const FLAT_TO_SHARP: { [key: string]: string } = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

/**
 * @summary
 * Transposes a single chord by the specified number of semitones
 *
 * @function transposeChord
 * @module services/song/transpose
 *
 * @param {string} chord - Original chord (e.g., 'C', 'Am', 'G7', 'Cmaj7')
 * @param {number} semitones - Number of semitones to transpose (-11 to 11)
 *
 * @returns {string} Transposed chord
 *
 * @example
 * transposeChord('C', 2);      // Returns 'D'
 * transposeChord('Am', 2);     // Returns 'Bm'
 * transposeChord('G7', -3);    // Returns 'E7'
 * transposeChord('Cmaj7', 5);  // Returns 'Fmaj7'
 */
export function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord.trim().length === 0) {
    return chord;
  }

  /**
   * @rule {be-chord-parsing-002} Parse chord into root note and suffix
   * @description Extract root note (with sharp/flat) and remaining chord quality
   */
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) {
    return chord;
  }

  let rootNote = match[1];
  const suffix = match[2];

  /**
   * @rule {be-transpose-003} Convert flats to sharps for consistent transposition
   * @description Use sharp notation internally for easier calculation
   */
  if (rootNote.length === 2 && rootNote[1] === 'b') {
    rootNote = FLAT_TO_SHARP[rootNote] || rootNote;
  }

  /**
   * @rule {be-transpose-004} Calculate new note position in chromatic scale
   * @description Add semitones and wrap around using modulo 12
   */
  const currentIndex = NOTES.indexOf(rootNote);
  if (currentIndex === -1) {
    return chord;
  }

  let newIndex = (currentIndex + semitones) % 12;
  if (newIndex < 0) {
    newIndex += 12;
  }

  const newRootNote = NOTES[newIndex];

  return newRootNote + suffix;
}

/**
 * @summary
 * Detects the original key from the first chord in lyrics
 *
 * @function detectOriginalKey
 * @module services/song/transpose
 *
 * @param {string} lyrics - Song lyrics with chords
 *
 * @returns {string | null} Detected key or null if not found
 *
 * @example
 * detectOriginalKey('    C        G\nVerse');  // Returns 'C'
 * detectOriginalKey('    Am       F\nVerse');  // Returns 'Am'
 */
export function detectOriginalKey(lyrics: string): string | null {
  const lines = lyrics.split('\n');

  for (const line of lines) {
    /**
     * @rule {be-key-detection-001} First chord line indicates likely key
     * @description The first chord in a song often represents the key
     */
    const isChordLine = /^[\s]*[A-G][#b]?[\w\/]*([\s]+[A-G][#b]?[\w\/]*)*[\s]*$/.test(line);

    if (isChordLine && line.trim().length > 0) {
      const firstChordMatch = line.match(/[A-G][#b]?[\w\/]*/);
      if (firstChordMatch) {
        return firstChordMatch[0];
      }
    }
  }

  return null;
}

/**
 * @summary
 * Calculates the interval between two musical keys
 *
 * @function calculateInterval
 * @module services/song/transpose
 *
 * @param {string} fromKey - Starting key
 * @param {string} toKey - Target key
 *
 * @returns {number} Number of semitones between keys
 *
 * @example
 * calculateInterval('C', 'D');   // Returns 2
 * calculateInterval('G', 'E');   // Returns -3 (or 9)
 * calculateInterval('Am', 'Bm'); // Returns 2
 */
export function calculateInterval(fromKey: string, toKey: string): number {
  const fromMatch = fromKey.match(/^([A-G][#b]?)/);
  const toMatch = toKey.match(/^([A-G][#b]?)/);

  if (!fromMatch || !toMatch) {
    return 0;
  }

  let fromNote = fromMatch[1];
  let toNote = toMatch[1];

  // Convert flats to sharps
  if (fromNote.length === 2 && fromNote[1] === 'b') {
    fromNote = FLAT_TO_SHARP[fromNote] || fromNote;
  }
  if (toNote.length === 2 && toNote[1] === 'b') {
    toNote = FLAT_TO_SHARP[toNote] || toNote;
  }

  const fromIndex = NOTES.indexOf(fromNote);
  const toIndex = NOTES.indexOf(toNote);

  if (fromIndex === -1 || toIndex === -1) {
    return 0;
  }

  let interval = toIndex - fromIndex;
  if (interval < 0) {
    interval += 12;
  }

  return interval;
}
