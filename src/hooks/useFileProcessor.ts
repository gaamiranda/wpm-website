'use client';

import { useState, useCallback } from 'react';
import type { ProcessedFile } from '@/types';
import { processTextFile } from '@/lib/textProcessor';

interface UseFileProcessorReturn {
  processedFile: ProcessedFile | null;
  isProcessing: boolean;
  error: string | null;
  processFile: (file: File) => Promise<void>;
  clearFile: () => void;
}

/**
 * Checks if file is a supported .txt file.
 */
function isTxtFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'txt';
}

/**
 * useFileProcessor Hook
 *
 * Manages file processing state and provides methods for
 * loading and processing text files.
 */
export function useFileProcessor(): UseFileProcessorReturn {
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    if (!isTxtFile(file)) {
      setError(`Unsupported file type. Please upload a .txt file.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const words = await processTextFile(file);

      if (words.length === 0) {
        setError('No readable text found in file');
        setProcessedFile(null);
        return;
      }

      setProcessedFile({
        words,
        fileName: file.name,
        totalWords: words.length,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process file';
      setError(message);
      setProcessedFile(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    setProcessedFile(null);
    setError(null);
  }, []);

  return {
    processedFile,
    isProcessing,
    error,
    processFile,
    clearFile,
  };
}
