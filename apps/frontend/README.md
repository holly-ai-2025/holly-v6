# Frontend

## Overview
The frontend is built with React, Vite, and MUI (Core + Joy UI). It communicates with the backend through a unified API client (`src/lib/api.ts`).

## API Client
- Location: `src/lib/api.ts`
- All API calls **must** use this client. Do not import `axios` directly in components.
- Development:
  - Base URL: `http://localhost:8000`
- Production (Vercel):
  - Base URL: `VITE_API_URL` (must be set in Vercel environment variables)
- Automatically attaches the header:
  ```
  ngrok-skip-browser-warning: true
  ```
  This ensures ngrok does not inject its browser warning page.

### Debugging API Requests
- Every API request is logged to the browser console:
  ```
  [API Request] https://<ngrok>.ngrok-free.app /db/tasks {...headers}
  ```
- If you see requests as relative paths (e.g. `/db/tasks`), it means `VITE_API_URL` was not set in production.
- If `VITE_API_URL` is missing, an error is logged:
  ```
  [API] Missing VITE_API_URL in production build!
  ```

## Logging
- Console logs are forwarded to a log server.
- Development: `http://localhost:9000/log`
- Production: `VITE_LOG_SERVER_URL`

## Development Setup
1. Start backend: `hypercorn apps/backend/main.py`
2. Start log server: `scripts/log_server.js`
3. Run frontend: `npm run dev`
4. Expose backend with ngrok: `ngrok http 8000`

## Notes
- Do **not** set axios defaults in `main.tsx`.
- Always import the API client:
  ```ts
  import api from "../lib/api";
  ```
- This ensures consistent headers and base URL handling across all requests.