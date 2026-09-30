# Vercel/Firebase release validation — 2026-09-30

## Passed locally

- TypeScript: `npm run lint`.
- `npm run build:vercel`: 54 public routes rendered successfully; `dist/static` contains assets only, SSR template is private.
- `npm test`: 425 assertions across routes, canonical redirects, metadata, sitemap, sanitization, private-file blocking, authentication rejection and inquiry persistence using an isolated local store.
- `npm run test:cloud`: concurrent request isolation, non-conflicting additions, competing-edit rejection, response held until transaction commit, new-request reload and 503 on simulated commit failure. Uses a transaction adapter, not a live Firestore instance.
- `npm run test:vercel`: actual function entrypoint initializes without listening on a server port; invalid Firebase configuration returns 503 rather than disk fallback; preview noindex; www redirect preserves path/query; static output excludes template/backend.
- `npm audit --omit=dev`: 0 vulnerabilities after compatible dependency updates (including uuid override).

Build and type checks ran with Node 24.15.0. The 425-assertion integration suite also passed with Node 22 (the deployment version), using npx node@22.

## Requires the account environment

Vercel credentials are not available in this local process. No live Firestore initialization, Firebase sign-in, Storage upload, custom-domain change or production promotion has been verified here. The pushed GitHub branch triggered a Vercel preview build, which failed. Authenticated logs confirmed the build stopped on missing PREVIEW_SECRET. That unnecessary mandatory setting has now been removed: preview signing derives a separate key from the Firebase server credential. Vercel project and shared-variable lists confirm Firebase server credentials are not yet configured. Deployment remains pending user credential entry. The Vercel build preflight now checks cloud configuration before deployment succeeds. Follow VERCEL-DEPLOYMENT.md for the first verified admin and database initialization.

The earlier persistent-Node release ZIP is superseded for Vercel deployments. Use only the new `shera-scrap-vercel-firebase.zip` for this deployment path.
