'use client';

interface ProgressBarProps {
  progress: number; // 0-100
  currentIndex: number;
  totalWords: number;
  estimatedTimeRemaining: number; // in seconds
  showDetails?: boolean;
}

/**
 * Formats seconds into a human-readable time string
 */
function formatTime(seconds: number): string {
  if (seconds <= 0) return '0s';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

/**
 * ProgressBar Component
 *
 * Displays reading progress as a visual bar with optional details showing
 * current word position, percentage complete, and estimated time remaining.
 */
export function ProgressBar({
  progress,
  currentIndex,
  totalWords,
  estimatedTimeRemaining,
  showDetails = true,
}: ProgressBarProps) {
  // Clamp progress to valid range
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full">
      {/* Progress bar track */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: ${Math.round(clampedProgress)}%`}
      >
        {/* Progress bar fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-150 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {/* Progress details */}
      {showDetails && totalWords > 0 && (
        <div className="mt-2 flex items-center justify-between text-sm">
          {/* Word count */}
          <span className="text-zinc-500">
            Word{' '}
            <span className="font-medium text-zinc-400">
              {currentIndex + 1}
            </span>{' '}
            of{' '}
            <span className="font-medium text-zinc-400">{totalWords}</span>
          </span>

          {/* Percentage and time */}
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">
              <span className="font-mono font-medium text-zinc-400">
                {Math.round(clampedProgress)}%
              </span>
            </span>

            {estimatedTimeRemaining > 0 && (
              <span className="text-zinc-600">
                {formatTime(estimatedTimeRemaining)} left
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
