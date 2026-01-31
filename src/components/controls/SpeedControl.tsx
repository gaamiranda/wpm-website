'use client';

import { Minus, Plus } from 'lucide-react';
import { MIN_WPM, MAX_WPM, WPM_STEP } from '@/lib/constants';

interface SpeedControlProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
}

/**
 * SpeedControl Component
 *
 * Provides a slider and increment/decrement buttons for adjusting WPM.
 */
export function SpeedControl({ wpm, onWpmChange }: SpeedControlProps) {
  const handleIncrement = () => {
    onWpmChange(Math.min(MAX_WPM, wpm + WPM_STEP));
  };

  const handleDecrement = () => {
    onWpmChange(Math.max(MIN_WPM, wpm - WPM_STEP));
  };

  return (
    <div className="flex w-full items-center gap-3">
      {/* Label */}
      <span className="w-10 text-sm text-zinc-500">WPM</span>

      {/* Decrement button */}
      <button
        onClick={handleDecrement}
        disabled={wpm <= MIN_WPM}
        className="control-button flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease speed"
        title="Decrease speed (↓)"
      >
        <Minus className="h-3 w-3" />
      </button>

      {/* Slider */}
      <input
        type="range"
        min={MIN_WPM}
        max={MAX_WPM}
        step={WPM_STEP}
        value={wpm}
        onChange={(e) => onWpmChange(Number(e.target.value))}
        className="flex-1"
        aria-label="Words per minute"
        aria-valuemin={MIN_WPM}
        aria-valuemax={MAX_WPM}
        aria-valuenow={wpm}
      />

      {/* Increment button */}
      <button
        onClick={handleIncrement}
        disabled={wpm >= MAX_WPM}
        className="control-button flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase speed"
        title="Increase speed (↑)"
      >
        <Plus className="h-3 w-3" />
      </button>

      {/* Current value */}
      <span className="w-14 text-right font-mono text-sm text-zinc-300">
        {wpm}
      </span>
    </div>
  );
}
