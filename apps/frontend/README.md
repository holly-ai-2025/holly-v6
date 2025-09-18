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

## Development Notes
- All UI built with **MUI Core + Joy UI**.
- Ensure no other UI libraries are introduced.
- Styling changes should use `sx` props or `styled()` from MUI.
- ✅ Obsolete Tailwind UI components (`Card.tsx`, `NavItem.tsx`) were removed.
- Repo is now fully compliant with the MUI-only rule.
