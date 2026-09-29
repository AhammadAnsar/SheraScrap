# Release validation — 2026-09-29

| Check | Result |
| --- | --- |
| npm run lint | Passed |
| npm run build | Passed; 54 public routes rendered |
| npm test | 425 assertions passed using an isolated temporary store |
| node tests/routing_ssr_tests.cjs | 25 passed, 0 failed |
| node tests/legacy_redirect_tests.cjs | 51 passed, 0 failed |
| Browser: service-only route /en/services/ac-buying/ | Correct content, one canonical/title, indexable, one h1 |
| Browser: Arabic home, FAQ, article, location, custom page | One canonical/title and one h1 per sampled page; no captured runtime warnings/errors |
| Browser: /en/about/extra/ | Not-found page with noindex |
| Browser: About → Contact | Full document navigation; Contact canonical/title only |
| Browser: contact form | Success only after server response; inquiry and details verified in isolated store |

The HTTP suite also checks private backend paths, query punctuation, sitemap coverage, HTML sanitization, JSON script escaping, forged authentication tokens, preview signatures, persisted settings/sections and inquiry notes. The client dataset was not used for test mutations.

Target-host checks remain: DNS/TLS, Docker image execution, real Firebase login and authorized users, Gemini credentials if needed, Search Console ownership/indexing, and measured Core Web Vitals. No external account changes or live deployment were performed.
