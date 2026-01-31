'use client';

import type { FontFamily } from '@/types';

interface FontSelectorProps {
  value: FontFamily;
  onChange: (font: FontFamily) => void;
}

const FONT_OPTIONS: { value: FontFamily; label: string; shortcut: string }[] = [
  { value: 'mono', label: 'Mono', shortcut: '1' },
  { value: 'sans', label: 'Sans', shortcut: '2' },
  { value: 'serif', label: 'Serif', shortcut: '3' },
];

/**
 * FontSelector Component
 *
 * Provides a toggle group for selecting the reader font family.
 */
export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-zinc-500">Font</span>
      <div
        className="flex rounded-lg bg-zinc-800 p-1"
        role="radiogroup"
        aria-label="Font family"
      >
        {FONT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            aria-checked={value === option.value}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              value === option.value
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-300'
            }`}
            title={`${option.label} font (${option.shortcut})`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
