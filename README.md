# Interactive Calendar

A wall-calendar inspired monthly planner built with Next.js. This submission takes the visual direction from the challenge prompt and turns it into a polished, interactive frontend experience with seasonal imagery, responsive note-taking, and a more product-focused presentation.

## What It Includes

- Date range selection with clear start, end, and in-range states
- Month navigation
- Notes attached to the active range
- Local persistence with `localStorage`
- Responsive layout that keeps the hanging calendar composition on desktop and collapses cleanly on mobile

## How To Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

For a production check:

```bash
npm run build
```

## Design Choices

The challenge brief asked for a wall-calendar inspired component with a strong visual anchor, usable notes, and responsive behavior. I interpreted that as an opportunity to build a premium editorial planner rather than a plain utility calendar.

- The top section uses large seasonal artwork so the experience feels closer to a printed monthly calendar than a generic dashboard widget.
- The lower section separates scheduling and note-taking into two clear working zones: calendar on the left, note creation and saved notes on the right.
- The month rail supports quick navigation without interrupting the overall composition.
- Typography, spacing, and interaction polish were kept restrained so the interface feels modern and deliberate rather than overly decorated.

## Typography

The project uses a paired font system to balance editorial character with clean UI readability:

- `Merriweather` for the main display typography such as the page title, month name, and key section headings
- `Be Vietnam Pro` for body copy, controls, labels, and supporting interface text

This combination helps the component sit between a designed print object and a modern product interface.

## Color Palette

The final light-mode interface uses a restrained neutral palette for the UI while allowing the monthly artwork to remain expressive:

- `#444040` for primary dark text and strong surfaces
- `#69625E` for accents and selected states
- `#89898B` for muted interface tones
- `#C2C0BE` for soft panels and subtle highlights

There is also a dedicated dark mode with a deeper atmospheric palette inspired by:

- Ashes
- Light Charcoal
- Dryad Bark
- Black Kite
- Existential Angst

The overall goal was to keep the UI calm and minimal while letting the imagery and seasonal atmosphere provide personality.

## Notes Experience

The notes workflow was designed to support both quick capture and more deliberate planning:

- By default, selecting a date creates a single-day note context
- Users can switch into a multi-day mode only when needed
- Multi-day mode supports selecting a start and end date, plus clearing the active date selection
- Saved notes are persistent through `localStorage`
- Saved notes have a three-dot menu with `Star` and `Delete`
- Starred notes visually highlight their related day or range in the calendar
- Single-day notes show a small inline preview directly inside their calendar cell

## Extra Features Added

Beyond the core brief, I added several enhancements to make the submission feel more complete and polished:

- Light mode and dark mode
- Seasonal ambient effects in the surrounding empty space
- spring petals
- summer glow
- autumn leaves
- winter snow
- Month-specific nature artwork instead of a single reused image
- Local caching of the month artwork for faster loading
- A fixed-height saved-notes panel with internal scroll so the main layout stays stable
- More refined interaction states for buttons and calendar cells

## Responsiveness

The layout is designed to adapt without losing the core interaction model:

- On wider screens, the hero image, calendar, and notes area are all visible at once
- On smaller screens, the layout stacks while keeping the note creation flow and calendar selection usable
- The seasonal background effects are reduced or removed on smaller viewports so they do not interfere with usability

## Technical Notes

- Notes are intentionally stored client-side because the brief asked for a strictly frontend solution.
- Fonts are loaded from local packages rather than Google-hosted runtime fetching so the project builds reliably offline.
- Monthly artwork is stored locally in `public/months` for better performance and predictable rendering.
- The calendar always renders a full 6-week grid so the layout remains visually stable across months.
