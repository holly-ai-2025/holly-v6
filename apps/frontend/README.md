# Frontend (Holly v6)

## TaskDialog Updates

### Sliders
- **Priority**, **Effort**, and **Tokens** use custom gradient sliders.
- Value is shown on the right of each slider.
- Spacing reduced for a tighter layout.

### Input Fields
- All input fields, selectors, and dropdowns are standardized to **42px height**.
- Description field allows multiline input.

### Date & Time
- Task supports a **Due Date**, **Start Time**, and **End Time**.
- When a Start Time is entered, End Time auto-fills to +1 hour (editable).
- Tasks cannot span multiple days (end date = start date).

### Status Toggles
- Task status is controlled by a **ToggleButtonGroup**:
  - **Todo** → Blue
  - **In Progress** → Orange
  - **Done** → Green

### Connections Section
- Shown inside a styled accordion with **grey header + white text**.
- Contains dropdowns for **Board**, **Phase**, and free-text **Category**.

### Notes Section
- New accordion below Connections.
- Supports long-form notes via multiline text input.
- Includes placeholder **Attach Files** button (disabled for now).
- `notes` field is included in the payload (backend support TBD).

### Delete Behavior
- Deleting a task triggers a soft delete (archives it).
- Archived tasks are still fetched until filtering is added in `TabTasks.tsx`.

---

## Task Management

### Archived Tasks
- Tasks marked as deleted are **soft deleted** → stored with `archived = true`.
- `TabTasks.tsx`, `TabCalendar.tsx`, and `TabBoards.tsx` filter out archived tasks in their `fetchTasks()` implementations.
- This ensures deleted tasks no longer appear in active task views, but remain in DB.
- If a future “Archive” tab is built, it should skip the filter so archived tasks are visible.

### Delete Support
- `TaskDialog` supports `onDelete`, which calls `deleteTask()` and refreshes tasks.
- Each tab passes `handleDialogDelete` into `TaskDialog`.
- Deletion is always **soft** (sets `archived = true`), never hard deletes.

### Consistency
- Each tab (`TabTasks`, `TabCalendar`, `TabBoards`) has its own `fetchTasks()` implementation, all must include the `!t.archived` filter.
- Do not move the filter into `api/tasks.ts`, since we may want an “Archived view” later.

---

## Development Notes
- All UI built with **MUI Core + Joy UI**.
- Ensure no other UI libraries are introduced.
- Styling changes should use `sx` props or `styled()` from MUI.
- ✅ Obsolete Tailwind UI components (`Card.tsx`, `NavItem.tsx`) were removed.
- Repo is now fully compliant with the MUI-only rule.