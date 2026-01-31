'use client';

import { useMemo } from 'react';
import { splitWordByORP } from '@/lib/orp';

interface WordDisplayProps {
  word: string | null;
  showPlaceholder?: boolean;
  placeholderText?: string;
}

/**
 * WordDisplay Component
 *
 * Renders a single word with Optimal Recognition Point (ORP) highlighting.
 * The pivot character is displayed in red and centered, with the rest of
 * the word positioned around it to minimize eye movement.
 */
export function WordDisplay({
  word,
  showPlaceholder = true,
  placeholderText = 'Upload a file to begin reading',
}: WordDisplayProps) {
  const { before, pivot, after } = useMemo(() => {
    if (!word) {
      return { before: '', pivot: '', after: '' };
    }
    return splitWordByORP(word);
  }, [word]);

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
      className="reader-text word-animate flex items-center justify-center"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Before pivot - right aligned */}
      <span
        className="inline-block w-[140px] text-right text-4xl font-medium text-zinc-100 sm:w-[180px] sm:text-5xl"
        aria-hidden="true"
      >
        {before}
      </span>

      {/* Pivot character - centered, highlighted */}
      <span
        className="pivot-glow inline-block text-4xl font-bold text-red-500 sm:text-5xl"
        aria-hidden="true"
      >
        {pivot}
      </span>

      {/* After pivot - left aligned */}
      <span
        className="inline-block w-[140px] text-left text-4xl font-medium text-zinc-100 sm:w-[180px] sm:text-5xl"
        aria-hidden="true"
      >
        {after}
      </span>

      {/* Screen reader accessible full word */}
      <span className="sr-only">{word}</span>
    </div>
  );
}
