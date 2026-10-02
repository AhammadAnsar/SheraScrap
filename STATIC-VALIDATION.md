# Release validation

112 standalone Arabic/English HTML pages were generated. The 54 URLs from the previous release remain available. The 24 supplied areas have 48 localized detail pages and two hubs; two privacy pages and six new service URLs complete the expansion.

Validation covers unique titles, one H1, descriptions, self-canonical URLs, three valid reciprocal language alternates, HTML language/direction, parsed JSON-LD, Google/Bing meta, all internal links, exact Arabic area names, distinct local introductions and correct area selection in every local quote form.

292 image references and all responsive image variants resolve to local packaged files. CSS/JS/fonts, the IndexNow key, sitemap, robots and llms.txt are generated. No content database, Firebase connection or admin credentials are sent to visitors.

Both Cloudflare Workers and Cloudflare Pages local runtimes serve all 112 pages with HTTP 200. Each verifies 258 static redirects, three dynamic aliases, real HTTP 404 for missing routes/API/admin, security headers, cache headers and asset MIME types. Country and preference routing is tested separately, with Arabic default for bots and unavailable country data. Root language redirects are temporary and not cached.

The real public browser script is tested against rendered forms in Arabic and English: all values survive WhatsApp encoding; the selected area is correct; language cookie handling and analytics consent work; preview analytics remain disabled. No WhatsApp messages or IndexNow submissions were sent during tests.

Lighthouse mobile runs on the local static preview achieved 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO and Agentic Browsing 3/3 for both homepages after responsive photo compression, local font preloads and llms link corrections. LCP was approximately 1.4–1.6 seconds and CLS zero. These are laboratory results; production network, hosting and optional analytics can change measurements. Raw reports are included under `reports/`.

The GitHub-ready ZIP is validated after extraction outside the workspace using a fresh npm installation, TypeScript check, production build, page/browser tests, both Cloudflare runtimes and Wrangler deployment dry-run. It does not rely on the previous repository files.

Local validation does not confirm live account permissions, DNS/TLS, Google/Bing ranking, real business listing verification or a production load test of 3,000 simultaneous visitors. The final deployment remains the user's GitHub push.
