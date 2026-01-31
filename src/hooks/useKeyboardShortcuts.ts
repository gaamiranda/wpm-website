'use client';

import { useEffect, useCallback } from 'react';
import type { RSVPEngine } from '@/types';

interface KeyboardShortcutsConfig {
  engine: RSVPEngine;
  hasContent: boolean;
}

/**
 * Keyboard shortcuts map for display purposes.
 */
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
] as const;

/**
 * useKeyboardShortcuts Hook
 *
 * Registers global keyboard event listeners for reader controls.
 */
export function useKeyboardShortcuts({
  engine,
  hasContent,
}: KeyboardShortcutsConfig): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle Space key
      if (event.key !== ' ') {
        return;
      }

      // Space requires content to be loaded
      if (!hasContent) {
        return;
      }

      // Prevent default behavior (e.g., activating focused button/slider)
      event.preventDefault();
      
      // Blur any focused element so Space always controls playback
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      engine.toggle();
    },
    [engine, hasContent]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
