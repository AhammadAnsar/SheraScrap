# Shera Scrap website audit

**Historical pre-fix report.** The deployment release addresses these findings. See RELEASE-NOTES.md and VALIDATION.md for the current implementation and verified results.

Date: 2026-09-29. Scope: local source, fresh production build, production Express HTTP responses, and browser rendering. No deployment, CMS mutation, live-domain verification, or Search Console access was performed. This is not a full penetration test or Core Web Vitals measurement.

## Verdict

The project has language-specific routes and generated HTML, but it is a React SPA with an additional handwritten SSR/SSG renderer. It does not perform a full document load on ordinary internal Link navigation. That alone does not prevent Google indexing. The real blockers are inconsistent rendering, conflicting canonical metadata, service routes becoming 404 after JavaScript, and an unresolved static-versus-server hosting model.

Do not sign off on production readiness until the high-priority findings below are resolved.

## Verified checks

- Installed dependencies with `npm install --ignore-scripts --package-lock=false --no-audit --no-fund`; versions resolve from package.json ranges, not a frozen bun installation.
- `npm run lint`: passed (TypeScript checking, not an ESLint/accessibility audit).
- `npm run build`: passed; 66 candidate routes, 54 successful HTML pages. The remaining 12 invalid default service aliases were silently skipped rather than failing the build.
- Production test server: `NODE_ENV=production node dist/server.cjs`.
- `node tests/routing_ssr_tests.cjs`: 25 passed.
- `node tests/legacy_redirect_tests.cjs`: 51 passed.
- All 48 generated sitemap URLs returned HTTP 200 through Express.
- Normal root redirect, trailing-slash redirects, language attributes, representative per-page HTML/SEO, and ordinary unknown-route 404s work through Express.
- Browser tests confirmed duplicate metadata and a service page changing into a 404.

The existing tests inspect response HTML; passing them does not establish correctness after React renders or when deployed to a static host.

## Findings

### 1. High: backend bundle and source map are publicly served

Evidence: unauthenticated local production GETs to `/server.cjs` and `/server.cjs.map` both returned 200. The map embeds source content. `package.json` builds the backend into `dist`, and `server.ts:796` serves that entire directory as public files.

Impact: application internals and bundled configuration/source are downloadable. This is a confirmed exposure of source, not a claim that runtime environment secrets were leaked.

Fix: separate server build output from the public web root; expose only client assets and intended public HTML/files. Verify both paths return 404 on the actual deployment.

### 2. High: conflicting canonical URLs and duplicate titles after navigation

Evidence: a direct `/en/` browser load produced two canonical links, two description tags, and two robots tags. Starting at `/en/about/` and clicking Contact produced canonical URLs for BOTH `/en/about/` and `/en/contact/`, and retained both About and Contact titles.

Cause: `src/seo/seoService.ts:54` injects unmanaged server head tags; `src/components/SEO.tsx:58` adds Helmet-managed tags without adopting/removing those tags.

Impact: ambiguous search metadata; the current page can retain the previous page's canonical and SEO content.

Fix: use a single coordinated head renderer for server and client, or explicitly replace owned server head tags on navigation. Assert one canonical, one title, and the intended robots directive after both direct entry and internal navigation.

### 3. High: valid server service routes become client-side 404 pages

Evidence: `/en/services/ac-buying/` returned 200 with its own canonical and service HTML. In the browser it displayed `Page Not Found`, added `/en/404/` as another canonical, and added `noindex, nofollow` alongside the server's index directive.

Cause: `src/server/ssrRenderer.ts:297` resolves both categories and services. `src/pages/CategorySinglePage.tsx:18` resolves categories only. The current store has service-only slugs `ac-buying`, `copper-buying`, and `iron-buying`, in both languages.

Fix: share route/entity resolution between server and client, or implement a service detail component and matching canonical redirects where appropriate.

### 4. High: a query parameter containing a dot makes a valid page return 404

