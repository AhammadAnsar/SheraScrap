# Shera Scrap — Cloudflare Pages

এই static সংস্করণই বর্তমান deployment পদ্ধতি। পুরোনো Vercel/Firebase/Docker নির্দেশনা এই সংস্করণে প্রযোজ্য নয়।

## GitHub → Pages

1. `shera-scrap-cloudflare-source.zip` extract করুন। ZIP ফাইলটি নয়, এর ভেতরের source ফাইলগুলো repository root-এ রাখুন। আগের repository backup/branch রেখে পুরোনো deployment files প্রতিস্থাপন করুন; release folder বা dist folder-কে repository root করবেন না।
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git নির্বাচন করুন। সঠিক GitHub repository ও production branch নির্বাচন করুন।
3. Framework preset: None। Build command: `npm run build`। Build output directory: `dist/pages`। Root directory: খালি (repository root)। Node version: 22 (`NODE_VERSION=22` প্রয়োজনে সেট করুন)। Firebase, AI বা service-account secrets প্রয়োজন নেই।
4. প্রথম deployment সফল হলে pages.dev URL-এ Arabic/English ও সরাসরি service/blog URL খুলুন। এরপর প্রতিটি GitHub push-এ স্বয়ংক্রিয় build/deploy হবে।
5. Pages project → Custom domains থেকে `sherascrap.com` এবং `www.sherascrap.com` যোগ করুন। Apex domain ব্যবহারের জন্য domain-টি একই Cloudflare account-এ zone হিসেবে যোগ করে registrar-এ Cloudflare-এর দেওয়া nameservers বসান। আগে বর্তমান DNS export করুন; email-এর MX/TXT records সংরক্ষণ করুন। Pages-এর domain wizard সম্পন্ন করুন—শুধু CNAME যোগ করবেন না।
6. DNS ও certificate Active হওয়ার পর মূল domain পরীক্ষা করুন। সব canonical/sitemap URL ইতিমধ্যে `https://sherascrap.com`। www মূল domain-এ redirect হয়। পুরোনো Vercel connection সরানোর আগে নতুন domain কাজ করছে নিশ্চিত করুন।

`shera-scrap-cloudflare-static.zip` হলো তৈরি HTML/assets; এটি Pages Direct Upload-এর জন্য। GitHub automatic deployment-এর জন্য **source ZIP** ব্যবহার করুন। একই project-এ Direct Upload থেকে Git integration বদলানোর পরিবর্তে শুরুতেই Git integration বেছে নিন।

## প্রতিদিনের কাজ

- `content/site.json`: বর্তমান pages, posts, services, locations এবং business settings। নতুন entry-তে existing entry-র schema অনুসরণ করুন; unique lowercase English slug দিন; draft/published status ঠিক রাখুন। Build প্রকাশিত content থেকে HTML ও sitemap তৈরি করে।
- `content/seo.json`: URL অনুযায়ী optional metadata, উদাহরণ: `{"/en/contact/":{"title":"Contact Shera Scrap in Dammam","description":"Contact our team for scrap collection in Dammam.","image":"/resources/my-photo.webp"}}`।
- ছবি/আইকন `public/resources/`-এ রাখুন। Content-এ `/resources/my-photo.webp` লিখুন। নামের uppercase/lowercase একই হতে হবে। GitHub-এ ছবিও commit করুন। বড় ছবি WebP করে resize করুন।
- পরিবর্তনের পর `npm ci`, `npm run build`, `npm test`, `npm run lint` চালান। `npm run preview` দিয়ে local preview দেখা যায়। Local preview সব Cloudflare redirect/header rule অনুকরণ করে না।
- Admin CMS/backend নেই। Content পরিবর্তন GitHub commit ও নতুন build-এর মাধ্যমে প্রকাশ হবে। পুরোনো admin/server code source-এ compatibility/reference হিসেবে আছে, static build-এ অন্তর্ভুক্ত নয়।
- Contact ও quote form WhatsApp-এ প্রস্তুত message খোলে। Visitor-কে WhatsApp-এর Send চাপতে হবে; স্বয়ংক্রিয় message delivery বা server-এ lead storage নেই।

## SEO ও launch verification

প্রতিটি public route-এর নিজস্ব HTML, title, description, canonical, hreflang এবং structured data আছে। Navigation নতুন document লোড করে। JavaScript না চালিয়েও crawler মূল content পড়তে পারে। অজানা URL real 404 পায়; SPA fallback নেই।

Production-এ `/`, `/ar/`, `/en/`, একটি service ও blog URL, `/sitemap.xml`, `/robots.txt`, এবং অজানা URL পরীক্ষা করুন। Google Search Console-এ domain verify করে sitemap জমা দিন; URL Inspection দিয়ে কয়েকটি পেজের live test করুন। Cloudflare-এ crawler block/challenge policy পরীক্ষা করুন যদি AI crawler access চান। pages.dev preview-তে noindex header আছে; মূল domain-এ সেটি থাকবে না।

আলাদা URL crawl করার উপযোগী করা হয়েছে; Google/AI indexing, ranking বা নির্দিষ্ট keyword position নিশ্চিত করা যায় না। Business reviews, certification, address ও marketing claims মালিককে যাচাই করতে হবে। তিনটি পুরোনো image URL ভাঙা ছিল; সেগুলো branded placeholder হয়েছে, নিজের ছবি দিয়ে বদলানো যায়। Demo video বাদ দেওয়া হয়েছে।

## খরচ ও সীমা

এই deployment-এ Functions/Workers/Firebase runtime নেই। Pages Free-এর static requests free/unlimited; build ও file সীমা আছে (বর্তমান Free: মাসে 500 builds, 20,000 files, প্রতি file 25 MiB)। Domain registration/renewal আলাদা। 3,000 simultaneous visitors-এর production load test করা হয়নি; CDN architecture উপযুক্ত হলেও নিশ্চয়তা দাবি করা হচ্ছে না। পুরোনো Firebase/Google Cloud billing এই migration নিজে থেকে বন্ধ করে না।

Official references: https://developers.cloudflare.com/pages/platform/limits/ • https://developers.cloudflare.com/pages/functions/pricing/ • https://developers.cloudflare.com/pages/configuration/custom-domains/ • https://developers.cloudflare.com/pages/configuration/serving-pages/
