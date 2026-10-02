# SheraScrap — GitHub ready

ZIP খুলে ভেতরের **সব ফাইল ও ফোল্ডার repository root-এ** রাখুন, তারপর push করুন। Root-এ `package.json`, `package-lock.json`, `wrangler.jsonc`, `src`, `content`, `scripts`, `public`, `tests` ও `.github` থাকবে। বাইরের ZIP folder-টি repository root-এর বদলে ব্যবহার করবেন না। পুরোনো Git history বা repository মুছে নতুন repository বানানোর প্রয়োজন নেই।

আপনার বর্তমান Cloudflare Git connection থাকলে push-এ deployment শুরু হবে। এই package-এর জন্য Firebase credentials, database বা নতুন paid service প্রয়োজন নেই।

## Cloudflare deployment

আপনার আগের logs-এ Workers Static Assets-এর `npx wrangler deploy` ছিল। তার configuration এই package-এ আছে। বর্তমান `bun run build` অথবা standard `npm run build` command এবং `npx wrangler deploy` ব্যবহার করা যায়। Node 22/24 supported; Wrangler ও dependency lockfile অন্তর্ভুক্ত।

Cloudflare **Pages** project-এ ব্যবহার করলে Git integration, Framework None, build `npm run build`, output `dist/pages`, repository root ব্যবহার করুন। Pages নিজে output publish করে; `wrangler deploy` তার deploy command নয়। `wrangler.jsonc`-তে Workers configuration আছে; `pages_build_output_dir` দেওয়া হয়নি, ফলে Pages production settings dashboard-এ থাকে। Generated `_worker.js` ও `_routes.json` দিয়ে Pages-এর ভাষা নির্বাচন চলে। দুই platform-এর নিজস্ব runtime-এ এই output পরীক্ষা করা হয়েছে।

যে platform ইতিমধ্যে আপনার domain ও repository-র সঙ্গে connected, সেটিতেই update করা যায়। Hosting account-এর Git connection, domain বা DNS কোনো ZIP নিজে থেকে তৈরি করতে পারে না।

## Domain ও search accounts

Canonical domain `https://sherascrap.com`। Existing domain connection রেখে দিন। নতুন Pages project হলে Custom domains wizard, Workers হলে Domains & Routes → Custom Domain ব্যবহার করুন। `www` থেকে মূল domain-এ 301 redirect Cloudflare zone-এর Redirect Rules-এ দিন; path ও query সংরক্ষণ করুন। Email-এর MX/TXT records রাখুন।

Google domain verification-এর আগের DNS TXT record রাখতে হবে। Google ও Bing verification meta দেওয়া আছে। Sitemap: `https://sherascrap.com/sitemap.xml`। Preview `pages.dev`/`workers.dev` host-এ noindex header আছে। Cloudflare account-এর bot policy যেন আপনার অনুমোদিত search/AI crawlers-কে block না করে।

## ভাষা ও free plan

শুধু bare `/` URL-এ country অনুযায়ী temporary redirect হয়: SA/AE/BH/KW/QA/OM → Arabic, অন্য পরিচিত country → English। Country না পাওয়া গেলে ও search bots-এর জন্য Arabic default। Visitor-এর ভাষা পছন্দ মনে রাখা হয়। কোনো direct Arabic/English page country অনুযায়ী বদলায় না।

সব content page pre-rendered static HTML। Country selection-এর ছোট function-টি free Workers/Pages Functions quota ব্যবহার করে; Free plan-এ account-এর মোট function requests-এর দৈনিক limit 100,000। Static asset traffic আলাদা। Paid plan বেছে নেওয়া হয়নি; domain renewal এবং account-এর অন্য usage এই package-এর নিয়ন্ত্রণে নেই। Country detection ছাড়া সম্পূর্ণ function-free version চাইলে root Arabic রাখা যায়, কিন্তু সেটি এই version-এর country selection feature হবে না।

[Workers static billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) · [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/) · [Pages configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)

## Content ও resources

Business details, services, articles ও existing local guides: `content/site.json`। নতুন published article-এ unique lowercase slug, Arabic/English title, excerpt ও HTML content দিন। Build তার দুই language URL, HTML ও sitemap entry তৈরি করে।

২৪টি এলাকার exact নাম, unique local introduction, preparation ও FAQ: `src/content/serviceAreas.ts`। তাদের URLs ও language counterpart সেখানেই নির্ধারিত। Homepage sections ও layout: `src/pages/HomePage.tsx`, `src/components`, `src/index.css`।

ছবি/আইকন `public/resources/`-এ রাখুন; page content-এ `/resources/filename.webp` ব্যবহার করুন। Path-এর letter case মিলতে হবে। একই ছবি পাল্টালে নতুন filename ব্যবহার করুন, যাতে cache-এর পুরোনো ছবি না আসে। Provided logo, favicon, illustrations, photos ও licensed local Arabic fonts অন্তর্ভুক্ত।

Specific page metadata পরিবর্তন করতে `content/seo.json`:

```json
{
  "/en/contact/": {
    "title": "Contact SheraScrap in Dammam",
    "description": "Discuss scrap assessment and collection with our Dammam team.",
    "image": "/resources/brand/icon-512.png"
  }
}
```

WhatsApp form-এ customer details দিয়ে Continue চাপলে prepared message খোলে; WhatsApp-এ Send চাপলে পাঠায়। ছবি customer-এর device-এ থাকে; chat-এ attach করতে হবে। Supported device-এ native photo sharing-ও আছে। Website database-এ lead বা photo জমা হয় না।

## Analytics ও IndexNow

Google Analytics `G-2DQ7V2XJ3E` শুধু production domain ও visitor consent-এর পরে চলে। Form contents analytics-এ যায় না। Privacy page থেকে preference বদলানো যায়।

IndexNow public key file build-এ তৈরি হয়। GitHub validation workflow main/master push-এর পরে production-এ **এই build-এর matching digest** ও key file পাওয়া গেলে URLs submit করে। Local build/test কোনো submission করে না। Deploy তখনও live না হলে workflow pending জানায়; deployment-এর পরে Actions → Validate website → Run workflow দিয়ে retry করা যায়। Search engine submission গ্রহণ করলেও indexing নিশ্চিত নয়।

## Verification

`npm ci` → `npm run lint` → `npm run build` → `npm test` → `npm run test:cloudflare` → `npm run deploy:check`। GitHub workflow এগুলো চালায়। `npm run preview` local preview খোলে। `RELEASE-MANIFEST.json`-এ source files-এর SHA-256 আছে। বিস্তারিত ফল: `STATIC-VALIDATION.md` ও `IMPLEMENTATION-REPORT.md`।
