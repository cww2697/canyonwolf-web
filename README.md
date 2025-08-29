# Canyon Wolf — Personal Site & Projects

[![Deploy to Pages](https://github.com/cww2697/canyonwolf-web/actions/workflows/nextjs.yml/badge.svg)](https://github.com/cww2697/canyonwolf-web/actions/workflows/nextjs.yml)

A Next.js (App Router) site for Canyon Wolf — showcasing projects, experiments, and write‑ups. Notable tools include a Call of Duty Statistics Visualizer that lets you import your Activision SAR Multiplayer Statistics and view trends like Skill and K/D over time.

## Goals
- Provide a clean, fast personal website and home for projects.
- Host small interactive tools (e.g., COD Stats) with a good UX (dark mode, responsive design).
- Share code openly so others can learn or extend the tools.

## Features
- Next.js 15 App Router with React 19.
- Tailwind CSS 4 for styling.
- Fixed top navigation with project menu.
- COD Stats tool:
  - CSV import from Activision SAR “Multiplayer Statistics”.
  - Interactive chart for Skill and K/D Ratio.
  - Hover tooltip with UTC timestamp and values.
  - Per-metric min/avg/max and best‑fit line with linear equation.
  - Export filtered/sorted data as CSV.
- Accessible, keyboard-friendly UI where possible.

## Tech Stack
- Next.js 15, React 19
- TypeScript
- Tailwind CSS 4
- GitHub Actions (Deploy to Pages)

## Getting Started (Local Development)
Prereqs:
- Node.js 20+
- npm (or yarn/pnpm/bun)

Install dependencies:
```bash
  npm install
```

Run the dev server:
```bash
  npm run dev
```

Build for production:
```bash
  npm run build
```

Start the production server (after build):
```bash
  npm run start
```

## Project Structure
- src/app — App Router pages and layout
  - src/app/page.tsx — About page (home)
  - src/app/projects/cod-stats — COD Stats tool (page + components)
- src/components — Shared UI (e.g., TopNav)
- public — Static assets

## Scripts
- dev: next dev --turbopack
- build: next build --turbopack
- start: next start
- lint: eslint
- test: vitest run
- test:watch: vitest

## COD Stats CSV Notes
Prepare a CSV from your Activision SAR export:
- Open your SAR HTML export and find the “Multiplayer Statistics” table.
- Copy the full table, including the header row, into Excel or Google Sheets.
- Save or download as CSV.

Required columns include UTC timestamp, Kills, Deaths, and Skill. Extra columns are ignored.

## Deployment
This repo includes a GitHub Actions workflow to build and deploy to GitHub Pages. The badge above reflects the latest workflow status.

## License

All rights reserved. This project and its source code are protected by copyright law. For licensing inquiries or usage
permissions beyond what is explicitly granted in specific project pages or repositories, please contact myself
directly.

## Repository
GitHub: https://github.com/cww2697/canyonwolf-web