Evidence: `/en/about/?utm_source=google.com` returned HTTP 404 instead of the About page.

Cause: `server.ts:802` checks `url.includes('.')` against the entire original URL, including the query string. The development branch has the same bug at line 760.

Fix: classify assets using the parsed pathname, not the whole URL; do not skip page rendering based on punctuation in query values. Preserve necessary query parameters during redirects as well.

### 5. High: static deployment does not provide the same application as Express

Evidence: `vercel.json` has a catch-all rewrite to `/index.html`; `public/_redirects` has a SPA fallback returning 200. No serverless API handler is provided for the Express API. The generated root `index.html` remains an empty SPA shell; the root language redirect and runtime 404 behavior live in Express. Client code depends on `/api/cms/entities`, authentication, inquiry, upload, and estimator endpoints.

Impact: uploading only dist to static hosting cannot reproduce the verified Express behavior. Missing routes can fall back to a 200 shell, APIs are unavailable without a separately routed backend, and CMS updates cannot refresh generated HTML without a rebuild. Exact static-file rewrite precedence must be checked on the chosen provider; the production host was not tested.

Fix: select and document one deployment model. Either run Express with persistent storage and serve the frontend through it, or provide a real backend plus correct SSG routing, redirects, 404s, and rebuild/revalidation. Do not treat `vite preview` as a production SSR/API server.

### 6. High: contact form does not submit public inquiries to the backend

Evidence: `src/components/ContactForm.tsx:24` calls `addInquiry` then displays success on timers. `src/cms/CMSContext.tsx:799` only updates local React state; the synchronization effect at line 355 runs only for administrators. The public `/api/inquiries` endpoint exists but this form does not call it.

Impact: ordinary visitors' inquiries remain in their browser instead of arriving in the client's CMS. The separate WhatsApp handoff depends on the visitor continuing there and is not proof of a saved inquiry.

Fix: POST validated inquiry data to the public endpoint, await success, and show errors honestly. Preserve notes/details server-side as part of the same fix.

### 7. High: server HTML sanitizer allows unquoted event handlers

Evidence: calling `sanitizeHtml('<img src=x onerror=alert(1)>')` under Node returned the same string. No payload was saved or executed in the website.

Cause: `src/utils/sanitizeHtml.ts:25` uses a regex fallback on the server which removes only quoted event attributes. Server-rendered CMS HTML can reach the browser before the stronger client sanitizer runs.

Impact: stored malicious HTML can execute if it enters editable/imported content. This test confirms sanitizer bypass, not an unauthenticated write path.

Fix: use a maintained DOM-aware server sanitizer with the same allowlist as the client, and escape text/attribute interpolation in handwritten SSR templates.

### 8. Medium: extra path segments are accepted as real pages

Evidence: `/en/about/extra/` and `/en/services/copper/extra/` both returned HTTP 200 and the parent page's canonical.

Cause: `src/server/ssrRenderer.ts:93` reads the first three segments without enforcing the route's exact length. The client router does not accept these same URLs.

Fix: share exact route matching and return a genuine 404 for unmatched paths. Add these cases to tests.

### 9. Medium: server HTML and browser content are different implementations

Evidence: the raw FAQ main content contains only a title and introductory sentence, with no questions or answers. The raw About page contains an Our Mission paragraph, while the React page displays fleet, statistics, and advantages instead. `src/main.tsx:27` uses createRoot, replacing the server body instead of hydrating matching markup.

Impact: the supposedly prerendered HTML does not contain all primary content; page content and appearance change when JavaScript runs. Search engines may render JavaScript, but this weakens the intended consistent, independent HTML pages.

Fix: render the same components and data on the server and client; hydrate matching markup. If full document navigation is explicitly required, use normal document links or reloadDocument alongside correct per-route server/SSG output. Merely switching createRoot to hydrateRoot is insufficient while templates differ.

### 10. Medium: sitemap and generated routes disagree

