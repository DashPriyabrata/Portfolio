# Astro Bento Portfolio

A polished Astro portfolio template built as a bento-style, content-rich personal site.

Designed for easy customization, this repo ships the same production-ready features: a dynamic homepage, a photography gallery, a travel globe, and a guestbook backed by Drizzle + Turso.

## Features

- Bento-style homepage with animated card entrance and a loader reveal
- Personal intro, about, contacts, timezone, now, theme switcher, and CTA cards
- Interactive travel globe highlighting visited countries
- Photography page with masonry layout, image cards, and embedded video previews
- Guestbook with Astro API routes, form submission, pagination, and database persistence
- SEO-friendly metadata, Open Graph tags, Twitter cards, JSON-LD, sitemap, and robots.txt
- Netlify SSR-ready Astro setup
- MIT licensed and ready to clone, fork, and adapt

## Tech Stack

| Area | Stack |
| --- | --- |
| Framework | Astro |
| UI / styling | UnoCSS, custom global styling |
| Animation | Motion |
| Data visualization | D3 |
| UI islands | Solid.js, TypeScript JSX |
| Database | Drizzle ORM + libSQL / Turso |
| Deployment | Netlify adapter |
| Fonts | Local Cabinet Grotesk + Satoshi |

## Prerequisites

- Node.js `24.13.0` or newer, matching [.nvmrc](.nvmrc)
- pnpm
- A Turso / libSQL database if you want the guestbook enabled

## Getting Started

```bash
git clone https://github.com/DashPriyabrata/Portfolio.git
cd Astro-Portfolio
pnpm install
pnpm dev
```

Then open the local Astro dev server at `http://localhost:4321`.

### Helpful commands

```bash
pnpm build
pnpm preview
pnpm check
pnpm eslint
```

## Make It Yours

1. Update your personal details in [src/site-config.ts](src/site-config.ts).
2. Replace the memoji/avatar assets in [src/assets](src/assets).
3. Swap the gallery images in [src/assets/gallery](src/assets/gallery) with your own work.
4. Replace the photography preview video in [public/videos/previews](public/videos/previews) if needed.
5. Adjust your social links, timezone, and travel destinations in [src/site-config.ts](src/site-config.ts).

The homepage is built from reusable cards, so you can remove or rearrange sections without changing the overall layout system.

## Guestbook Setup

The guestbook uses Drizzle ORM with a remote libSQL / Turso database.

Set these environment variables in your local shell and deployment environment:

```bash
TURSO_DATABASE_URL=libsql://<your-database>.turso.io
TURSO_AUTH_TOKEN=<your-auth-token>
```

The database schema lives in [src/db/schema.ts](src/db/schema.ts), and the client is wired through [src/db](src/db).

To create or sync the schema, run:

```bash
pnpm db:push
```

## Project Structure

- [src/pages/index.astro](src/pages/index.astro) - bento homepage
- [src/pages/photography.astro](src/pages/photography.astro) - photography gallery
- [src/pages/travel.astro](src/pages/travel.astro) - visited countries globe
- [src/pages/guestbook.astro](src/pages/guestbook.astro) - guestbook page
- [src/pages/api/guestbook.ts](src/pages/api/guestbook.ts) - guestbook API route
- [src/components](src/components) - reusable cards, media, loader, pulse, and UI pieces
- [src/layouts](src/layouts) - shared page shells and SEO/meta handling
- [src/db](src/db) - database client and schema
- [public](public) - static assets and preview media

## Deployment

This template is ready for Netlify SSR deployment using the Astro Netlify adapter already configured in [astro.config.mjs](astro.config.mjs).

Before deploying, make sure your guestbook database environment variables are set in your hosting provider.

## License

Released under the [MIT License](LICENSE). You can clone it, customize it, and use it as a base for your own portfolio.

## Author

Built by Priyabrata Dash.
