# Work Pod — End-User Web Interface

A **React + TypeScript + Vite** web app that lets authenticated users search workpods, see availability, and book/cancel reservations.

This README is written so someone new can continue the project confidently.

> **TL;DR**
> - Tech: React ^19.1.0 + React Router, Vite, TypeScript, TanStack Query, i18next, Google OAuth.
> - API base URL: `import.meta.env.VITE_BACKEND_URL`
> - Auth: Google OAuth → stores ID token in `localStorage.authToken` → sent as `Authorization: Bearer <token>` by Axios client.
> - Start: `npm i && npm run dev`

---

## App overview

**Routes & pages** (see `src/App.tsx` and `src/components/*Page`):

- `/` → redirect to `/dashboard` or `/login` depending on auth.
- `/login` → **LoginPage** (Google OAuth button).
- `/dashboard` → **DashboardPage** (protected) – upcoming reservations.
- `/search` → **Search** component (in-page search UI).
- `/search/results` → **SearchResults** – available pods/slots.
- `/workpods` → **Workpods** – list all pods.
- `/workpod/:calendarId` → **Workpod** – details & calendar view.
- `/reservations` → **ReservationsPage** (protected) – user’s bookings.
- `/reservations/:calendarId/:reservationId` → **ReservationInfoPage** – booking details.
- `/info` → **InfoPage** – app info and guidance.
- Fallback → 404 via `NotFound` component.

Global UI: **Navbar** + **NavMenu** + **PageWrapper**; **ProtectedRoute** guards private routes.

## Architecture

- **React + Vite** entry: `src/main.tsx`
  - Providers: `GoogleOAuthProvider` (`VITE_GOOGLE_CLIENT_ID`), `QueryClientProvider` (TanStack Query), `BrowserRouter`, custom `AuthProvider`.
- **Auth**: `src/auth/*`
  - `AuthProvider` keeps `user` + `token`, persists to `localStorage`, auto‑logout on token expiry, exposes `onLogin`/`onLogout`.
  - `authUtils.ts` decodes Google ID token and computes expiration.
- **HTTP**: `src/api/client.ts` (Axios instance)
  - `baseURL: import.meta.env.VITE_BACKEND_URL`
  - `Authorization: Bearer <localStorage.authToken>` header.
- **API modules**:
  - `src/api/workpods.ts`
    - `GET /calendars` → list pods.
    - `GET /events?calendarId={id}&timeMin={iso}&timeMax={iso}` → events for a pod.
  - `src/api/reservations.ts`
    - `POST /book` with `{ calendarId, start, end }` JSON body
    - `DELETE /cancel/{calendarId}/{reservationId}`
    - `GET /user-events` → user’s bookings
    - `GET /booking/{calendarId}/{reservationId}` → booking info
- **Data & caching**: TanStack Query hooks in `src/hooks/` (e.g., `useWorkpods`, `useWorkpodCalendar`, `useReservations`, `useDeleteReservation`).
- **i18n**: `src/i18n.ts` with locale files in `src/locales/en.json` and `fi.json`; language switch in Navbar.
- **Utilities**: `src/utils/*` – date formatting, slot generation, token helpers, etc.
- **Styling**: Basic CSS (`src/index.css`) and assets under `src/assets/`.

## Folder structure

```
app/
├── public/
├── src/
│   ├── api/                 # axios client + endpoint wrappers
│   ├── assets/              # images/fonts/icons
│   ├── auth/                # context, utils, types
│   ├── components/          # pages + shared components
│   ├── hooks/               # data hooks (TanStack Query)
│   ├── locales/             # en.json, fi.json
│   ├── types/               # shared TS types
│   ├── utils/               # date/formatting/helpers
│   ├── App.tsx              # routes
│   └── main.tsx             # app bootstrap
├── index.html
├── vite.config.ts
└── package.json
```

## Configuration

Create `.env` in `app/` (same dir as `package.json`):

