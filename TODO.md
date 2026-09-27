# Project Checklist

Keep this file updated whenever the template gains a service, binding, environment variable, migration, deployment step, or manual setup requirement. Check off project-specific work as it is completed; recurring checklists should remain reusable.

## Initial Setup

- [ ] Rename the root package in `package.json`.
- [ ] Rename `@app/web`, `@app/api`, and `@app/shared` if the project needs unique workspace names.
- [ ] Replace the starter title, metadata, copy, and example notes UI.
- [ ] Run `npm install`.
- [ ] Install Playwright's Chromium browser with `npx playwright install chromium`.
- [ ] Authenticate Wrangler with `npx wrangler login`.
- [ ] Confirm the active Cloudflare account with `npx wrangler whoami`.
- [ ] Rename the Worker in `apps/api/wrangler.jsonc`.
- [ ] Choose production and preview environment names.

## D1 Setup

- [ ] Rename `starter-db` in `apps/api/wrangler.jsonc` and the database scripts in `apps/api/package.json`.
- [ ] Create the production database with `npx wrangler d1 create <database-name>`.
- [ ] Replace `replace-with-your-d1-database-id` in `apps/api/wrangler.jsonc` with the returned ID.
- [ ] Create a separate preview database if preview deployments must not use production data.
- [ ] Add the preview database binding to the appropriate Wrangler environment.
- [ ] Apply local migrations with `npm run db:migrate -w @app/api`.
- [ ] Do not commit local Wrangler state from `.wrangler/`.

## Deployment Architecture

- [ ] Decide how the frontend will be hosted, such as Cloudflare Pages, Worker static assets, or another host.
- [ ] Decide whether the frontend and API will share a domain.
- [ ] Resolve production API routing before deployment. The frontend currently calls relative `/api` URLs and Vite only proxies them during local development.
- [ ] If using separate domains, add a public API URL configuration to the web app and configure Hono CORS for the exact frontend origins.
- [ ] Add a frontend deployment command or connect the frontend directory to the chosen hosting provider.
- [ ] Configure SPA fallback routing so React Router URLs return `index.html`.
- [ ] Configure custom domains and DNS when required.

## Secrets And Bindings

- [ ] Never commit secret values or `.env` files.
- [ ] Add production secrets with `npx wrangler secret put <NAME> -c apps/api/wrangler.jsonc`.
- [ ] Add local secret values to `apps/api/.dev.vars` and keep that file ignored.
- [ ] Declare every new Cloudflare binding in `apps/api/wrangler.jsonc`.
- [ ] Add every new binding to the `Bindings` type in `apps/api/src/app.ts`.
- [ ] Document where each secret or binding is created and which environments require it.

## Before Every Deployment

- [ ] Review the changes being deployed and any new manual setup requirements.
- [ ] Run `npm install` when the lockfile or dependencies changed.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `npm run build`.
- [ ] Review `npm audit`; investigate findings instead of applying forced upgrades blindly.
- [ ] Back up production data before destructive or risky migrations.
- [ ] Apply pending D1 migrations with `npm run db:migrate:remote -w @app/api`.
- [ ] Deploy the API with `npm run deploy -w @app/api`.
- [ ] Deploy the frontend using the configured hosting workflow.
- [ ] Record significant deployment or rollback notes in the project release process.

## After Every Deployment

- [ ] Verify the production health endpoint at `/api/health`.
- [ ] Verify the OpenAPI document at `/openapi.json`.
- [ ] Verify Scalar documentation at `/docs`.
- [ ] Create and retrieve a note through the production UI.
- [ ] Test direct navigation and refresh on each React Router page.
- [ ] Check Worker logs and browser console errors.
- [ ] Confirm that preview and production use the intended D1 databases.

## When Changing The Database

- [ ] Update `apps/api/src/db/schema.ts`.
- [ ] Generate a migration with `npm run db:generate -w @app/api`.
- [ ] Read the generated SQL before applying it.
- [ ] Consider existing production data, defaults, nullability, and rollback strategy.
- [ ] Apply the migration locally with `npm run db:migrate -w @app/api`.
- [ ] Add or update Vitest coverage for database behavior.
- [ ] Run the full pre-deployment checklist.
- [ ] Apply the remote migration before deploying code that depends on it.

## When Adding An API Endpoint

- [ ] Define request parameters and bodies with Zod.
- [ ] Define every response status and schema in the OpenAPI route.
- [ ] Add an appropriate OpenAPI tag and description.
- [ ] Validate untrusted input before using it.
- [ ] Add Vitest coverage for success, validation failure, and authorization where applicable.
- [ ] Update `packages/shared` when the frontend needs shared domain types.
- [ ] Confirm the endpoint appears correctly in `/openapi.json` and `/docs`.

## When Adding A Frontend Feature

- [ ] Add or update React Router routes when navigation changes.
- [ ] Handle loading, empty, error, and success states.
- [ ] Check keyboard access, labels, focus behavior, and color contrast.
- [ ] Check desktop and mobile layouts.
- [ ] Add or update Playwright coverage for the main user path.
- [ ] Use the production API configuration rather than relying on the local Vite proxy.

## When Adding A Dependency Or Service

- [ ] Confirm the package supports Cloudflare Workers if it runs in the API.
- [ ] Prefer Web APIs over Node.js-only APIs in Worker code.
- [ ] Document required accounts, credentials, secrets, bindings, and dashboard setup here.
- [ ] Add local setup and teardown instructions.
- [ ] Add preview and production configuration.
- [ ] Add tests for the integration and document failure or rollback procedures.
- [ ] Commit the updated `package-lock.json`.

## Project-Specific Tasks

- [ ] Add future manual task here.
