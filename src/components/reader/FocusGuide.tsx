'use client';

interface FocusGuideProps {
  enabled: boolean;
}

/**
 * FocusGuide Component
 *
 * Renders subtle vertical guide lines around the ORP position to help
 * the reader's eyes stay focused on the center of the screen. The lines
 * have a gentle pulse animation to draw attention without being distracting.
 */
export function FocusGuide({ enabled }: FocusGuideProps) {
  if (!enabled) return null;

  return (
    <>
      {/* Left guide line */}
      <div
        className="focus-guide-line pointer-events-none absolute left-1/2 top-6 bottom-6 w-px -translate-x-12 bg-zinc-600 sm:-translate-x-16"
        aria-hidden="true"
      />

      {/* Right guide line */}
      <div
        className="focus-guide-line pointer-events-none absolute left-1/2 top-6 bottom-6 w-px translate-x-12 bg-zinc-600 sm:translate-x-16"
        aria-hidden="true"
      />

      {/* Center marker - tiny dot at ORP position */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-8 rounded-full bg-red-500/30"
        aria-hidden="true"
      />
    </>
  );
}
