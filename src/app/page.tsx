'use client';

import { useState } from 'react';
import { BookOpen, SkipBack, SkipForward, Play, Pause, RotateCcw } from 'lucide-react';
import { useRSVPEngine } from '@/hooks/useRSVPEngine';
import { ReaderContainer } from '@/components/reader';
import type { WordToken, CompletionStats, FontFamily } from '@/types';
import {
  SENTENCE_END_PATTERN,
  CLAUSE_BREAK_PATTERN,
  SENTENCE_END_DELAY,
  CLAUSE_BREAK_DELAY,
  MIN_WPM,
  MAX_WPM,
  WPM_STEP,
} from '@/lib/constants';

// Temporary: Convert text to word tokens (will be moved to textProcessor.ts in Stage 3)
function textToTokens(text: string): WordToken[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.map((word) => ({
    text: word,
    delayMultiplier: SENTENCE_END_PATTERN.test(word)
      ? SENTENCE_END_DELAY
      : CLAUSE_BREAK_PATTERN.test(word)
        ? CLAUSE_BREAK_DELAY
        : 1.0,
  }));
}

// Sample text for testing
const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the RSVP speed reader. Each word appears one at a time, with the optimal recognition point highlighted in red. The ORP helps your eyes focus on the most important part of each word, reducing eye movement and increasing reading speed. Notice how punctuation creates natural pauses; commas add a slight delay, while periods create longer pauses. This allows for better comprehension at high speeds. Try adjusting the WPM to find your optimal reading speed!`;

export default function Home() {
  const [words] = useState<WordToken[]>(() => textToTokens(SAMPLE_TEXT));
  const [stats, setStats] = useState<CompletionStats | null>(null);
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [focusGuideEnabled, setFocusGuideEnabled] = useState(true);

  const engine = useRSVPEngine(words, {
    initialWpm: 300,
    onComplete: (completionStats) => {
      setStats(completionStats);
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold tracking-tight">RSVP Speed Reader</h1>
      </header>

      {/* Main content */}
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        {/* Reader container with word display, focus guide, progress */}
        <ReaderContainer
          engine={engine}
          fontFamily={fontFamily}
          focusGuideEnabled={focusGuideEnabled}
          completionStats={stats}
        />

        {/* Controls section */}
        {!engine.isComplete && (
          <div className="flex w-full max-w-md flex-col items-center gap-6">
            {/* Playback controls */}
            <div className="flex items-center gap-3">
              {/* Previous sentence */}
              <button
                onClick={engine.skipToPreviousSentence}
                disabled={engine.currentIndex === 0}
                className="control-button flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous sentence"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={engine.toggle}
                className="control-button flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                aria-label={engine.isPlaying ? 'Pause' : 'Play'}
              >
                {engine.isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </button>

              {/* Next sentence */}
              <button
                onClick={engine.skipToNextSentence}
                disabled={engine.currentIndex >= engine.words.length - 1}
                className="control-button flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next sentence"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Reset */}
              <button
                onClick={engine.reset}
                className="control-button ml-2 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                aria-label="Reset to beginning"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* WPM slider */}
            <div className="flex w-full items-center gap-4">
              <span className="text-sm text-zinc-500 w-10">WPM</span>
              <input
                type="range"
                min={MIN_WPM}
                max={MAX_WPM}
                step={WPM_STEP}
                value={engine.wpm}
                onChange={(e) => engine.setWpm(Number(e.target.value))}
                className="flex-1"
                aria-label="Words per minute"
              />
              <span className="w-12 text-right font-mono text-sm text-zinc-300">
                {engine.wpm}
              </span>
            </div>

            {/* Settings row */}
            <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-4">
              {/* Font selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wide">Font</span>
                <div className="flex rounded-lg bg-zinc-800 p-1">
                  <FontButton
                    active={fontFamily === 'mono'}
                    onClick={() => setFontFamily('mono')}
                    label="Mono"
                  />
                  <FontButton
                    active={fontFamily === 'sans'}
                    onClick={() => setFontFamily('sans')}
                    label="Sans"
                  />
                  <FontButton
                    active={fontFamily === 'serif'}
                    onClick={() => setFontFamily('serif')}
                    label="Serif"
                  />
                </div>
              </div>

              {/* Focus guide toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-zinc-500 uppercase tracking-wide">Guide</span>
                <button
                  role="switch"
                  aria-checked={focusGuideEnabled}
                  onClick={() => setFocusGuideEnabled(!focusGuideEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    focusGuideEnabled ? 'bg-red-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                      focusGuideEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-zinc-600">
        <p>Stage 2 Demo - Modular Components</p>
        <p className="mt-1">Keyboard shortcuts coming in Stage 4</p>
      </footer>
    </div>
  );
}

/**
 * Font selection button component
 */
interface FontButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function FontButton({ active, onClick, label }: FontButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
        active
          ? 'bg-zinc-700 text-zinc-100'
          : 'text-zinc-400 hover:text-zinc-300'
      }`}
    >
      {label}
    </button>
  );
}
