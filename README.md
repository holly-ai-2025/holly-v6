# Holly AI v6

## Overview
Holly AI is a development partner framework that provides both backend and frontend services. The backend runs on Hypercorn and provides REST API endpoints, while the frontend runs on Vite + React with MUI UI components.

## Backend
- Entrypoint: `apps/backend/main.py`
- Runs with Hypercorn on port `8000`
- Example endpoint: `http://localhost:8000/db/tasks`

## Frontend
- Entrypoint: `apps/frontend/src/main.tsx`
- Framework: Vite + React + MUI (Core + Joy UI)
- Uses a unified API client at `apps/frontend/src/lib/api.ts`

### API Client (Important)
- All frontend API requests **must** go through `lib/api.ts`.
- In development, requests are sent to `http://localhost:8000`.
- In production (Vercel), requests use `VITE_API_URL`.
- The client automatically includes the `ngrok-skip-browser-warning: true` header so ngrok does not block API calls.
- If `VITE_API_URL` is missing in production, an error will be logged: `[API] Missing VITE_API_URL in production build!`.
- The API client logs outgoing requests in the browser console:
  ```
  [API Request] https://<ngrok>.ngrok-free.app /db/tasks {...headers}
  ```
  Use this to confirm the app is targeting the ngrok backend and not falling back to relative paths.

### Logging
- Console logs (`console.log` and `console.error`) are forwarded to the backend log server.
- In development: `http://localhost:9000/log`
- In production: `VITE_LOG_SERVER_URL`

## Deployment
- Frontend: Vercel
- Backend: Local Hypercorn (exposed with ngrok during development)

### Environment Variables
Ensure the following are set in Vercel:
- `VITE_API_URL=https://<your-ngrok-subdomain>.ngrok-free.app`
- `VITE_LOG_SERVER_URL=https://<your-log-server-url>`

## Development Workflow
1. Start backend with Hypercorn: `hypercorn apps/backend/main.py`
2. Start log server: `scripts/log_server.js`
3. Run frontend: `cd apps/frontend && npm run dev`
4. Expose backend via ngrok: `ngrok http 8000`
5. Verify API requests and logs in the browser console.

---

This ensures all requests are routed correctly to the backend in both dev and production environments.