```bash
# Backend base URL (served by your API)
VITE_BACKEND_URL=https://your-backend.example.com

# Google OAuth Web Client ID
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

> After changing `.env`, stop and restart `npm run dev` so Vite picks up new env values.

## Getting started

```bash
cd app
npm install
npm run dev           # http://localhost:5173
```

### Other scripts

From `package.json`:

- `npm run build` → type-check + Vite build
- `npm run preview` → preview production build
- `npm run lint` → ESLint
- `npm run test` → Vitest
- `npm run check-translations` → verify `fi.json` matches keys in `en.json`

## API details

Headers are set automatically by `api/client.ts`:

```
Authorization: Bearer <localStorage.authToken>
```

Typical flows:

- **List workpods** → `GET /calendars`
- **Get events for a pod** → `GET /events?calendarId={id}&timeMin={iso}&timeMax={iso}`
- **Book** → `POST /book` with JSON body `{ calendarId, start, end }`
- **Cancel** → `DELETE /cancel/{calendarId}/{reservationId}`
- **My reservations** → `GET /user-events`
- **Booking info** → `GET /booking/{calendarId}/{reservationId}`

Time parameters are ISO strings; helpers like `utils/formatDate.ts` and `utils/dateTime.ts` are used to build them.

## Internationalization

- Source of truth: `src/locales/en.json`
- Add/rename keys there first, then mirror in `fi.json`.
- Run `npm run check-translations` before committing; the script fails on missing keys.

## Testing

- Unit tests with **Vitest**. Add tests alongside code or under `src/**/__tests__`.
- For components, consider adding React Testing Library.

## Deployment

- Static build with `npm run build` produces `dist/`.
- Serve via any static host (Nginx, Netlify, Vercel). Ensure environment variables are baked at build time.

## Common contributor tasks

- **Add a new page**: create a component under `src/components/YourPage`, wire a route in `App.tsx`, and update navigation.
- **Add a new endpoint**: extend `src/api/*.ts`, export a hook in `src/hooks/`, and consume in a page.
- **Add a locale string**: update `en.json`, mirror in `fi.json`, run `npm run check-translations`.
- **Adjust slot generation**: see `utils/generateFreeSlots.ts` and `hooks/useWorkpodCalendar.ts`.

## Troubleshooting

- **401 after login**: check `VITE_GOOGLE_CLIENT_ID` and backend token validation rules.
- **Requests missing auth**: confirm `localStorage.authToken` is present; login again to refresh.
- **Wrong base URL**: set `VITE_BACKEND_URL` and restart `npm run dev`.
- **Translation key shows raw text**: run `npm run check-translations` and update missing keys.

---

### Dependency snapshot

**Dependencies**
- **@fullcalendar/react**: ^6.1.17
- **@fullcalendar/timegrid**: ^6.1.17
- **@react-oauth/google**: ^0.12.2
- **@tanstack/react-query**: ^5.79.0
- **@yudiel/react-qr-scanner**: ^2.3.1
- **axios**: ^1.9.0
- **date-fns**: ^4.1.0
- **i18next**: ^25.2.1
- **jwt-decode**: ^4.0.0
- **react**: ^19.1.0
- **react-datepicker**: ^8.4.0
- **react-dom**: ^19.1.0
- **react-i18next**: ^15.5.2
- **react-icons**: ^5.5.0
- **react-router**: ^7.6.1

**DevDependencies**
- **@eslint/js**: ^9.25.0
- **@testing-library/jest-dom**: ^6.6.3
- **@testing-library/react**: ^16.3.0
- **@testing-library/user-event**: ^14.6.1
- **@types/jest**: ^29.5.14
- **@types/react**: ^19.1.2
- **@types/react-dom**: ^19.1.2
- **@vitejs/plugin-react**: ^4.4.1
- **eslint**: ^9.25.0
- **eslint-plugin-react-hooks**: ^5.2.0
- **eslint-plugin-react-refresh**: ^0.4.19
- **globals**: ^16.0.0
- **jsdom**: ^26.1.0
- **typescript**: ~5.8.3
- **typescript-eslint**: ^8.30.1
- **vite**: ^6.3.5
- **vite-tsconfig-paths**: ^5.1.4
- **vitest**: ^3.2.1

---

_Updated: 2025-08-28_
