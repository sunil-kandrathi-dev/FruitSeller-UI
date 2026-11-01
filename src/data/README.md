# Data and API boundary

Each feature owns its API module and data types under `src/features/<feature>/api/`. The shared `src/data/api/` folder contains only cross-feature HTTP and resource helpers. Pages should call their feature API module rather than calling `fetch` directly. The shared HTTP client handles the API base URL, JSON headers, abort signals, empty responses, and HTTP errors.

Local development uses `https://localhost:7040/api` from `.env.development`. If the local HTTPS certificate is unavailable, set `VITE_API_BASE_URL=http://localhost:5159/api` in `.env.development.local` (that file is ignored by git). Resource paths append to the base URL, so `/purchases` requests `https://localhost:7040/api/purchases`.

Configured endpoint paths are `GET`/`POST /fruits`, `/shops`, `/purchases`, `/sales`, `/payments`, and `/expenses`, plus `GET /reports` and `GET /dashboard`. Health checks are available at `/health/live` and `/health/ready` on the backend host; the UI does not currently poll them.

When the backend is available:

1. Set `VITE_API_BASE_URL` (see `.env.example`).
2. Match the endpoint paths and record shapes in the relevant feature's `api/` files to the backend contract.
3. Keep the backend response shapes aligned with the feature types. Collection GET endpoints must return arrays, and POST endpoints must return the created record. Pages use the returned record to update the UI and show loading/error states.

Fruits, shops, purchases, sales, payments, and expenses pages now load with `list()` and save with `create()`. Reports and dashboard load from their GET endpoints. IDs are supplied by the server. `dashboardContent.json` contains only presentation copy for dashboard quick actions, not business records.
