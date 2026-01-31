'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import type { WordToken, RSVPEngine, CompletionStats } from '@/types';
import { DEFAULT_WPM, MIN_WPM, MAX_WPM } from '@/lib/constants';

interface UseRSVPEngineOptions {
  initialWpm?: number;
  onComplete?: (stats: CompletionStats) => void;
}

/**
 * RSVP Engine Hook
 *
 * Uses requestAnimationFrame with timestamp-based timing for accurate
 * word progression even at high WPM speeds. This approach:
 * 1. Avoids drift that occurs with setInterval
 * 2. Syncs with display refresh for smooth updates
 * 3. Calculates position based on elapsed time, not accumulated intervals
 */
export function useRSVPEngine(
  words: WordToken[],
  options: UseRSVPEngineOptions = {}
): RSVPEngine {
  const { initialWpm = DEFAULT_WPM, onComplete } = options;

  // Core state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpmState] = useState(initialWpm);

  // Timing refs for RAF loop
  const rafIdRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const readingStartTimeRef = useRef<number>(0);



  // Calculate cumulative time for each word index (accounts for variable delays)
  const cumulativeTimes = useMemo(() => {
    if (words.length === 0) return [];

    const baseMs = 60000 / wpm;
    const times: number[] = [0];

    for (let i = 0; i < words.length - 1; i++) {
      const wordDelay = baseMs * words[i].delayMultiplier;
      times.push(times[i] + wordDelay);
    }

    return times;
  }, [words, wpm]);

  // Calculate total reading time
  const totalReadingTime = useMemo(() => {
    if (words.length === 0) return 0;
    const baseMs = 60000 / wpm;
    return words.reduce((acc, word) => acc + baseMs * word.delayMultiplier, 0);
  }, [words, wpm]);

  // Binary search to find word index for a given elapsed time
  const findIndexForTime = useCallback(
    (elapsed: number): number => {
      if (cumulativeTimes.length === 0) return 0;

      let low = 0;
      let high = cumulativeTimes.length - 1;

      while (low < high) {
        const mid = Math.floor((low + high + 1) / 2);
        if (cumulativeTimes[mid] <= elapsed) {
          low = mid;
        } else {
          high = mid - 1;
        }
      }

      return Math.min(low, words.length - 1);
    },
    [cumulativeTimes, words.length]
  );

  // Main animation loop
  useEffect(() => {
    if (!isPlaying || words.length === 0) {
      return;
    }

    // Mark reading start time if this is the first play
    if (readingStartTimeRef.current === 0) {
      readingStartTimeRef.current = performance.now();
    }

    // Set start time, accounting for any accumulated time from previous plays
    startTimeRef.current = performance.now() - accumulatedTimeRef.current;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const targetIndex = findIndexForTime(elapsed);

      // Check if we've reached the end
      if (targetIndex >= words.length - 1 && elapsed >= totalReadingTime) {
        setCurrentIndex(words.length - 1);
        setIsPlaying(false);
        setIsComplete(true);

        // Calculate and report completion stats
        if (onComplete && readingStartTimeRef.current > 0) {
          const totalTime = (now - readingStartTimeRef.current) / 1000;
          const averageWpm = Math.round((words.length / totalTime) * 60);
          onComplete({
            totalWords: words.length,
            totalTime,
            averageWpm,
          });
        }
        return;
      }

      // Update current index if changed
      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [
    isPlaying,
    words,
    currentIndex,
    findIndexForTime,
    totalReadingTime,
    onComplete,
  ]);

  // Play control
  const play = useCallback(() => {
    if (words.length === 0) return;

    // If complete, reset first
    if (isComplete) {
      setCurrentIndex(0);
      setIsComplete(false);
      accumulatedTimeRef.current = 0;
      readingStartTimeRef.current = 0;
    }

    setIsPlaying(true);
  }, [words.length, isComplete]);

  // Pause control
  const pause = useCallback(() => {
    if (isPlaying) {
      // Store accumulated time when pausing
      accumulatedTimeRef.current = performance.now() - startTimeRef.current;
      pausedAtRef.current = performance.now();
    }
    setIsPlaying(false);
  }, [isPlaying]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Reset to beginning
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setIsComplete(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    readingStartTimeRef.current = 0;
  }, []);

  // Set WPM with clamping
  const setWpm = useCallback((newWpm: number) => {
    const clampedWpm = Math.max(MIN_WPM, Math.min(MAX_WPM, newWpm));
    setWpmState(clampedWpm);
  }, []);

  // Go to specific index
  const goToIndex = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, words.length - 1));
      setCurrentIndex(clampedIndex);

      // Update accumulated time to match new position
      if (cumulativeTimes.length > 0) {
        accumulatedTimeRef.current = cumulativeTimes[clampedIndex];
      }

      // Clear complete state if going back
      if (clampedIndex < words.length - 1 && isComplete) {
        setIsComplete(false);
      }
    },
    [words.length, cumulativeTimes, isComplete]
  );

  // Skip to next sentence (find next word after sentence-ending punctuation)
  const skipToNextSentence = useCallback(() => {
    for (let i = currentIndex + 1; i < words.length; i++) {
      // Check if previous word ended a sentence
      if (i > 0 && words[i - 1].delayMultiplier >= 1.5) {
        goToIndex(i);
        return;
      }
    }
    // If no sentence break found, go to end
    goToIndex(words.length - 1);
  }, [currentIndex, words, goToIndex]);

  // Skip to previous sentence
  const skipToPreviousSentence = useCallback(() => {
    // First, go back to find the start of current sentence
    let sentenceStart = currentIndex;

    for (let i = currentIndex - 1; i >= 0; i--) {
      if (words[i].delayMultiplier >= 1.5) {
        // Found end of previous sentence, next word is start of current
        sentenceStart = i + 1;
        break;
      }
      if (i === 0) {
        sentenceStart = 0;
      }
    }

    // If we're already at sentence start, go to previous sentence
    if (sentenceStart === currentIndex || currentIndex === 0) {
      for (let i = sentenceStart - 2; i >= 0; i--) {
        if (words[i].delayMultiplier >= 1.5) {
          goToIndex(i + 1);
          return;
        }
      }
      // No previous sentence, go to start
      goToIndex(0);
    } else {
      goToIndex(sentenceStart);
    }
  }, [currentIndex, words, goToIndex]);

  // Skip single word (for when paused)
  const skipWord = useCallback(
    (direction: 'forward' | 'backward') => {
      if (direction === 'forward') {
        goToIndex(currentIndex + 1);
      } else {
        goToIndex(currentIndex - 1);
      }
    },
    [currentIndex, goToIndex]
  );

  // Derived values
  const currentWord = words.length > 0 ? words[currentIndex] : null;
  const progress = words.length > 0 ? (currentIndex / (words.length - 1)) * 100 : 0;
  const wordsRemaining = words.length - currentIndex - 1;

  // Estimated time remaining in seconds
  const estimatedTimeRemaining = useMemo(() => {
    if (words.length === 0 || currentIndex >= words.length - 1) return 0;

    const baseMs = 60000 / wpm;
    let remaining = 0;

    for (let i = currentIndex + 1; i < words.length; i++) {
      remaining += baseMs * words[i].delayMultiplier;
    }

    return remaining / 1000;
  }, [words, currentIndex, wpm]);

  // Reset when words array reference changes (new file loaded)
  // This is intentional - syncing React state with external data (words prop)
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsComplete(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    readingStartTimeRef.current = 0;
  }, [words]);

  return {
    // State
    words,
    currentIndex,
    isPlaying,
    isComplete,
    wpm,
    currentWord,
    progress,
    wordsRemaining,
    estimatedTimeRemaining,

    // Controls
    play,
    pause,
    toggle,
    reset,
    setWpm,
    skipToNextSentence,
    skipToPreviousSentence,
    skipWord,
    goToIndex,
  };
}
