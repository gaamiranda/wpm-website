'use client';

import { useState, useMemo, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useRSVPEngine } from '@/hooks/useRSVPEngine';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useSettings } from '@/hooks/useSettings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ReaderContainer } from '@/components/reader';
import { ControlsPanel } from '@/components/controls';
import { FileUpload } from '@/components/upload';
import type { CompletionStats } from '@/types';

export default function Home() {
  // File processing
  const { processedFile, isProcessing, error, processFile, clearFile } =
    useFileProcessor();

  // Persistent settings
  const { settings, updateWpm, updateFocusGuide } = useSettings();

  // UI state
  const [stats, setStats] = useState<CompletionStats | null>(null);

  // Get words from processed file, or empty array if no file
  const words = useMemo(
    () => processedFile?.words ?? [],
    [processedFile?.words]
  );

  // Has content to display
  const hasContent = words.length > 0;

  // RSVP Engine - sync WPM with settings
  const engine = useRSVPEngine(words, {
    initialWpm: settings.wpm,
    onComplete: (completionStats) => {
      setStats(completionStats);
    },
  });

  // Sync engine WPM when settings change (on mount only, or when settings.wpm changes)
  useEffect(() => {
    if (engine.wpm !== settings.wpm) {
      engine.setWpm(settings.wpm);
    }
    // Note: engine is intentionally excluded - we only want to sync when settings change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.wpm]);

  // Handle WPM change - update both engine and settings
  const handleWpmChange = (wpm: number) => {
    engine.setWpm(wpm);
    updateWpm(wpm);
  };

  // Keyboard shortcuts (Space to play/pause)
  useKeyboardShortcuts({
    engine,
    hasContent,
  });

  // Handle file clear - also reset engine
  const handleClearFile = () => {
    clearFile();
    setStats(null);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-red-500" />
        <h1 className="text-2xl font-bold tracking-tight">RSVP Speed Reader</h1>
      </header>

      {/* Main content */}
      <main className="flex w-full max-w-2xl flex-col items-center gap-8">
        {/* File upload - show when no content */}
        {!hasContent && (
          <FileUpload
            onFileSelect={processFile}
            isProcessing={isProcessing}
            currentFileName={null}
            onClear={handleClearFile}
          />
        )}

        {/* Processing error */}
        {error && (
          <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Reader area - show when content loaded */}
        {hasContent && (
          <>
            {/* File info bar */}
            <div className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">
                  {processedFile?.fileName}
                </span>
                <span className="text-xs text-zinc-600">
                  ({words.length.toLocaleString()} words)
                </span>
              </div>
              <button
                onClick={handleClearFile}
                className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Change file
              </button>
            </div>

            {/* Reader container */}
            <ReaderContainer
              engine={engine}
              focusGuideEnabled={settings.focusGuideEnabled}
              completionStats={stats}
            />

            {/* Controls - hide when complete */}
            {!engine.isComplete && (
              <ControlsPanel
                engine={engine}
                focusGuideEnabled={settings.focusGuideEnabled}
                onFocusGuideToggle={() => updateFocusGuide(!settings.focusGuideEnabled)}
                onWpmChange={handleWpmChange}
              />
            )}
          </>
        )}

        {/* Empty state with tips */}
        {!hasContent && !isProcessing && !error && (
          <div className="mt-4 text-center">
            <h2 className="mb-2 text-lg font-medium text-zinc-300">
              Speed Reading Made Simple
            </h2>
            <p className="text-sm text-zinc-500">
              Upload a .txt file to start reading at up to 1000 WPM.
              <br />
              The red letter marks the optimal focus point for faster reading.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12">
        <p className="text-xs text-zinc-600">
          RSVP Speed Reader
        </p>
      </footer>
    </div>
  );
}
