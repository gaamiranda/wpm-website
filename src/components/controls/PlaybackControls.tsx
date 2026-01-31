'use client';

import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  canSkipPrevious: boolean;
  canSkipNext: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkipPrevious: () => void;
  onSkipNext: () => void;
}

/**
 * PlaybackControls Component
 *
 * Provides play/pause, reset, and sentence navigation controls.
 */
export function PlaybackControls({
  isPlaying,
  canSkipPrevious,
  canSkipNext,
  onToggle,
  onReset,
  onSkipPrevious,
  onSkipNext,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Previous sentence */}
      <button
        onClick={onSkipPrevious}
        disabled={!canSkipPrevious}
        className="control-button flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous sentence"
        title="Previous sentence"
      >
        <SkipBack className="h-4 w-4" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={onToggle}
        className="control-button flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="ml-0.5 h-6 w-6" />
        )}
      </button>

      {/* Next sentence */}
      <button
        onClick={onSkipNext}
        disabled={!canSkipNext}
        className="control-button flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next sentence"
        title="Next sentence"
      >
        <SkipForward className="h-4 w-4" />
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="control-button ml-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
        aria-label="Reset to beginning"
        title="Reset (R)"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
