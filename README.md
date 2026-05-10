# Traveloop

A trip planning web app built for people who want everything in one place — itineraries, budgets, packing lists, and shareable trip links. No bloat, no subscriptions, just planning that works.

---

## What it does

- **Trip builder** — add multi-city stops, reorder them, and fill in activities for each destination
- **Budget tracker** — log expenses by category (transport, stay, meals, activities) and see a running total
- **Packing checklist** — organize items by category and check them off before you leave
- **Notes** — jot down anything trip-related, linked to a specific stop or just the trip in general
- **Shareable trips** — generate a public link to share your itinerary with friends or co-travelers
- **Saved destinations** — bookmark cities on your profile to come back to later
- **40+ city database** — covers major Indian destinations and international cities, with a custom city fallback if yours isn't listed

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TanStack Start (file-based routing) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui + Radix UI primitives |
| Auth & database | Supabase |
| Deployment | Cloudflare Workers (via Wrangler) |
| Build tool | Vite 7 |
| Language | TypeScript |

---

## Getting started

### Prerequisites

- Node.js 18 or later
- A Supabase project (free tier works)

### Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd traveloop

# Install dependencies
npm install

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Deploy to Cloudflare Workers

```bash
npx wrangler deploy
```

---

## Project structure

```
src/
├── components/          # Shared UI components (layout, dialogs, cards)
│   ├── ui/              # shadcn/ui base components
│   ├── app-layout.tsx   # Sidebar + mobile nav shell
│   ├── city-search-dialog.tsx
│   └── activity-search-dialog.tsx
├── lib/
│   ├── trip-context.tsx # Global state — trips, auth, user preferences
│   ├── mock-data.ts     # Seed trips, city database, activity library
│   └── utils.ts
├── routes/              # File-based pages (TanStack Router)
│   ├── index.tsx        # Dashboard
│   ├── create.tsx       # New trip form
│   ├── trip.$id.build.tsx   # Trip builder (stops + activities)
│   ├── trip.$id.budget.tsx  # Expense tracker
│   ├── trip.$id.packing.tsx # Packing checklist
│   ├── trip.$id.notes.tsx   # Trip notes
│   ├── trip.$id.view.tsx    # Trip overview
│   ├── shared.$id.tsx   # Public share page
│   ├── auth.tsx         # Login / signup / forgot password
│   ├── profile.tsx      # User settings + saved destinations
│   └── reset-password.tsx
└── integrations/
    └── supabase/        # Supabase client, types, auth middleware
```

---

## Database migrations

Migrations live in `supabase/migrations/`. To apply them to your project:

```bash
npx supabase db push
```

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key from your Supabase project settings |

These are safe to use client-side. Never put your service role key here.

---

## Contributing

1. Fork the repo and create a branch off `main`
2. Make your changes
3. Run `npm run lint` and `npm run format` before opening a PR
4. Keep commits small and focused — one thing per commit

---

## License

MIT
