import type { WordToken } from '@/types';
import { tokenizeText } from './textProcessor';

/**
 * Dynamically imports PDF.js and configures the worker.
 * This is done dynamically to avoid SSR issues.
 */
async function getPdfJs() {
  const pdfjsLib = await import('pdfjs-dist');

  // Configure worker - use CDN for browser compatibility
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  return pdfjsLib;
}

/**
 * Extracts text content from a PDF file.
 *
 * Uses Mozilla's PDF.js library to parse PDF documents and extract
 * text from all pages, preserving paragraph structure where possible.
 *
 * @param file - PDF file to process
 * @returns Promise resolving to extracted text content
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await getPdfJs();

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Load PDF document
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const textParts: string[] = [];

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Combine text items, handling line breaks
    let lastY: number | null = null;
    const pageText: string[] = [];

    for (const item of textContent.items) {
      // Type guard for TextItem (has 'str' property)
      if ('str' in item && typeof item.str === 'string') {
        const text = item.str;

        // Check if we've moved to a new line (Y position changed significantly)
        if ('transform' in item && Array.isArray(item.transform)) {
          const currentY = item.transform[5];
          if (lastY !== null && Math.abs(currentY - lastY) > 5) {
            // New line detected
            pageText.push('\n');
          }
          lastY = currentY;
        }

        pageText.push(text);
      }
    }

    const pageTextJoined = pageText.join(' ').trim();
    if (pageTextJoined) {
      textParts.push(pageTextJoined);
    }
  }

  // Join pages with double newlines (paragraph breaks)
  return textParts.join('\n\n');
}

/**
 * Processes a PDF file into WordTokens.
 *
 * @param file - PDF file to process
 * @returns Promise resolving to array of WordTokens
 */
export async function processPDFFile(file: File): Promise<WordToken[]> {
  const text = await extractTextFromPDF(file);
  return tokenizeText(text);
}
