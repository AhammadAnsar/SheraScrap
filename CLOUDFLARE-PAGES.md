# Shera Scrap — GitHub-ready static website

ZIP extract করে **ভেতরের সব ফাইল ও folders** GitHub repository root-এ রাখুন। `package.json`, `package-lock.json`, `wrangler.jsonc`, `src`, `scripts`, `content`, `public`, `tests` এবং `.github` অবশ্যই আপলোড হবে। ZIP বা এর বাইরের folder-টি root-এ রাখবেন না। পুরোনো repository files রাখার প্রয়োজন নেই; repository ও Git history অক্ষত রেখে নতুন files প্রতিস্থাপন করুন।

## আপনার বর্তমান Cloudflare project

আপনার deployment log অনুযায়ী এটি **Workers Static Assets**, যেখানে build-এর পরে `npx wrangler deploy` চলে। এই package সেই বর্তমান project-এ deploy করার জন্য সম্পূর্ণ configuration বহন করে। সাইটটি একই pre-rendered static multi-page website; কোনো application Worker code, Firebase, database বা backend নেই।

বর্তমান build command `bun run build` এবং deploy command `npx wrangler deploy` রাখা যায়। Standard build command হলো `npm run build`। `wrangler.jsonc` সরাসরি `dist/pages` নির্দেশ করে; CLI version package-lock-এ pinned। `.node-version`/`.nvmrc` Node 22 নির্দেশ করে; Node 24-ও supported। Automatic Git integration আগে থেকেই connected থাকলে push করলেই build/deploy trigger হবে।

আগের ব্যর্থতার কারণ: Pages-এর hostname redirect Workers-এ গ্রহণযোগ্য নয়। এখন সব `_redirects` source relative path এবং একই output Pages ও Workers Static Assets-এ চলে। Domain-level redirect সঠিকভাবে Cloudflare zone Redirect Rules-এ বসাতে হয়।

## Cloudflare Pages ব্যবহার করলে

এই source-ই ব্যবহারযোগ্য। Git integration, Framework None, build `npm run build`, output `dist/pages`, root খালি/repository root। Pages dashboard নিজে deploy করে; Workers-এর deploy command সেখানে প্রয়োজন নেই। এই ZIP ব্যবহারের জন্য নতুন Pages project তৈরি করা বাধ্যতামূলক নয়।

## Domain — একবারের account setup

Canonical domain ইতিমধ্যে `https://sherascrap.com`। Workers হলে Settings → Domains & Routes → Custom Domain থেকে মূল domain যোগ করুন। Pages হলে Custom domains wizard ব্যবহার করুন। Domain zone একই Cloudflare account-এ active থাকতে হবে; প্রয়োজন হলে registrar-এ Cloudflare-এর দেওয়া nameservers বসান এবং email-এর existing MX/TXT records রাখুন।

`www.sherascrap.com`-এর জন্য Cloudflare zone → Rules → Redirect Rules-এ hostname `www.sherascrap.com` match করে 301 redirect দিন: `concat("https://sherascrap.com", http.request.uri.path)`, Preserve query string enabled। Account/DNS setup কোনো GitHub ZIP নিজে থেকে পরিবর্তন করতে পারে না। Domain একবার connect হলে ভবিষ্যতের content updates শুধু GitHub push-এ deploy হবে।

Preview `*.pages.dev` ও `*.workers.dev`-তে noindex header আছে; মূল domain indexable। Google Search Console-এ domain verify করে `https://sherascrap.com/sitemap.xml` submit করুন। AI crawler access চাইলে Cloudflare bot policies-ও যাচাই করুন।

## Content ও ছবি

`content/site.json`-এ business settings, published pages, services, locations ও blog posts। নতুন entry-তে existing schema অনুসরণ করুন; unique lowercase slug দিন। Published entries build-এ আলাদা HTML ও sitemap entry পায়। Backend admin নেই; পরিবর্তন GitHub commit/push দিয়ে publish হবে।

ছবি `public/resources/my-photo.webp`-এ রাখুন; content-এ `/resources/my-photo.webp` লিখুন। Filename case একই রাখুন এবং ছবি commit করুন। বর্তমান ছবিগুলো ZIP-এ অন্তর্ভুক্ত। তিনটি পুরোনো broken image URL branded placeholder হয়েছে। Google Fonts ও map embeds external।

Per-URL metadata override `content/seo.json`-এ:
```json
{
  "/en/contact/": {
    "title": "Contact Shera Scrap in Dammam",
    "description": "Contact our team for scrap collection in Dammam.",
    "image": "/resources/my-photo.webp"
  }
}
```

Contact/quote form WhatsApp-এ প্রস্তুত message খোলে; visitor Send চাপবেন। Photo WhatsApp-এ attach করা যায়। Server-এ lead storage বা paid AI নেই।

## Verification

`npm ci` → `npm run lint` → `npm run build` → `npm test` → `npm run test:cloudflare` → `npm run deploy:check`।

Cloudflare runtime test HTTP-তে সব public pages, redirects, real 404, images, sitemap ও headers যাচাই করে। GitHub workflow এই checks চালায়; credentials লাগে না। SHA-256 file list: `RELEASE-MANIFEST.json`। Local preview: `npm run preview`।

সাইটের HTML crawler-readable; ranking/indexing Google/AI search engine-এর সিদ্ধান্ত। Business claims/reviews/certification মালিক যাচাই করবেন। Production account deployment/DNS এখনও live test না করা থাকলে local validation-কে live deployment বলা হবে না।

Static asset requests free/unlimited under Cloudflare's applicable plan; build/file limits এবং domain renewal আলাদা। পুরোনো Firebase billing এই migration নিজে থেকে বন্ধ হয় না।

Official references: https://developers.cloudflare.com/workers/static-assets/redirects/ • https://developers.cloudflare.com/workers/static-assets/headers/ • https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ • https://developers.cloudflare.com/pages/configuration/custom-domains/
