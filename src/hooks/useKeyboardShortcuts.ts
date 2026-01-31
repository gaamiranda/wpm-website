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
      // Ignore if typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Space requires content to be loaded
      if (!hasContent) {
        return;
      }

      // Play/Pause with Space
      if (event.key === ' ') {
        event.preventDefault();
        engine.toggle();
      }
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
