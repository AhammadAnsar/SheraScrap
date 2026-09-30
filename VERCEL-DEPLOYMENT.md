# Shera Scrap — GitHub → Vercel → Firebase

Production domain: **https://sherascrap.com**. This release replaces the earlier persistent-Node-only ZIP.

## 1. Repository and Vercel settings

Extract the new ZIP. Put its **contents** in the GitHub repository root: `package.json`, `vercel.json`, `api/`, `src/`, `server.ts`, etc. Do not upload only the ZIP or nest the project under `release/`. Do not restore the old catch-all `/index.html` rewrite.

The committed `vercel.json` sets:

| Setting | Value |
| --- | --- |
| Root Directory | Repository root (leave empty) |
| Framework Preset | Other (`framework: null` in configuration) |
| Install Command | `npm ci` |
| Build Command | `npm run build:vercel` |
| Output Directory | `dist/static` |
| Node.js | 22.x |

Disable conflicting Dashboard overrides. Do **not** select `dist` or `dist/client` as the public output. The public directory contains only assets; `api/index.ts` handles HTML, sitemap, robots and APIs. The SSR template is included privately in the function. Vercel builds from GitHub; `npm start` is only for local Node operation.

## 2. Firebase server environment

Set the following in Vercel → Settings → Environment Variables. Values are server secrets: never commit a private key or paste it into chat. Existing credentials can be retained if their variable names match.

Use **one** credential method:

- `FIREBASE_SERVICE_ACCOUNT_JSON`: entire service-account JSON as a secret value; or
- `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`: service-account email/private key. Escaped `\n` or real newlines are accepted. Set `FIREBASE_PROJECT_ID` too.

Application Default Credentials are also supported for local Google environments. Do not set a local `GOOGLE_APPLICATION_CREDENTIALS` file path on Vercel.

Configuration defaults match `firebase-applet-config.json`:

| Variable | Default / requirement |
| --- | --- |
| `FIREBASE_PROJECT_ID` | `shera-scrap` |
| `FIREBASE_DATABASE_ID` | `(default)` (create the default Firestore database) |
| `FIREBASE_STORAGE_BUCKET` | `shera-scrap.firebasestorage.app` |
| `FIREBASE_CMS_COLLECTION` | `shera_cms_v2` |
| `CMS_STORAGE` | `firestore` (automatic on Vercel; set for local cloud testing) |
| `PREVIEW_SECRET` | Optional override; otherwise a stable preview signing key is derived from the Firebase private key. With Application Default Credentials, set this to share preview links across instances. |
| `CMS_BOOTSTRAP_ADMIN_EMAIL` | For first deployment only: the actual enabled Firebase admin email |
| `GEMINI_API_KEY` | Optional; estimates use simulation without it |

The service account needs Firestore read/write access and Storage object access in the configured project. Firebase web API keys alone are **not** server credentials. Make sure Storage is enabled and the project's billing requirements are satisfied.

Use a separate collection, e.g. `shera_cms_preview`, and preferably a separate Firebase project for Preview deployments; do not let preview editors change production content. Preview responses carry `X-Robots-Tag: noindex, nofollow`. The custom production domain remains the canonical URL in HTML and sitemap.

## 3. Initialize the new CMS once

Existing legacy Firebase collections are not modified or automatically imported. The seed uses the reviewed `data/store.json` shipped with this project. If the live Firebase CMS has newer content, export/reconcile it before initialization; do not replace newer client content with an older seed.

Create/choose the intended administrator in Firebase Authentication, enable email/password login. Email verification is required before CMS access: after deployment, sign in and use the Send verification email button, then follow the link and sign in again. Add `sherascrap.com` and `www.sherascrap.com` to Authentication → Settings → Authorized domains.

**Vercel-only setup:** Set `CMS_BOOTSTRAP_ADMIN_EMAIL` in Vercel to that enabled account. On the first build, the preflight checks Firestore and Storage and initializes the new collection only when completely empty. Later builds read and validate it without replacing data. Remove the bootstrap variable after the first successful deployment. Credentials never need to leave Vercel. An incomplete or unavailable database fails the build rather than publishing a broken application.

**Local alternative:** On a trusted computer, use Node 22, run `npm ci`, and create an ignored `.env` with the server variables above. Then:

```sh
npm run firebase:seed -- admin@example.com
```

Replace the example with the actual enabled Firebase account. This creates the new collection, authorizes that account as super admin, and uploads packaged images. It does not import demo users, inquiries or audit logs. The script refuses to overwrite an existing CMS. If the image upload phase fails after initialization, fix Storage access and run:

```sh
npm run firebase:seed -- admin@example.com --media-only
```

Keep the new collection inaccessible to client SDKs; access goes through the authenticated backend. The existing `firestore.rules` default-deny rule covers `shera_cms_v2`; verify the deployed rules do not contain a separate permissive wildcard. Admin SDK uses IAM and does not depend on client rules.

Until credentials and initialization are complete, runtime requests intentionally return 503 instead of pretending to save to temporary disk. Build success alone is not a Firebase connection test.

## 4. Custom domain and deployment

In Vercel → Project → Settings → Domains, add **sherascrap.com** and **www.sherascrap.com**. Set www to redirect permanently to `https://sherascrap.com`. At the DNS provider, enter the exact records shown by Vercel for this project; do not guess IP addresses or remove mail/MX/TXT records. Wait for Vercel's domain verification and HTTPS certificate.

Redeploy after setting environment variables. Root `/` redirects to `/ar/`; both Arabic and English pages return server-rendered HTML. Do not redirect every `.vercel.app` request to production: Preview must remain testable. Protect Preview deployments with Vercel Authentication.

## 5. Acceptance before promotion

- `/ar/`, `/en/`, `/en/about/`, `/en/faq/`, service/blog/location pages: direct load returns 200 with content even without JavaScript, one title and canonical.
- `/en/about/extra/`: real 404. `/en/about/?utm_source=google.com`: 200.
- `/sitemap.xml` lists `https://sherascrap.com` URLs. `/robots.txt` references that sitemap.
- `/api/health`: 200 means the CMS was read successfully from Firebase.
- Sign in as the verified administrator. Edit content, reload, and check a fresh browser session.
- Submit an identifiable test inquiry; confirm it persists after a redeploy, then delete the test inquiry.
- Upload JPG/PNG/WebP (max 3 MB), reload the library, and check the image URL. Failed uploads show an error and never fall back to storing base64 in the CMS.
- `/data/store.json`, `/server.cjs`, `/src/App.tsx`: 404.
- Verify the custom domain's HTTPS and www redirect. Submit the sitemap to Search Console.

## Storage behavior and limits

Each request reads the current Firestore CMS into its own isolated context. Writes are committed transactionally before a success response is sent. Concurrent additions to different entity IDs merge; competing edits return 409 instead of silently overwriting. Each top-level CMS section is one document with a 900 KB guard below Firestore's document limit. Archive old inquiries/revisions or migrate that section to per-entity documents if it approaches that limit. There is no server-local persistence on Vercel.

## References

- https://vercel.com/docs/project-configuration
- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://firebase.google.com/docs/admin/setup
