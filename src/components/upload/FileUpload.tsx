'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, File, X, Loader2 } from 'lucide-react';
import { ACCEPTED_EXTENSIONS } from '@/lib/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  currentFileName: string | null;
  onClear: () => void;
}

/**
 * FileUpload Component
 *
 * Provides a drag-and-drop zone and file browser for uploading text files.
 * Supports .txt and .pdf files with visual feedback during drag operations.
 */
export function FileUpload({
  onFileSelect,
  isProcessing,
  currentFileName,
  onClear,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValid = ACCEPTED_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_EXTENSIONS)[number]
    );

    if (!isValid) {
      setError(`Invalid file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      return false;
    }

    setError(null);
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  // Show current file info if a file is loaded
  if (currentFileName && !isProcessing) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <FileIcon fileName={currentFileName} />
            <div>
              <p className="text-sm font-medium text-zinc-200">{currentFileName}</p>
              <p className="text-xs text-zinc-500">Ready to read</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
            aria-label="Remove file"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleInputChange}
        className="hidden"
        aria-label="File upload"
      />

      {/* Drop zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all ${
          isDragging
            ? 'drop-zone-active border-red-500 bg-red-500/5'
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Click or drag file to upload"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mb-3 h-10 w-10 animate-spin text-red-500" />
            <p className="text-sm text-zinc-400">Processing file...</p>
          </>
        ) : (
          <>
            <Upload
              className={`mb-3 h-10 w-10 ${isDragging ? 'text-red-500' : 'text-zinc-500'}`}
            />
            <p className="mb-1 text-sm font-medium text-zinc-300">
              Drop your file here, or{' '}
              <span className="text-red-400">browse</span>
            </p>
            <p className="text-xs text-zinc-500">
              Supports {ACCEPTED_EXTENSIONS.join(', ')} files
            </p>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * FileIcon Component
 *
 * Displays an appropriate icon based on file extension.
 */
function FileIcon({ fileName }: { fileName: string }) {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const iconClass = 'h-8 w-8 text-zinc-400';

  if (extension === 'txt') {
    return <FileText className={iconClass} />;
  }

  return <File className={iconClass} />;
}
