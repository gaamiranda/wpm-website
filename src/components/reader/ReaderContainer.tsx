'use client';

import { WordDisplay } from './WordDisplay';
import { FocusGuide } from './FocusGuide';
import { ProgressBar } from './ProgressBar';
import type { RSVPEngine, FontFamily, CompletionStats } from '@/types';

interface ReaderContainerProps {
  engine: RSVPEngine;
  fontFamily: FontFamily;
  focusGuideEnabled: boolean;
  completionStats: CompletionStats | null;
}

/**
 * ReaderContainer Component
 *
 * Orchestrates the main reading area, combining the word display,
 * focus guides, and progress bar into a cohesive reading experience.
 * Also handles the completion summary display.
 */
export function ReaderContainer({
  engine,
  fontFamily,
  focusGuideEnabled,
  completionStats,
}: ReaderContainerProps) {
  const hasContent = engine.words.length > 0;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Main reading area */}
      <div className="relative flex h-44 w-full items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sm:h-52">
        {/* Focus guide lines */}
        <FocusGuide enabled={focusGuideEnabled && hasContent} />

        {/* Word display */}
        <WordDisplay
          word={engine.currentWord?.text ?? null}
          fontFamily={fontFamily}
          showPlaceholder={!hasContent}
        />
      </div>

      {/* Progress bar */}
      {hasContent && (
        <ProgressBar
          progress={engine.progress}
          currentIndex={engine.currentIndex}
          totalWords={engine.words.length}
          estimatedTimeRemaining={engine.estimatedTimeRemaining}
          showDetails={!engine.isComplete}
        />
      )}

      {/* Completion stats overlay */}
      {engine.isComplete && completionStats && (
        <CompletionSummary stats={completionStats} onRestart={engine.reset} />
      )}
    </div>
  );
}

/**
 * CompletionSummary Component
 *
 * Displays reading statistics after completing a text.
 */
interface CompletionSummaryProps {
  stats: CompletionStats;
  onRestart: () => void;
}

function CompletionSummary({ stats, onRestart }: CompletionSummaryProps) {
  return (
    <div className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-2 text-3xl">&#10003;</div>
        <h2 className="text-xl font-semibold text-zinc-100">Reading Complete</h2>
        <p className="mt-1 text-sm text-zinc-500">Great job! Here are your stats</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <StatCard label="Words Read" value={stats.totalWords.toLocaleString()} />
        <StatCard
          label="Time Taken"
          value={formatDuration(stats.totalTime)}
        />
        <StatCard
          label="Avg. WPM"
          value={stats.averageWpm.toString()}
          highlight
        />
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="control-button mt-6 w-full rounded-lg bg-zinc-700 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
      >
        Read Again
      </button>
    </div>
  );
}

/**
 * StatCard Component
 *
 * Individual stat display card.
 */
interface StatCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatCard({ label, value, highlight = false }: StatCardProps) {
  return (
    <div className="rounded-lg bg-zinc-900/50 p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight ? 'text-red-400' : 'text-zinc-100'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Formats seconds into a readable duration string
 */
function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}
