# Holly v6 Frontend

## Task & Calendar System

### Date Handling
We use **Day.js** with strict parsing for all date/time operations. 
Custom helpers live in `src/utils/dateUtils.ts`:
- `parseDateSafe(dateStr)` → safely parses API or UI date strings, defaults to today if invalid.
- `formatForApi(date)` → converts a date to ISO `YYYY-MM-DD`.
- `formatDateTimeForApi(date)` → converts a datetime to `YYYY-MM-DDTHH:mm:ss`.

### Task Normalization
Located in `src/utils/taskUtils.ts`:
- `normalizeTaskForApi(task)` ensures all tasks are serialized consistently before API calls.
- Dates are always sent as ISO (for `due_date`) or ISO datetime (for `start_date` / `end_date`).
- The frontend **never** generates random years — invalid or missing dates are replaced with today.

### Known Fixes
- Fixed bug where tasks were showing with years like `1008` or `2508` due to loose parsing.
- Normalization layer enforces correct formats.
- Calendar and Task views now share the same utils for consistency.
- **Duplicate tasks in Calendar**: originally caused by both Calendar and TaskDialog POSTing.
  - Fixed by removing Calendar POSTs — only TaskDialog creates tasks.
  - Added `submitting` guard to TaskDialog to block double submits.

### Debugging
- To debug date issues: `console.log(task, normalizeTaskForApi(task))` before API call.
- If tasks do not appear in **Calendar**, confirm `due_date` is valid ISO `YYYY-MM-DD`.
- To debug duplicates: check frontend console for `[TaskDialog] POST payload` vs `[TabCalendar] POST payload`.
- Backend logs also capture POST payloads for confirmation.

### Adding New Task Fields
When extending tasks (e.g., adding priority, tags, etc.):
1. Update **backend**:
   - `models.py` → Add DB field.
   - `schemas.py` → Add field in `TaskBase` + validators if needed.
   - `main.py` → Ensure field is included in POST/PATCH routes.
2. Update **frontend**:
   - `src/api/tasks.ts` → Ensure payload includes new field.
   - `src/utils/taskUtils.ts` → Normalize new field if it’s a date or structured type.
   - `TaskDialog.tsx` → Add input field.
   - `TabTasks.tsx` / `TabCalendar.tsx` → Display field where relevant.

### Logs
Frontend logs are captured in `logs/frontend-console.log` via `scripts/log_server.js`. Always tail logs when testing changes:
```bash
tail -f logs/frontend-console.log
```