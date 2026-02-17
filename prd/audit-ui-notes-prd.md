# Audit UI Compact Layout PRD

## Overview

Redesign the Audit checklist layout to be more compact and data-dense while preserving fast scanning and editability. This includes widening the main content, tightening row spacing, and simplifying note interactions to a compact icon button that expands an inline editor row.

## Goals

- Make the audit list faster to scan and faster to fill in.
- Reduce vertical and horizontal whitespace while keeping readability.
- Keep controls aligned in consistent columns for quick comparison.
- Provide a low-friction note workflow without a dedicated Notes column.

## Non-Goals

- No backend persistence changes.
- No redesign of Projects or Report views.
- No changes to ASVS data source structure.

## Summary of Changes (Original -> Mocked Layout)

- Main content width increased with less page padding; layout becomes fluid on very large screens.
- Control rows become more compact: smaller padding, tighter metadata tags, reduced ID column width.
- Status selector expanded to include a Partial state.
- Status pill aligned with the Status label to reduce vertical height.
- Notes column removed; note interaction moves next to status selector with inline editor row below.

## UX Requirements

- Each control row shows: ID, description, metadata tags, status selector group, note icon button.
- The note icon button is immediately to the right of the status selector group.
- If a note exists, display the note editor row expanded by default below the control row.
- If no note exists, the editor row is hidden until the note icon is clicked.
- The editor is a textarea (multi-line, wraps long text). Minimum height 4 lines; scroll after max height.
- Provide Save and Cancel actions within the editor row.
- Cancel closes the editor without changing saved note state.
- Save updates the note value and collapses the editor row.
- Status selector group includes: Compliant, Non-compliant, Partial, N/A.

## Visual and Layout Requirements

- Remove the Notes column from the control row grid.
- Keep row height compact; avoid extra vertical padding.
- Align the Status label at the start and the status pill at the end of the same row.
- Keep the status selector group on a single row; the note icon button is aligned to its right.
- The inline editor row spans the full width of the control card and uses a subtle background/border for separation.
- Increase the main content max width and reduce margins; use fluid width on very large screens.

## Interaction and State

- For each control, maintain local UI state for note editor visibility.
- Editor visibility rules:
  - Open when the note icon is clicked.
  - Open by default when a note already exists.
  - Close when Save or Cancel is pressed.
- Persist notes using the existing `useLocalStorage` flow in `src/lib/localStorageProvider.tsx`.

## Accessibility

- Note icon button has an accessible label, e.g. `aria-label="Add note"` or `"Edit note"` based on state.
- Ensure textarea is focusable and receives focus when opened.
- Keyboard users can open notes via Enter/Space on the icon button.

## Acceptance Criteria

- Notes column removed from the control row layout.
- Note icon button present next to the status selector group.
- Editor row appears below the control when a note exists or when the icon is clicked.
- Save persists note and collapses editor; Cancel discards and collapses.
- Status selector supports Compliant, Non-compliant, Partial, N/A.
- Layout remains compact and aligned with the mock on `/test`.
