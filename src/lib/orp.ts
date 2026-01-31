/**
 * Optimal Recognition Point (ORP) Calculation
 *
 * The ORP is the character in a word where the eye naturally focuses
 * for optimal recognition. It's typically located slightly left of center,
 * around 35% into the word. This allows the brain to process the word
 * more efficiently as we read left-to-right.
 *
 * Research suggests the ORP helps reduce subvocalization and eye movement,
 * leading to faster reading speeds with maintained comprehension.
 */

/**
 * Calculate the index of the Optimal Recognition Point (pivot character)
 * for a given word.
 *
 * @param word - The word to calculate ORP for
 * @returns The 0-based index of the pivot character
 */
export function calculateORP(word: string): number {
  // Strip any punctuation for length calculation
  const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
  const len = cleanWord.length;

  if (len === 0) return 0;
  if (len === 1) return 0;
  if (len === 2) return 0; // First character
  if (len === 3) return 1; // Middle character
  if (len === 4) return 1; // Second character
  if (len === 5) return 1; // Second character
  if (len <= 7) return 2; // Third character
  if (len <= 9) return 2; // Third character
  if (len <= 11) return 3; // Fourth character
  if (len <= 13) return 3; // Fourth character

  // For very long words, cap at 4th character
  return 4;
}

/**
 * Split a word into three parts based on the ORP:
 * - before: characters before the pivot
 * - pivot: the pivot character (to be highlighted)
 * - after: characters after the pivot
 *
 * @param word - The word to split
 * @returns Object with before, pivot, and after strings
 */
export function splitWordByORP(word: string): {
  before: string;
  pivot: string;
  after: string;
} {
  if (!word || word.length === 0) {
    return { before: '', pivot: '', after: '' };
  }

  const orpIndex = calculateORP(word);

  // Handle case where ORP might be beyond word length (shouldn't happen but safety first)
  const safeIndex = Math.min(orpIndex, word.length - 1);

  return {
    before: word.slice(0, safeIndex),
    pivot: word[safeIndex],
    after: word.slice(safeIndex + 1),
  };
}

/**
 * Find the index in the original word that corresponds to the ORP
 * This accounts for leading punctuation that might shift the position
 *
 * @param word - The original word (may include punctuation)
 * @returns The index in the original word string
 */
export function getORPIndexInOriginal(word: string): number {
  // Find where actual letters start
  const leadingNonAlpha = word.match(/^[^a-zA-Z0-9]*/)?.[0]?.length ?? 0;
  const orp = calculateORP(word);

  return leadingNonAlpha + orp;
}
