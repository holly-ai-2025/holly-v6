# Frontend (React + Vite + MUI)

## Overview
Frontend is built with:
- React + Vite
- MUI (Core + Joy UI)
- Axios for API requests (wrapped in `src/lib/api.ts`)
- Logs forwarded to `logs/frontend-console.log`

---

## API Usage Rules
- **All API calls must go through `src/lib/api.ts`**
- Do not call axios directly inside components
- `lib/api.ts` provides wrappers for GET, POST, PATCH, DELETE

### CRUD Examples
#### Create Board
```ts
await api.post("/db/boards", { name: "My Board", board_type: "project" });
```

#### Update Board
```ts
await api.patch(`/db/boards/${id}`, { archived: true });
```

#### Fetch Tasks
```ts
const tasks = await api.get("/db/tasks");
```

---

## Soft Delete
- All entities use `archived: boolean`
- Delete = PATCH `{ archived: true }`
- UI must filter out archived items

---

## Uniform CRUD Contract
All entities follow the same model pattern:
- `CreateModel` → POST
- `UpdateModel` → PATCH
- `ResponseModel` → GET

Each response includes:
- `id`
- `created_at`
- `updated_at`
- `archived`

---

## Dev Setup
Start with unified script:
```bash
scripts/start-dev.sh
```
- Frontend runs at `http://localhost:5173`
- Backend runs at `http://localhost:8000`

---

## Debugging API Errors
1. Open browser console (`logs/frontend-console.log` will mirror messages)
2. Check if API call is blocked by CORS
3. If 500 error → check `logs/backend-live.log`
4. Validate with curl:
   ```bash
   curl -X GET http://localhost:8000/db/tasks
   ```

---

## CORS in Dev
Backend allows all origins + explicit `ngrok-skip-browser-warning` header. This ensures ngrok + Safari/WebKit work.

---

## Contribution Rules
- Never use placeholders in code
- Always use `lib/api.ts` for requests
- When adding new entity:
  1. Ensure backend migration + models.py + schemas.py + main.py updated
  2. Add frontend API methods in `lib/api.ts`
  3. Update relevant tabs/pages
  4. Test with curl before UI integration