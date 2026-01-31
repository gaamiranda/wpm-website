'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReaderSettings, FontFamily } from '@/types';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '@/lib/constants';

interface UseSettingsReturn {
  settings: ReaderSettings;
  updateWpm: (wpm: number) => void;
  updateFontFamily: (fontFamily: FontFamily) => void;
  updateFocusGuide: (enabled: boolean) => void;
  resetSettings: () => void;
}

/**
 * Safely reads settings from localStorage.
 */
function loadSettings(): ReaderSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<ReaderSettings>;

    // Merge with defaults to ensure all fields exist
    return {
      wpm: parsed.wpm ?? DEFAULT_SETTINGS.wpm,
      fontFamily: parsed.fontFamily ?? DEFAULT_SETTINGS.fontFamily,
      focusGuideEnabled: parsed.focusGuideEnabled ?? DEFAULT_SETTINGS.focusGuideEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Safely saves settings to localStorage.
 */
function saveSettings(settings: ReaderSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * useSettings Hook
 *
 * Manages reader settings with localStorage persistence.
 * Settings are loaded on mount and saved on every change.
 */
export function useSettings(): UseSettingsReturn {
  // Initialize with a function to load from localStorage on client
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    // This runs only on initial render
    // On server, returns defaults; on client, loads from localStorage
    if (typeof window === 'undefined') {
      return DEFAULT_SETTINGS;
    }
    return loadSettings();
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateWpm = useCallback((wpm: number) => {
    setSettings((prev) => ({ ...prev, wpm }));
  }, []);

  const updateFontFamily = useCallback((fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  }, []);

  const updateFocusGuide = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, focusGuideEnabled: enabled }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateWpm,
    updateFontFamily,
    updateFocusGuide,
    resetSettings,
  };
}
