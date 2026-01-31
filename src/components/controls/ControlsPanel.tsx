'use client';

import { PlaybackControls } from './PlaybackControls';
import { SpeedControl } from './SpeedControl';
import { FontSelector } from './FontSelector';
import type { RSVPEngine, FontFamily } from '@/types';

interface ControlsPanelProps {
  engine: RSVPEngine;
  fontFamily: FontFamily;
  focusGuideEnabled: boolean;
  onFontChange: (font: FontFamily) => void;
  onFocusGuideToggle: () => void;
  onWpmChange: (wpm: number) => void;
}

/**
 * ControlsPanel Component
 *
 * Groups all reader controls: playback, speed, font, and focus guide settings.
 */
export function ControlsPanel({
  engine,
  fontFamily,
  focusGuideEnabled,
  onFontChange,
  onFocusGuideToggle,
  onWpmChange,
}: ControlsPanelProps) {
  const canSkipPrevious = engine.currentIndex > 0;
  const canSkipNext = engine.currentIndex < engine.words.length - 1;

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      {/* Playback controls */}
      <PlaybackControls
        isPlaying={engine.isPlaying}
        canSkipPrevious={canSkipPrevious}
        canSkipNext={canSkipNext}
        onToggle={engine.toggle}
        onReset={engine.reset}
        onSkipPrevious={engine.skipToPreviousSentence}
        onSkipNext={engine.skipToNextSentence}
      />

      {/* Speed control */}
      <SpeedControl wpm={engine.wpm} onWpmChange={onWpmChange} />

      {/* Settings row */}
      <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4">
        {/* Font selector */}
        <FontSelector value={fontFamily} onChange={onFontChange} />

        {/* Focus guide toggle */}
        <FocusGuideToggle
          enabled={focusGuideEnabled}
          onToggle={onFocusGuideToggle}
        />
      </div>
    </div>
  );
}

/**
 * FocusGuideToggle Component
 *
 * Toggle switch for enabling/disabling focus guide lines.
 */
interface FocusGuideToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function FocusGuideToggle({ enabled, onToggle }: FocusGuideToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-zinc-500">Guide</span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? 'bg-red-500' : 'bg-zinc-700'
        }`}
        title={`Focus guide (G) - ${enabled ? 'On' : 'Off'}`}
      >
        <span
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
