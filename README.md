# Variation Capture - Project Manager Dashboard

A premium wall-mounted dashboard for construction project managers to monitor variation data in real-time.

## Features

- **Live Dashboard** - Full-screen display optimized for office wall mounting
- **Real-time Data** - Auto-refreshing variation and project data every 30 seconds
- **Status Pipeline** - Visual flow showing variations from Captured → Submitted → Approved → Paid
- **Notice Window Alerts** - Track variations approaching 28-day submission deadlines
- **Project Breakdown** - Detailed view of all projects with approval progress
- **Activity Feed** - Recent variation updates and status changes
- **Value Charts** - Visual breakdown of variation values by status

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Supabase** integration ready (placeholder config included)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3334](http://localhost:3334) in your browser

## Production Deployment

The dashboard is designed for wall-mounted displays (1920x1080) and includes:

- Dark theme optimized for office environments
- Large typography readable from 3+ metres
- Auto-refresh functionality
- No scrolling required - everything fits on one screen

## Data Sources

Currently uses mock data for demonstration. To connect to live Supabase data:

1. Add your Supabase credentials to environment variables
2. Uncomment the real-time subscription code in `/lib/supabase.ts`
3. Update the data types to match your database schema

## Pages

- `/` - Main dashboard (wall display)
- `/projects/[id]` - Detailed project view with sortable variations table

## Premium Features

This dashboard is a premium product feature designed to justify enterprise subscription pricing. Key differentiators:

- Purpose-built for construction industry workflows  
- 28-day notice period compliance tracking
- Real-time collaboration and updates
- Professional design suitable for client-facing environments

---

**Powered by Variation Capture · [variationcapture.com.au](https://variationcapture.com.au)**