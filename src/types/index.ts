// Word token with timing metadata
export interface WordToken {
  text: string;
  delayMultiplier: number; // 1.0 normal, 1.5 sentence end, 1.25 clause break
}

// Reader settings persisted to localStorage
export interface ReaderSettings {
  wpm: number;
  focusGuideEnabled: boolean;
}

// RSVP Engine state
export interface RSVPState {
  words: WordToken[];
  currentIndex: number;
  isPlaying: boolean;
  isComplete: boolean;
  wpm: number;
}

// RSVP Engine controls
export interface RSVPControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  setWpm: (wpm: number) => void;
  skipToNextSentence: () => void;
  skipToPreviousSentence: () => void;
  skipWord: (direction: 'forward' | 'backward') => void;
  goToIndex: (index: number) => void;
}

// Complete RSVP Engine return type
export interface RSVPEngine extends RSVPState, RSVPControls {
  currentWord: WordToken | null;
  progress: number; // 0-100
  wordsRemaining: number;
  estimatedTimeRemaining: number; // in seconds
}

// Completion stats shown at end of reading
export interface CompletionStats {
  totalWords: number;
  totalTime: number; // in seconds
  averageWpm: number;
}

// File processing result
export interface ProcessedFile {
  words: WordToken[];
  fileName: string;
  totalWords: number;
}

// Supported file types
export type SupportedFileType = 'txt';
