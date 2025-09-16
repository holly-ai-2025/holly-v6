# Frontend (React + Vite + MUI)

## Overview
The frontend is a React app using Vite, Material UI (MUI), and FullCalendar. It communicates with the backend via API wrapper functions in `src/api/`.

---

## API Usage Rules

⚠️ **Golden Rule:** Components must **never call backend endpoints directly**. All API calls must flow through the wrapper files in `src/api/`. These wrappers are the **source of truth** for frontend–backend communication.

### Wrapper Architecture
- Each entity has its own wrapper: `tasks.ts`, `items.ts`, `projects.ts`, `phases.ts`, `groups.ts`, `boards.ts`.
- Wrappers always expose a consistent set of functions:
  - `get<Entity>()`
  - `create<Entity>(payload)`
  - `update<Entity>(id, payload)`
  - `delete<Entity>(id)` → ⚠️ For tasks this is now a **soft delete** (see below).
- Wrappers normalize backend data before returning to components:
  - All returned objects include both the backend’s `*_id` (e.g. `task_id`) **and** a normalized `id` field.
  - All fields are standardized into **camelCase** for frontend use.
  - Example: `{ task_id: 42, id: 42, taskName: "Example", dueDate: "2025-09-13" }`
- Each wrapper defines a **TypeScript interface** (e.g. `Task`, `Item`) that all components must use. This ensures consistent field names across the app.
- Components must **always use camelCase field names** and `.id`.

### Multi-Entity Pages
Some content pages need to query multiple tables (e.g. Projects + Tasks + Phases). That’s expected, but the rule still applies:
- Import only from the relevant wrappers.
- Never hardcode `/db/...` calls in components.
- Always consume normalized objects with TypeScript interfaces.
- Example:
  ```ts
  import { getProjects } from "../api/projects";
  import { getTasks } from "../api/tasks";
  import { getPhases } from "../api/phases";

  export async function loadDashboard() {
    const projects = await getProjects();
    const tasks = await getTasks();
    const phases = await getPhases();
    return { projects, tasks, phases };
  }
  ```

This guarantees that all content pages use a **single consistent integration style**.

---

## Task Fields
Tasks returned by backend include (after normalization):
- `id` (normalized from `task_id`)
- `name` (task_name)
- `description`
- `dueDate`
- `startDate`
- `endDate`
- `status`
- `priority`
- `category`
- `tokenValue`
- `urgencyScore`
- `effortLevel`
- `boardId`, `groupId`, `projectId`, `phaseId`
- `archived`
- `pinned`

---

## Components

### TaskDialog (`src/components/TaskDialog.tsx`)
- Handles task create/edit/delete.
- Parent decides whether to POST (new) or PATCH (update).
- **Delete button performs soft delete** (sets `archived = true` instead of removing from DB).
- **Sliders:**
  - Priority: Low → Urgent (4 steps).
  - Effort: Low → High (3 steps).
  - Reward Tokens: 5 → 20 (step 5).
- **Date/Time fields:**
  - Due Date = required.
  - Start Time = optional (enabled once due date selected).
  - End Time = defaults to start +1h, editable, disabled until Start Time is set.
  - Backend payload:
    - `dueDate` = date only.
    - `startDate` = ISO datetime.
    - `endDate` = ISO datetime.
- **UI Enhancements:**
  - Sliders use colored gradients.
  - Status buttons are color-coded: Todo (blue), In Progress (orange), Done (green).
  - "New Task" header removed.
- Syncs local state with DB task props when dialog is opened.

### TabTasks (`src/tabs/TabTasks.tsx`)
- Uses `getTasks` to list tasks.
- Uses `updateTask` when saving edits.
- Groups tasks by due date, priority, or status consistently.
- ⚠️ Currently still shows archived tasks — future update will filter them out.

### TabCalendar (`src/tabs/TabCalendar.tsx`)
- Uses FullCalendar for drag/create/edit.
- Only Calendar persists tasks → avoids duplicate saves.
- Maps `status → className` for color coding.
- Requires each task to include `.id` (from wrapper normalization).
- Single-click, drag, and resize all route through TaskDialog.

---

## Development
Run frontend with:
```bash
scripts/start-dev.sh
```

Logs:
- `logs/frontend-console.log` → browser console output

---

## Adding New Fields (Frontend Workflow)
When backend adds a new field:
1. Update API wrapper type definitions (`api/<entity>.ts`).
   - Add the field to the **TypeScript interface**.
   - Normalize field names into **camelCase**.
2. Update normalization functions in the wrapper.
3. Update components (e.g. TaskDialog, TabTasks, TabCalendar) to show/edit/use the field.
4. Add sensible defaults for new fields (avoid breaking existing forms).
5. Update this README to document the new field.

---

## Adding New Entities (Frontend Workflow)
When backend introduces a new table/entity:
1. Create a new wrapper in `src/api/<entity>.ts`.
   - Implement `get<Entity>, create<Entity>, update<Entity>, delete<Entity>`.
   - Normalize `*_id → id`.
   - Define a TypeScript interface for the entity.
   - Normalize all field names to **camelCase**.
2. Import wrapper functions into new content pages.
3. Components must always reference `.id` and camelCase field names for consistency.
4. Update this README to document the entity and its fields.