# FetchNews

Portal berita multi-sumber berbasis Next.js, TypeScript, Tailwind CSS, dan Bun.

## Development

```bash
bun install
bun dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Checks

```bash
bun run typecheck
bun run lint
bun run build
```

## Structure

- `app/`: routes, layouts, and API handlers Next.js
- `src/components/`: reusable UI components
- `src/features/`: domain modules such as news, sources, and search
- `src/lib/`: shared utilities and integrations
- `public/`: static assets