Evidence: sitemap has 48 URLs; `/ar/pages/home/` and `/en/pages/home/` are listed but excluded from prerender output (`scripts/prerender.ts:122`). Both language locations archive routes are generated and valid but missing from the sitemap. Service-only routes are generated but absent from the category-only sitemap enumeration. Static/category lastmod uses today's date regardless of content changes.

Impact: the sitemap does not consistently describe the deployable page set. Missing sitemap entries do not by themselves prohibit indexing, but inconsistent entries undermine verification and discovery.

Fix: derive routes, sitemap, prerender targets, and publication filters from one shared manifest; use actual content modification dates. Make required-route generation failures fail the build.

### 11. Medium: client cache can revive removed content

Evidence: `src/cms/CMSContext.tsx:312` uses `entities.posts?.length ? entities.posts : prev.posts`, with equivalent logic for pages, services, locations, and categories. An authoritative empty array retains old/default content. The API merge also omits configurable sections such as FAQs, testimonials, slides, and theme.

Impact: deleting/unpublishing the last item can leave old content visible in browsers; fresh visitors may not receive section changes stored through the CMS synchronization system.

Fix: distinguish a missing property from a valid empty array. Return and consume a complete, explicitly public dataset, with consistent publication rules and cache invalidation.

### 12. Medium: browser admin bundle imports Node-only repository code

Evidence: Vite reported that fs and path were externalized for browser compatibility. Import chain: AdminLayout -> SitemapManager/SeoCenterManager -> sitemapGenerator -> data/repository. The repository evaluates `path.resolve(process.cwd(), ...)` at module load (`src/data/repository.ts:68`).

Impact: admin chunk has code that cannot run in an ordinary browser and can fail when the lazy admin module loads. Authenticated admin execution was not tested.

Fix: move pure publication predicates/shared types to a browser-safe module; keep filesystem repositories entirely in server code.

### 13. Medium: Search Console settings do not emit verification markup

Evidence: googleWebmasterCode appears in types, defaults, and the admin form, but no renderer emits a `google-site-verification` meta tag. The admin indicator checks only whether the string is longer than five characters; its seeded placeholder satisfies that check.

Impact: entering a code in that UI does not verify ownership through the HTML-tag method. This does not rule out independent DNS verification.

Fix: emit a correctly parsed verification token in the production head and distinguish configuration presence from actual Search Console verification.

## Additional deployment observations

- Backend data persists to local `data/store.json`, with an in-memory cache. Use persistent storage or a database for production; ephemeral/serverless filesystems and multiple independent instances are not equivalent to a shared datastore.
- `start` does not set NODE_ENV; the server starts its development path unless the host explicitly sets production. PORT is hardcoded to 3000. Document host requirements or read its assigned port.
- Build JavaScript: main 560.65 kB, Firebase 495.59 kB, icons 53.58 kB, React chunk 4.22 kB; CSS 101.54 kB before compression. This is a performance investigation target, not a measured Core Web Vitals failure. Public routes are eagerly imported; Firebase auth initializes for public visitors.
- The branded header uses h1 across pages; some content pages then have a second h1, while About's only h1 is the brand. Improve page-specific heading structure; this is not by itself an indexing block.

## Recommended order

1. Remove public backend artifacts; fix server HTML sanitization and inquiry delivery.
2. Choose and validate the deployment model.
3. Unify server/client route resolution and rendering, including SEO head ownership.
4. Fix query handling, strict 404s, cache/publication rules, sitemap coverage, and CMS browser dependencies.
5. Test every public route before and after JavaScript, through direct entry and internal navigation, on the actual host.
6. Submit the final sitemap and inspect representative URLs in Google Search Console. Confirm Google's selected canonical and rendered content; indexing every URL cannot be guaranteed by source code alone.

Google's primary guidance: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

## Workspace effects

No application source fixes were made. Dependency installation created node_modules; the normal build created dist and regenerated public/sitemap.xml. This report was added. No package lockfile was created.
