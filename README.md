# AssociationOS web app

Next.js 16 frontend for AssociationOS. Each organization gets its own branded workspace
(name, logo, brand color) after login; the API keeps every organization's data separate.

## Run locally

```bash
cp .env.example .env.local      # point NEXT_PUBLIC_API_URL at the API
npm install
npm run dev                     # http://localhost:3000
```

Demo logins come from the API seed (`npm run db:seed` in association-os-api), for example
`admin@bayoucitychamber.org` and `admin@lonestarpros.org` (password `Demo@2026!` unless
`SEED_PASSWORD` was set).

A branded login page for one organization: `/login?org=<slug>`, e.g. `/login?org=bayou-city-chamber`.

## What's live vs preview

Live (real API data): login, dashboards (admin and member), contacts and members (add, edit,
CSV import), events and RSVPs, membership tiers, campaigns, member directory, organization
branding settings, my profile and password.

Preview (sample data, hidden unless `NEXT_PUBLIC_SHOW_PREVIEW_FEATURES=true`): Messages,
Notifications, the Fundraising overview, payment and notification settings, member billing,
security and privacy tabs, news and announcements.

## Deploy

**Netlify:** new site from this repo. Set `NEXT_PUBLIC_API_URL` (the API site's URL plus `/api`)
and `NEXT_PUBLIC_SHOW_PREVIEW_FEATURES=false`, then deploy. Add this site's URL to the API's
`CORS_ORIGINS`.

**Docker (AWS / Mac Studio):**
`docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api -t associationos-web .`
