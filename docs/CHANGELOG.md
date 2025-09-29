# Holly v6 Changelog

This file tracks **all schema and API changes** to keep frontend and backend in sync.
Updates must be logged here **whenever models, schemas, or routes change**.

---

## 2025-09-29
- Added: `archived` column to **boards** (soft delete now supported).
- Clarified: **Soft delete** only implemented for tasks + boards.
- Deprecated: `goal` field in **projects** (still present in schema, ignored in DB).
- Deprecated: `goal` field in **boards** (schema only, not stored).
- Added: Schema evolution workflow to backend README (manual SQL migrations, clear `__pycache__`).
- Added: Primary key conventions section to backend README.
- Added: Route contract table to backend README.
- Added: Curl examples for tasks, boards, and activity log.

## 2025-09-18
- Extended Task payload to support:
  - `notes` (text, nullable)
  - `token_value` (integer, nullable)
  - `effort_level` (string, nullable)
- Updated TaskDialog in frontend (TabTasks + TabCalendar) to include new fields.
- Standardized soft delete handling across tabs (frontend filtering on `!t.archived`).

## 2025-09-10
- Removed obsolete Tailwind UI components (`Card.tsx`, `NavItem.tsx`).
- Enforced MUI Core + Joy UI only for frontend.
