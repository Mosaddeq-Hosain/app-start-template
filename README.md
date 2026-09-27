# Cloudflare full-stack monorepo

An npm workspaces monorepo with React, React Router, Hono, Drizzle, and Cloudflare D1.

Review [`TODO.md`](./TODO.md) for initial setup, deployment, and change-specific checklists.

## Apps

- `apps/web`: React 19, React Router 7, and Vite
- `apps/api`: Hono Cloudflare Worker with D1, Drizzle, Zod, OpenAPI, and Scalar
- `packages/shared`: shared API types

## Development

```sh
npm install
npm run db:migrate -w @app/api
npm run dev
```

The web app runs at `http://localhost:5173` and proxies API requests to the Worker at `http://localhost:3000`. API documentation is available at `http://localhost:3000/docs`.

Before deploying, create a D1 database with `npx wrangler d1 create starter-db`, then replace the placeholder `database_id` in `apps/api/wrangler.jsonc`. Apply production migrations with `npm run db:migrate:remote -w @app/api`.

## Commands

```sh
npm run dev
npm run build
npm run typecheck
npm test
npm run test:e2e
```
