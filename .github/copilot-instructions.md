# Copilot instructions for ASVS-Serviteur

## Project overview

- Single-page React + TypeScript app built with Vite; no backend and all state is local to the browser.
- Data source is the bundled OWASP ASVS JSON in src/data/OWASP_Application_Security_Verification_Standard_5.0.0_en.json.
- UI has three main screens in App.tsx: Projects (create/load), Audit (checklist), Report (printable report via ?report=true).
- Local persistence uses a React context provider in src/lib/localStorageProvider.tsx with the key "ASVSServiteurData".
- Tailwind CSS is used for styling; base styles live in src/index.css and theme in tailwind.config.js.

## Data flow and key patterns

- App chooses view based on URL query param "report" and whether local storage has data.
- Projects creates a new project or loads JSON, then stores it in localStorage.
- Audit reads data, builds initial progress from helpers, and writes results back on each change.
- Report builds a printable summary and radar chart using helpers in src/lib/reportHelpers.ts and chart.js.
- Export uses a data URL download for the current project JSON (see src/components/navbar/fileExport.tsx).

## Dev workflows

- Install: npm install
- Dev server: npm run dev
- Build: npm run build (tsc -b then vite build)
- Lint: npm run lint
- Preview build: npm run preview

## Project-specific conventions

- Helpers for ASVS filtering and initial result generation are in src/lib/helpers.ts.
- Progress and NA logic are derived from ASVS shortcodes; keep shortcodes stable when changing data or UI.
- Report view is print-optimized with print-only styles and page breaks defined in src/index.css.
- Vite base path is set to /ASVS-Serviteur/ for GitHub Pages (see vite.config.ts).
