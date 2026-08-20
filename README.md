# 🚀 SalesSphere - Executive Sales Dashboard

A modern, high-performance executive sales dashboard built with **React 18, Vite, TypeScript, Tailwind CSS, Node.js Express**, and **Supabase Realtime PostgreSQL**.

🔗 **Live Production Site**: [https://sales-dashboard-b0eu.onrender.com/](https://sales-dashboard-b0eu.onrender.com/)

---

## 🌟 Key Features

- 🌐 **Live Production Link**: [sales-dashboard-b0eu.onrender.com](https://sales-dashboard-b0eu.onrender.com/)
- 📅 **Interactive Calendar & Date Filtering**: Filter dashboard metrics and charts by a **12-Month Grid** or a **Specific Single Date** (e.g. `2026-05-25`).
- ⚡ **Supabase Realtime Database Sync**: Connected to Supabase Postgres with active WebSocket listeners for live order updates.
- 📊 **Dynamic Sales Analytics**: Real-time KPI metrics, weekly volume bar charts, lead conversion rates, and channel share pie charts.
- 📄 **Dynamic CSV Reports & Analytics Export**: Export live transaction logs and sales reports with UTF-8 BOM encoding.
- 💬 **Team Chat & Meeting Scheduler**: Built-in team discussion popover, live notification bell, and Google Meet sync modal.
- ⚙️ **Realtime Latency Test & Regional Settings**: Live DB connection speed test, currency localization (`INR`, `USD`, `EUR`, `GBP`), and custom date formats.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons + Recharts
- **Backend API**: Express.js (Node.js REST API with CORS configured)
- **Database & Realtime**: Supabase (PostgreSQL + Realtime WebSockets)
- **Deployment**: Render.com & Vercel

---

## 📂 Project Structure

```text
sales-dashboard/
├── frontend/             # React + Vite + TypeScript Frontend Application
│   ├── src/
│   │   ├── components/  # Layout, Header, Sidebar, Stat Cards, Views
│   │   ├── lib/         # Supabase client & export utilities
│   │   └── types/       # TypeScript Interfaces
│   ├── package.json
│   └── vercel.json
├── backend/              # Node.js + Express API Server
│   ├── index.js          # Express endpoints & CORS configuration
│   └── package.json
├── supabase/             # Database Schemas & Seed Data
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Run Application Locally

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173/`
- **Express Backend API**: `http://localhost:3001/api/dashboard`
- **API Date Filter Test**: `http://localhost:3001/api/dashboard?date=2026-05-25`

---

## 📡 API Endpoints & Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/health` | API Health & Service Status check |
| **GET** | `/api/dashboard` | Main dashboard payload (Baseline / All-time stats) |
| **GET** | `/api/dashboard?date=YYYY-MM-DD` | Date-filtered sales metrics & analytics payload |

### Example API Response (`GET /api/dashboard?date=2026-05-25`):

```json
{
  "selected_date": "2026-05-25",
  "metrics": {
    "id": "1",
    "total_earning": "18.45K",
    "avg_earning": "18.45K",
    "conversation_rate": "84.20%",
    "conversation_change": "+15.4% vs daily average",
    "new_orders": 412,
    "revenue": 18450.00
  },
  "performance": [
    { "id": "1", "day_label": "Sun", "purple_bar": 22, "green_bar": 18 },
    { "id": "2", "day_label": "Mon", "purple_bar": 38, "green_bar": 28 }
  ]
}
```

---

## 🌐 Production Deployment (Render)

- **Live URL**: [https://sales-dashboard-b0eu.onrender.com/](https://sales-dashboard-b0eu.onrender.com/)
- **Backend Service Root Directory**: `backend`
- **Frontend Static Site Root Directory**: `frontend`
