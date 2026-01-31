'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useRSVPEngine } from '@/hooks/useRSVPEngine';
import { splitWordByORP } from '@/lib/orp';
import type { WordToken, CompletionStats } from '@/types';
import {
  SENTENCE_END_PATTERN,
  CLAUSE_BREAK_PATTERN,
  SENTENCE_END_DELAY,
  CLAUSE_BREAK_DELAY,
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

// Sample text for testing the engine
const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the RSVP speed reader. Each word appears one at a time, with the optimal recognition point highlighted in red. The ORP helps your eyes focus on the most important part of each word, reducing eye movement and increasing reading speed. Notice how punctuation creates natural pauses; commas add a slight delay, while periods create longer pauses. This allows for better comprehension at high speeds. Try adjusting the WPM to find your optimal reading speed!`;

export default function Home() {
  const [words] = useState<WordToken[]>(() => textToTokens(SAMPLE_TEXT));
  const [stats, setStats] = useState<CompletionStats | null>(null);

  const engine = useRSVPEngine(words, {
    initialWpm: 300,
    onComplete: (completionStats) => {
      setStats(completionStats);
    },
  });

  const { before, pivot, after } = engine.currentWord
    ? splitWordByORP(engine.currentWord.text)
    : { before: '', pivot: '', after: '' };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="mb-8 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold tracking-tight">RSVP Speed Reader</h1>
      </header>

      {/* Main reading area */}
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        {/* Word display area */}
        <div className="relative flex h-40 w-full items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50">
          {/* Focus guide lines */}
          <div className="focus-guide-line absolute left-1/2 top-4 bottom-4 w-px -translate-x-8 bg-zinc-600" />
          <div className="focus-guide-line absolute left-1/2 top-4 bottom-4 w-px translate-x-8 bg-zinc-600" />

          {/* Word with ORP */}
          {engine.currentWord ? (
            <div className="flex items-center font-reader-sans text-4xl font-medium">
              <span className="w-32 text-right text-zinc-100">{before}</span>
              <span className="pivot-glow text-red-500 font-bold">{pivot}</span>
              <span className="w-32 text-left text-zinc-100">{after}</span>
            </div>
          ) : (
            <span className="text-zinc-500">Upload a file to begin reading</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${engine.progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm text-zinc-500">
            <span>
              Word {engine.currentIndex + 1} of {words.length}
            </span>
            <span>{Math.round(engine.progress)}%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          {/* Playback controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={engine.skipToPreviousSentence}
              className="control-button rounded-lg bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
            >
              Prev Sentence
            </button>
            <button
              onClick={engine.toggle}
              className="control-button rounded-full bg-red-500 px-8 py-3 text-lg font-semibold hover:bg-red-600"
            >
              {engine.isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={engine.skipToNextSentence}
              className="control-button rounded-lg bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
            >
              Next Sentence
            </button>
          </div>

          {/* WPM control */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">WPM:</span>
            <input
              type="range"
              min={100}
              max={1000}
              step={25}
              value={engine.wpm}
              onChange={(e) => engine.setWpm(Number(e.target.value))}
              className="w-48"
            />
            <span className="w-12 text-right font-mono text-sm">{engine.wpm}</span>
          </div>

          {/* Reset button */}
          <button
            onClick={engine.reset}
            className="control-button text-sm text-zinc-500 hover:text-zinc-300"
          >
            Reset
          </button>

          {/* Time remaining */}
          <p className="text-sm text-zinc-600">
            Est. time remaining:{' '}
            {engine.estimatedTimeRemaining > 60
              ? `${Math.floor(engine.estimatedTimeRemaining / 60)}m ${Math.round(engine.estimatedTimeRemaining % 60)}s`
              : `${Math.round(engine.estimatedTimeRemaining)}s`}
          </p>
        </div>

        {/* Completion stats */}
        {engine.isComplete && stats && (
          <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800/50 p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold text-green-400">Reading Complete!</h2>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <p className="text-zinc-400">Words Read</p>
                <p className="text-2xl font-bold">{stats.totalWords}</p>
              </div>
              <div>
                <p className="text-zinc-400">Total Time</p>
                <p className="text-2xl font-bold">{Math.round(stats.totalTime)}s</p>
              </div>
              <div>
                <p className="text-zinc-400">Average WPM</p>
                <p className="text-2xl font-bold">{stats.averageWpm}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer hint */}
      <footer className="mt-8 text-center text-xs text-zinc-600">
        <p>Stage 1 Demo - Engine Core</p>
        <p className="mt-1">Press Space to play/pause (coming in Stage 4)</p>
      </footer>
    </div>
  );
}
