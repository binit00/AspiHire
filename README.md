# HireFlow

HireFlow is an AI-powered job application tracker with a Kanban-style workflow for managing job opportunities across stages like Wishlist, Applied, Phone Screen, Interview, Offer, and Rejected.

## Features
- Kanban board for tracking applications by stage
- Drag-and-drop job card movement
- Priority badges and status tagging
- Job detail modal and notes tracking
- Real-time updates planned with Socket.io
- Zustand for local UI state and React Query for server state
- Tailwind CSS styling and TypeScript support

## Tech Stack
- React + TypeScript
- Vite
- Zustand
- @tanstack/react-query
- @hello-pangea/dnd
- Socket.io-client
- Axios
- Tailwind CSS

## Project Structure
- `client/` — React frontend application
- `server/` — Node/Express backend services
- `client/src/` — frontend source code
- `client/src/components/` — reusable UI and feature components
- `client/src/hooks/` — custom hooks
- `client/src/services/` — API service layer
- `client/src/store/` — Zustand store slices

## Setup

### Install dependencies
```bash
cd client
npm install

cd ../server
npm install
```

### Run development servers
```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

## Notes
- Run the client and server in separate terminals.
- The frontend currently uses local sample data and can be wired to backend APIs via `src/hooks/useJobs.ts` and `src/services/job.service.ts`.
- Verify that `client` and `server` environment variables and API endpoints are configured correctly before connecting the backend.
