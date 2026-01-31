'use client';

import { useEffect, useCallback } from 'react';
import type { RSVPEngine, FontFamily } from '@/types';
import { WPM_STEP, MIN_WPM, MAX_WPM } from '@/lib/constants';

interface KeyboardShortcutsConfig {
  engine: RSVPEngine;
  hasContent: boolean;
  onFontChange: (font: FontFamily) => void;
  onFocusGuideToggle: () => void;
  onWpmChange: (wpm: number) => void;
}

/**
 * Keyboard shortcuts map for display purposes.
 */
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: 'R', action: 'Reset to beginning' },
  { key: '←', action: 'Previous sentence' },
  { key: '→', action: 'Next sentence' },
  { key: 'Shift + ←', action: 'Previous word (paused)' },
  { key: 'Shift + →', action: 'Next word (paused)' },
  { key: '↑', action: 'Increase WPM' },
  { key: '↓', action: 'Decrease WPM' },
  { key: '1', action: 'Mono font' },
  { key: '2', action: 'Sans font' },
  { key: '3', action: 'Serif font' },
  { key: 'G', action: 'Toggle focus guide' },
  { key: '?', action: 'Show shortcuts' },
] as const;

/**
 * useKeyboardShortcuts Hook
 *
 * Registers global keyboard event listeners for reader controls.
 * All shortcuts work when content is loaded.
 */
export function useKeyboardShortcuts({
  engine,
  hasContent,
  onFontChange,
  onFocusGuideToggle,
  onWpmChange,
}: KeyboardShortcutsConfig): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Most shortcuts require content to be loaded
      const requiresContent = !['?'].includes(event.key);
      if (requiresContent && !hasContent) {
        return;
      }

      switch (event.key) {
        // Play/Pause
        case ' ':
          event.preventDefault();
          engine.toggle();
          break;

        // Reset
        case 'r':
        case 'R':
          event.preventDefault();
          engine.reset();
          break;

        // Previous sentence / word
        case 'ArrowLeft':
          event.preventDefault();
          if (event.shiftKey && !engine.isPlaying) {
            engine.skipWord('backward');
          } else {
            engine.skipToPreviousSentence();
          }
          break;

        // Next sentence / word
        case 'ArrowRight':
          event.preventDefault();
          if (event.shiftKey && !engine.isPlaying) {
            engine.skipWord('forward');
          } else {
            engine.skipToNextSentence();
          }
          break;

        // Increase WPM
        case 'ArrowUp':
          event.preventDefault();
          onWpmChange(Math.min(MAX_WPM, engine.wpm + WPM_STEP));
          break;

        // Decrease WPM
        case 'ArrowDown':
          event.preventDefault();
          onWpmChange(Math.max(MIN_WPM, engine.wpm - WPM_STEP));
          break;

        // Font selection
        case '1':
          event.preventDefault();
          onFontChange('mono');
          break;
        case '2':
          event.preventDefault();
          onFontChange('sans');
          break;
        case '3':
          event.preventDefault();
          onFontChange('serif');
          break;

        // Toggle focus guide
        case 'g':
        case 'G':
          event.preventDefault();
          onFocusGuideToggle();
          break;

        default:
          break;
      }
    },
    [engine, hasContent, onFontChange, onFocusGuideToggle, onWpmChange]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
