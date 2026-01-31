import type { ReaderSettings } from '@/types';

// WPM constraints (testing range: 10-100 for slow playback debugging)
export const MIN_WPM = 10;
export const MAX_WPM = 100;
export const WPM_STEP = 5;
export const DEFAULT_WPM = 50;

// Punctuation delay multipliers
export const SENTENCE_END_DELAY = 1.5; // For . ! ?
export const CLAUSE_BREAK_DELAY = 1.25; // For , ; :
export const PARAGRAPH_BREAK_DELAY = 2.0; // For line breaks

// Regex patterns for punctuation detection
export const SENTENCE_END_PATTERN = /[.!?]$/;
export const CLAUSE_BREAK_PATTERN = /[,;:]$/;

// Default settings
export const DEFAULT_SETTINGS: ReaderSettings = {
  wpm: DEFAULT_WPM,
  fontFamily: 'sans',
  focusGuideEnabled: true,
};

// localStorage key
export const SETTINGS_STORAGE_KEY = 'rsvp-reader-settings';

// Font family CSS mappings
export const FONT_FAMILY_MAP = {
  mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Merriweather", "Georgia", "Times New Roman", serif',
} as const;

// Accepted file types
export const ACCEPTED_FILE_TYPES = {
  'text/plain': ['.txt'],
  'application/pdf': ['.pdf'],
} as const;

export const ACCEPTED_EXTENSIONS = ['.txt', '.pdf'] as const;
