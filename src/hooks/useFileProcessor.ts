'use client';

import { useState, useCallback } from 'react';
import type { WordToken, ProcessedFile, SupportedFileType } from '@/types';
import { processTextFile } from '@/lib/textProcessor';
import { processPDFFile } from '@/lib/pdfProcessor';

interface UseFileProcessorReturn {
  processedFile: ProcessedFile | null;
  isProcessing: boolean;
  error: string | null;
  processFile: (file: File) => Promise<void>;
  clearFile: () => void;
}

/**
 * Determines the file type from a File object.
 *
 * @param file - File to analyze
 * @returns The file type or null if unsupported
 */
function getFileType(file: File): SupportedFileType | null {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'txt':
      return 'txt';
    case 'pdf':
      return 'pdf';
    default:
      return null;
  }
}

/**
 * useFileProcessor Hook
 *
 * Manages file processing state and provides methods for
 * loading and processing text and PDF files.
 */
export function useFileProcessor(): UseFileProcessorReturn {
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    const fileType = getFileType(file);

    if (!fileType) {
      setError(`Unsupported file type: ${file.name}`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let words: WordToken[];

      switch (fileType) {
        case 'txt':
          words = await processTextFile(file);
          break;
        case 'pdf':
          words = await processPDFFile(file);
          break;
        default:
          throw new Error('Unsupported file type');
      }

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
