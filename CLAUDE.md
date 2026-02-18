# WeatherDash

A production-quality weather dashboard web app that auto-detects location, displays current weather, 5-day forecast, temperature chart, and interactive weather map.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + CSS custom properties for theming
- **Charts**: Recharts
- **Maps**: React-Leaflet + Leaflet + OpenWeatherMap tile layers
- **Icons**: Lucide React
- **Dark Mode**: next-themes
- **Toasts**: sonner
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Weather API**: OpenWeatherMap (free tier)

## Architecture

- **All colors via CSS custom properties** — defined in `src/app/globals.css`, wired into Tailwind via `@theme inline`. Never hardcode color values.
- **Dark/light mode** — managed by `next-themes` with `.dark` class. Base tokens swap in CSS.
- **Weather theming** — overlay on top of dark/light base. Only `--weather-*` variables change per weather condition.
- **API proxy** — Next.js Route Handlers in `src/app/api/` hide the OWM API key server-side.
- **Always fetch metric** — API routes always use `units=metric`. Client converts to Fahrenheit via `formatTemp()` for instant C/F toggle.
- **localStorage** — All user preferences stored with `weatherdash-` prefix. No database.
- **Structured logging** — `src/lib/logger.ts`. Verbose in dev, errors-only in prod. Format: `[LEVEL] [Context] message`.

## File Structure

```
src/
  app/           — Pages, layouts, API routes
  components/
    ui/          — Generic UI components (skeleton, error, toggles)
    layout/      — Header, DashboardGrid
    weather/     — Weather display widgets
    search/      — City search, recent cities
  hooks/         — Custom React hooks
  lib/           — Utilities (logger, api, units, constants, rate-limiter, weather-themes)
  types/         — TypeScript interfaces
  providers/     — React context providers
tests/
  unit/          — Vitest unit tests
  e2e/           — Playwright E2E tests
```

## Key Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npx vitest run` — Run unit tests
- `npx playwright test` — Run E2E tests

## Design Tokens

- Font: Inter
- Spacing: 8px base
- Border radius: 4px (sm), 8px (md), 12px (lg), 9999px (full)
- Breakpoints: mobile <640px, tablet 640-1024px, desktop >1024px
- Every component must have skeleton loading + error states

## localStorage Keys

- `weatherdash-unit` — "metric" | "imperial"
- `weatherdash-theme` — managed by next-themes
- `weatherdash-recent-cities` — JSON array of {name, lat, lon, country}
- `weatherdash-last-city` — JSON object of last viewed city
