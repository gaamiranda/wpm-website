# RSVP Speed Reader

A minimalist, dark-mode web application for speed reading using **Rapid Serial Visual Presentation (RSVP)** with **Optimal Recognition Point (ORP)** highlighting.

## Features

- **RSVP Display** - Words appear one at a time at your chosen speed (100-1000 WPM)
- **ORP Highlighting** - The optimal focus point of each word is highlighted in red and centered, minimizing eye movement
- **File Support** - Upload `.txt` files
- **Smart Pausing** - Automatic pauses on punctuation (sentences, clauses) for better comprehension
- **Font Options** - Choose between Monospace, Sans-serif, or Serif fonts
- **Focus Guide** - Optional vertical guide lines to help focus on the ORP
- **Keyboard Shortcut** - Press Space to play/pause
- **Settings Persistence** - Your preferences are saved locally

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Keyboard Shortcut

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |

## How It Works

### Optimal Recognition Point (ORP)

The ORP is the character in a word where your eye naturally focuses for optimal recognition. It's typically located slightly left of center (around 35% into the word). By highlighting this pivot character in red and keeping it fixed in the center of the screen, your eyes don't need to move - the words come to you.

### Punctuation-Aware Timing

The reader automatically adjusts timing based on punctuation:
- **Sentence endings** (`.` `!` `?`) - 1.5x pause
- **Clause breaks** (`,` `;` `:`) - 1.25x pause
- **Paragraph breaks** - 2x pause

This mimics natural reading rhythm and improves comprehension at high speeds.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                  # Next.js App Router
├── components/
│   ├── controls/         # Playback, speed, font controls
│   ├── reader/           # Word display, progress bar
│   └── upload/           # File upload component
├── hooks/                # Custom React hooks
│   ├── useRSVPEngine.ts  # Core timing engine
│   ├── useFileProcessor.ts
│   ├── useKeyboardShortcuts.ts
│   └── useSettings.ts
├── lib/                  # Utilities
│   ├── orp.ts            # ORP calculation
│   └── textProcessor.ts  # Text tokenization
└── types/                # TypeScript definitions
```
