# Static release validation

54 public Arabic/English HTML pages generated. Automated checks cover unique titles, descriptions, canonical URLs, hreflang, one H1 per generated page, JSON-LD validity, internal links, 130 local image references, absence of private CMS records and backend endpoints, real noindex 404, WhatsApp Unicode encoding, and Pages file limits.

Commands: `npm run build`, `npm test`, `npm run lint`.

Images are bundled under public/resources and deployed from the same origin. Three unavailable source image URLs use a branded SVG fallback. Provenance: content/image-sources.json. Google Fonts and embedded maps remain external services.

This is a local build validation, not a claim of live Cloudflare deployment, Search Console indexing, keyword ranking, or a 3,000-user load test. Production DNS, TLS, redirect/header rules and crawler access require verification after connecting the Cloudflare account and domain.
