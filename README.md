# ticktock — Timesheet Management App

## Setup

1. Clone the repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in values
4. Run `npm run dev`
5. Open http://localhost:3000

## Login credentials (dummy auth)
- Email: john@example.com
- Password: password123

## Tech stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- next-auth (JWT sessions)

## Testing

Run `npm test` (or `npm run test:watch`).

Jest + React Testing Library, 44 tests in `__tests__/`:
- UI primitives — Button, Input, Modal, Dropdown, StatusBadge, Pagination
- Feature components — TimesheetTable, TimesheetFilters, AddEntryModal (validation + submit), LoginForm (validation, invalid credentials, redirect)
- Logic — date helpers and mock data shape

## Frameworks/libraries
- next-auth — authentication
- tailwindcss — styling
- Inter — font (Google Fonts)

## Assumptions
- Mock data is used instead of a real database
- All API calls go through internal Next.js API routes
- Sorting columns is visual only (arrows shown, not functional)
- List view is not implemented (table view only, as required)
- The Add Entry modal is wider than the base max-w-md to match the Figma design
- The week progress bar uses one inline width style — the percentage is dynamic and cannot be a static Tailwind class

## Time spent
- ~6 hours

## Project structure
- `app/` — Next.js pages and API routes
- `components/ui/` — reusable UI primitives
- `components/timesheets/` — timesheet-specific components
- `components/auth/` — login form
- `lib/` — mock data and auth config
- `types/` — TypeScript interfaces
- `__tests__/` — Jest + React Testing Library test suite
