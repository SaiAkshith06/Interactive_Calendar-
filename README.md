# Interactive Calendar Challenge

A wall-calendar inspired monthly planner built in Next.js. The interface uses the reference image embedded in the original challenge document as the visual source, then layers on interactive date-range selection and browser-persisted notes.

## What It Includes

- Date range selection with clear start, end, and in-range states
- Month navigation
- Notes attached to the active range
- Local persistence with `localStorage`
- Responsive layout that keeps the hanging calendar composition on desktop and collapses cleanly on mobile

## Design Direction

The challenge brief called for a physical wall-calendar aesthetic with a prominent image, a notes section, and a functional calendar grid. Instead of building a generic app shell, this version treats the whole page like a printed monthly sheet:

- the extracted reference artwork anchors the top panel
- bold month labeling sits in a ribbon area similar to the attachment
- notes live in the lower left column
- the interactive calendar grid lives in the lower right column

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Production Check

```bash
npm run build
```

## Notes

- Notes are intentionally stored client-side because the brief asked for a strictly frontend solution.
- The app starts with today selected as the default active range.
- Clicking once starts a range. Clicking again completes it. Clicking a new date after a completed range starts over.
