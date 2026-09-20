# Interview Prep Tracker

A personal study/interview-prep tracker for a 6-month Java backend →
product company prep plan (Oct 2026 – Mar 2027). Fully client-side —
all progress and notes are stored in your browser's `localStorage`.
No backend, no database, no accounts.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui (Base UI primitives)
- localStorage persistence only — deployable as a static site

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Building for production

```bash
npm run build     # outputs a static bundle to dist/
npm run preview   # preview the production build locally
```

The `dist/` folder is a fully static site — deployable to GitHub Pages,
Vercel, Netlify, or any static host.

## Features

- **Dashboard** — overall progress ring, per-category progress bars,
  and a "this month's focus" card driven by today's date.
- **Categories** — pick a category, expand each month, toggle status
  and priority per topic, and jot revision notes (autosaves ~500ms
  after you stop typing).
- **Timeline** — Oct 2026 → Mar 2027 at a glance, flags months that
  are already past but incomplete as "Behind schedule".
- **Search** — filter by status / category / month / priority, or
  full-text search across titles and notes.
- **Export/Import** — download all progress + notes as a JSON backup,
  and restore it later (this is the only backup mechanism, since
  there's no backend).
- **Light/dark theme** and **last-viewed tab**, both persisted.

## Data model

Topics are seeded once from `src/data/seed.ts` on first load. After
that, everything is read from `localStorage` — the seed is never
used to overwrite your saved progress. If the seed list ever grows in
a future update, newly added topics are merged in without touching
your existing progress.
