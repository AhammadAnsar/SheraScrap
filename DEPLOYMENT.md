> Updated for Vercel + Firebase: follow [VERCEL-DEPLOYMENT.md](VERCEL-DEPLOYMENT.md). The persistent Node/Docker instructions below describe the earlier release and are not the Vercel deployment procedure.

# Shera Scrap deployment

This release runs as one persistent Node.js/Express service. Every public link loads its own server-rendered HTML document; React hydrates that same markup. Production HTML and sitemap are generated from the latest CMS store on each request.

## Start on a Node host

Requires Node.js 22.14+ (Node 22 LTS or 24) and npm. Extract the release into an application directory, not a public static web root.

```sh
npm ci
npm run lint
npm run build
npm test
npm start
```

`npm start` sets production mode automatically. The default port is 3000; the host's `PORT` environment variable is supported. `/api/health` is the health check.

Use a process supervisor with automatic restart. Run exactly one application instance for the included JSON store. Horizontal scaling requires migration to a shared transactional database.

## Docker alternative

```sh
docker compose up -d --build
```

Compose binds the application to `127.0.0.1:3000` and preserves CMS data and uploads in named volumes. Put an HTTPS reverse proxy in front of it, forwarding all paths—including `/api`, `/assets`, `/uploads`, and `/sitemap.xml`—to this service. Do not configure a catch-all rewrite to index.html.

Example Caddy configuration after pointing DNS at the server:

```caddyfile
sherascrap.com {
    reverse_proxy 127.0.0.1:3000
}
www.sherascrap.com {
    redir https://sherascrap.com{uri} permanent
}
```

Docker configuration is included; it must be built and smoke-tested on the target host. Local verification was performed with the Node production server, not a Docker daemon.

## Configuration and persistent data

Copy `.env.example` to `.env` for ordinary Node deployment, or set equivalent host environment variables. Never publish `.env`.

- `DATA_DIR`: persistent directory containing `store.json`. Defaults to `./data`.
- `UPLOADS_DIR`: persistent media directory. Defaults to `./public/uploads`.
- `PORT`: listening port, default 3000.
- `PREVIEW_SECRET`: optional stable random secret. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. If omitted, preview signatures use a random secret per process and expire across restarts.
- `GEMINI_API_KEY`: optional for real Gemini image analysis. Without it the existing estimator uses simulated estimates; do not describe those as live market quotations.

The canonical production domain is `https://sherascrap.com` in `src/config/site.ts`. If the client uses a different domain, change it before rebuilding. Prevent public indexing of any staging deployment at the hosting layer.

The supplied data/store.json is the current project dataset. Preserve your live store and upload directory when updating the code. Back up both before deployment and regularly thereafter. Disk writes use an atomic replacement; they are not a substitute for backups. Do not overwrite live data with the package's seed on subsequent deployments.

## CMS login

Firebase configuration is in `firebase-applet-config.json`. Use the client's intended Firebase project. Enable email/password authentication and configure the production authorized domain in Firebase. The user must have a verified Firebase email and a matching permitted user record in the server store. No test tokens or bundled demo passwords are accepted.

If needed, authorize an existing verified Firebase user while the service is stopped:

```sh
node scripts/admin-access.mjs administrator@example.com "Client Administrator"
```

Then start/restart the service and open `/admin/`. This command only changes the local CMS allowlist; create the account and verify its email through Firebase separately. If old demo passwords were reused in real accounts, replace those passwords in Firebase before launch.

## Public versus private artifacts

- `dist/client/assets/`: public hashed assets.
- `dist/client/index.html`: private HTML template consumed by Express.
- `dist/server/server.cjs`: private backend bundle.
- `dist/prerender/`: build-time validation snapshots, not served as stale CMS content.

Serve the application through Express. Do not upload the whole dist directory to a static host. The CMS/API/storage model is incompatible with a plain static-only Vercel/Netlify/cPanel deployment. A cPanel host must offer an actual Node process, persistent storage, and proxy routing.

## Launch verification

1. Confirm HTTPS and www-to-canonical redirect on the final domain.
2. Open `/ar/`, `/en/`, a service, a blog article, FAQ, and Contact directly, then follow menu links. Each page must have one title and one self-canonical.
3. Confirm `/en/about/?utm_source=google.com` returns 200 and `/en/about/extra/` returns 404.
4. Confirm `/server.cjs`, `/server.cjs.map`, and `/data/store.json` return 404.
5. Submit an authorized test inquiry, verify it appears in the CMS, and verify data survives a restart.
6. Enter the real Search Console verification token under SEO settings. The application emits the tag; ownership must still be confirmed inside Google Search Console. DNS verification also works independently.
7. Submit `/sitemap.xml` and use URL Inspection for representative Arabic/English pages. Technical readiness does not guarantee that Google will index every page.

Live DNS, TLS, Firebase sign-in, Gemini credentials, and Google Search Console require the owner's environment/accounts and were not verified locally.
