'use client';

import { useMemo } from 'react';
import { splitWordByORP } from '@/lib/orp';
import type { FontFamily } from '@/types';

interface WordDisplayProps {
  word: string | null;
  fontFamily: FontFamily;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

const FONT_CLASS_MAP: Record<FontFamily, string> = {
  mono: 'font-reader-mono',
  sans: 'font-reader-sans',
  serif: 'font-reader-serif',
};

/**
 * WordDisplay Component
 *
 * Renders a single word with Optimal Recognition Point (ORP) highlighting.
 * The pivot character is displayed in red and centered, with the rest of
 * the word positioned around it to minimize eye movement.
 */
export function WordDisplay({
  word,
  fontFamily,
  showPlaceholder = true,
  placeholderText = 'Upload a file to begin reading',
}: WordDisplayProps) {
  const { before, pivot, after } = useMemo(() => {
    if (!word) {
      return { before: '', pivot: '', after: '' };
    }
    return splitWordByORP(word);
  }, [word]);

  const fontClass = FONT_CLASS_MAP[fontFamily];

  // If no word, show placeholder
  if (!word) {
    if (!showPlaceholder) return null;

    return (
      <div className="flex items-center justify-center">
        <span className="text-zinc-500 text-lg">{placeholderText}</span>
      </div>
    );
  }

  return (
    <div
      key={word} // Force re-render for animation
      className={`reader-text word-animate flex items-center justify-center ${fontClass}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Before pivot - right aligned */}
      <span
        className="inline-block w-[140px] text-right text-4xl font-medium text-zinc-100 sm:w-[180px] sm:text-5xl [font-family:inherit]"
        aria-hidden="true"
      >
        {before}
      </span>

      {/* Pivot character - centered, highlighted */}
      <span
        className="pivot-glow inline-block text-4xl font-bold text-red-500 sm:text-5xl [font-family:inherit]"
        aria-hidden="true"
      >
        {pivot}
      </span>

      {/* After pivot - left aligned */}
      <span
        className="inline-block w-[140px] text-left text-4xl font-medium text-zinc-100 sm:w-[180px] sm:text-5xl [font-family:inherit]"
        aria-hidden="true"
      >
        {after}
      </span>

      {/* Screen reader accessible full word */}
      <span className="sr-only">{word}</span>
    </div>
  );
}
