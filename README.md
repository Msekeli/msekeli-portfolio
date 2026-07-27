# Msekeli Mkwibiso — Portfolio

A single-page portfolio site built with React 19, Vite, and Tailwind CSS v4. Content is data-driven (JSON files, not hardcoded JSX), sections fade in as you scroll to them, and the contact form sends real email through a Vercel serverless function.

Live architecture/file-by-file notes live in [`PORTFOLIO-DOC.md`](./PORTFOLIO-DOC.md) — read that if you're modifying layout or behavior. This file covers running the project.

## Tech stack

- **React 19** + **Vite 7** — UI and build tooling
- **Tailwind CSS v4** — styling, via the `@tailwindcss/vite` plugin
- **embla-carousel-react** — certificates slider
- **lucide-react** — icon set
- **Resend** — transactional email for the contact form
- **Vercel** — hosting + serverless API + analytics

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Other scripts

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
npm run lint     # eslint
```

## Environment variables

The contact form ([`api/contact.js`](./api/contact.js)) needs a Resend API key to send email. Create a `.env` (or set it in the Vercel dashboard for deployed environments):

```
RESEND_API_KEY=your_resend_api_key
```

Without it, `/api/contact` returns a 500 and the contact form shows an error — the rest of the site works fine.

Note: the API's contact-form rate limiting is in-memory and best-effort only. On Vercel's serverless runtime, function instances aren't guaranteed to persist between requests, so it won't reliably block rapid repeat submissions across cold starts. Swap in a shared store (Vercel KV, Upstash Redis) if you need real rate limiting.

## Project structure

```
src/
  components/   reusable UI building blocks (Button, Surface, Section, Icon, ...)
  sections/     page content (Hero, About, Certificates, Projects, Contact)
  layouts/      persistent chrome (AppShell, TopBar, DesktopNav, MobileNav, Footer)
  pages/        composes sections into a page (Home)
  hooks/        useActiveSection (scroll-spy for nav highlighting)
  data/         editable JSON content (projects, certificates, skills, nav, ...)
  styles/       design tokens + animation keyframes
api/
  contact.js    Vercel serverless function, sends contact form email via Resend
```

To change page copy, projects, or certificates, edit the JSON files in `src/data/` — you shouldn't need to touch JSX for content updates. See `PORTFOLIO-DOC.md` for the full breakdown of what each file controls.

## Deployment

Deploys via Vercel on push to `main`. The `api/` directory is picked up automatically as a serverless function; make sure `RESEND_API_KEY` is set in the Vercel project's environment variables or the contact form won't work in production.

## Known follow-ups

- `og:image` currently reuses the hero photo as a placeholder social-preview image. A dedicated 1200×630 image would render better in link previews.
- The Resend `from` address uses the shared sandbox sender (`onboarding@resend.dev`). Verifying your own domain in Resend will look more legitimate and avoid spam filtering.
