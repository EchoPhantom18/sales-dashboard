# Sales Dashboard

A fully functional sales dashboard with React frontend, Express backend, and Supabase database — styled after a modern hotel management dashboard UI.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Recharts
- **Backend:** Express.js REST API
- **Database:** Supabase (PostgreSQL)

## Quick Start

### 1. Set up Supabase tables

Open your [Supabase SQL Editor](https://supabase.com/dashboard) and run:

1. `supabase/schema.sql` — creates all tables and RLS policies
2. `supabase/seed.sql` — inserts sample sales data

Or seed via the API script after creating tables:

```bash
npm run setup-db --prefix server
```

### 2. Install dependencies

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Environment Variables

The `.env` file at the project root contains:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
PORT=3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | All dashboard data |
| GET | `/api/sales` | List sales (optional `?search=` and `?status=`) |
| POST | `/api/sales` | Create a new sale |
| GET | `/api/search?q=` | Search customers and deals |
| PATCH | `/api/tasks/:id` | Toggle task completion |
| POST | `/api/tasks` | Create a new task |

## Features

- Real-time metrics: New Orders, Leads Converted, Deals Closed, Revenue
- Sales Performance area chart (weekly)
- Sales by Channel donut chart
- Revenue overview with channel progress bars
- Weekly sales bar chart with projected data
- Recent deals table with avatars
- Sales calendar with category tabs
- Interactive task list with checkbox toggle
