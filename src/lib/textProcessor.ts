import type { WordToken } from '@/types';
import {
  SENTENCE_END_PATTERN,
  CLAUSE_BREAK_PATTERN,
  SENTENCE_END_DELAY,
  CLAUSE_BREAK_DELAY,
  PARAGRAPH_BREAK_DELAY,
} from './constants';

/**
 * Determines the delay multiplier for a word based on its punctuation.
 *
 * @param word - The word to analyze
 * @returns Delay multiplier (1.0 = normal, higher = longer pause)
 */
function getDelayMultiplier(word: string): number {
  if (SENTENCE_END_PATTERN.test(word)) {
    return SENTENCE_END_DELAY;
  }
  if (CLAUSE_BREAK_PATTERN.test(word)) {
    return CLAUSE_BREAK_DELAY;
  }
  return 1.0;
}

/**
 * Tokenizes raw text into WordToken array for RSVP processing.
 *
 * Handles:
 * - Word splitting on whitespace
 * - Paragraph breaks (converted to pause markers)
 * - Punctuation-based delay multipliers
 * - Empty string filtering
 *
 * @param text - Raw text content to tokenize
 * @returns Array of WordToken objects ready for RSVP display
 */
export function tokenizeText(text: string): WordToken[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize line endings and split into paragraphs
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Split by multiple newlines (paragraph breaks)
  const paragraphs = normalized.split(/\n{2,}/);

  const tokens: WordToken[] = [];

  paragraphs.forEach((paragraph, paragraphIndex) => {
    // Split paragraph into words
    const words = paragraph
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    words.forEach((word, wordIndex) => {
      // Calculate delay multiplier
      let delayMultiplier = getDelayMultiplier(word);

      // Add extra pause for last word of paragraph (if not already a sentence end)
      if (
        wordIndex === words.length - 1 &&
        paragraphIndex < paragraphs.length - 1 &&
        delayMultiplier < PARAGRAPH_BREAK_DELAY
      ) {
        delayMultiplier = PARAGRAPH_BREAK_DELAY;
      }

      tokens.push({
        text: word,
        delayMultiplier,
      });
    });
  });

  return tokens;
}

/**
 * Reads a text file and returns its content as a string.
 *
 * @param file - File object to read
 * @returns Promise resolving to the file's text content
 */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Processes a text file into WordTokens.
 *
 * @param file - Text file to process
 * @returns Promise resolving to array of WordTokens
 */
export async function processTextFile(file: File): Promise<WordToken[]> {
  const content = await readTextFile(file);
  return tokenizeText(content);
}
