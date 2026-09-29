# Deployment release — 2026-09-29

## Audit fixes

| Audit finding | Resolution |
| --- | --- |
| Public backend/source-map exposure | Backend lives in dist/server; Express only exposes assets and intended media. Private paths return 404. |
| Duplicate/conflicting metadata | React 19 owns one shared SEO component on server and client. Native metadata hydration preserves one title/canonical. |
| Service routes become 404 after JavaScript | Service detail component resolves both category and service entities. |
| Query strings containing dots return 404 | Asset classification uses the pathname, not the query string. Redirects preserve query parameters. |
| Static versus Express deployment mismatch | Supported deployment is one persistent Node service; Docker/Compose and proxy instructions included. Removed static SPA rewrite configurations. |
| Contact form only saves locally | Public form awaits POST /api/inquiries; success requires a server response. Notes persist to disk. Admin inquiry status/delete use protected endpoints. |
| Weak server sanitizer | Same allowlist sanitizer on both sides. JSON/script serialization escapes HTML delimiters. |
| Invalid extra segments return 200 | Shared public route manifest determines exact valid routes; unknown routes render a real noindex 404 document. |
| Server/browser content mismatch | Replaced handwritten SSR templates with actual React components and matching hydration data. FAQ questions/answers are present in raw HTML. |
| Sitemap/prerender disagreement | One route manifest supplies the sitemap, required prerender validations, and server route existence. System-page aliases redirect. Modification dates reflect content updates. |
| Cache revives removed content | Initial state comes from fresh server data, never stale localStorage. Empty collections remain empty; configurable sections and settings persist. Loading server data does not trigger destructive automatic synchronization. |
| Browser imports filesystem repository | Browser-safe publication/routing utilities are separated from server repositories. No fs/path browser build warnings. |
| Search Console setting is not emitted | Actual verification token is emitted in HTML. Admin wording distinguishes configured markup from verified ownership. Fake sitemap ping is replaced by a Search Console link. |

Additional fixes: full-document navigation for public links, page-specific headings, preserved About CMS content, deferred Firebase loading for public visitors, configurable PORT/data/media paths, production startup command, atomic data writes, isolated tests, and reproducible npm lockfile.

During implementation, a production authentication bypass was also found and removed. Test tokens are rejected; Firebase identity verification and a server-side user allowlist are required. Hardcoded owner privilege escalation and bundled demo passwords were removed. Preview signatures now use a random secret by default and exact entity matching. Password management belongs to Firebase, not the local CMS form.

## Validation

- TypeScript check and production build pass.
- 54 public routes are rendered at build time, and the same renderer serves fresh CMS HTML in production.
- The isolated deployment regression suite covers every sitemap URL, metadata, raw content, HTTP status, query/redirect behavior, unsafe HTML, forged tokens, preview signatures, empty CMS collections, settings persistence, verification markup, and inquiry delivery.
- Browser checks confirm a single title/canonical, About-to-Contact document navigation, successful service rendering, and contact form success with durable storage in a temporary test dataset.
- Historical routing tests were updated only for the About content now shared with the real CMS page. The legacy security entrypoint delegates to the isolated suite instead of depending on insecure test-token authentication.

See the final validation summary shipped with this release for exact assertion counts. AUDIT-REPORT.md is the historical pre-fix audit, not the current status.

## Deployment boundary

The Node production runtime is tested locally. Docker files are supplied but Docker was not available locally. The owner's live domain, TLS/proxy, Firebase account sign-in, Gemini API access, and Google Search Console still need environment-specific launch verification. Existing content/claims/images were preserved; this release is not an editorial verification of business claims or stock assets.

The JSON store is designed for a single persistent application process. Use a shared database before running multiple replicas. The optional estimator still has its existing simulated fallback without Gemini credentials; see DEPLOYMENT.md.
