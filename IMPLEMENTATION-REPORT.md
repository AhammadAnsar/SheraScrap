# SheraScrap — implementation report

## যা সম্পূর্ণ হয়েছে

- Dammam প্রধান লক্ষ্য রেখে English ও Arabic production homepage; exact H1, material services, selling process, price guide, industrial section, coverage, guides, FAQ ও WhatsApp quote। Navy/green/copper brand colours এবং দেওয়া logo/favicon ব্যবহার করা হয়েছে।
- তালিকার exact ২৪টি এলাকা; English hub `/en/service-areas/`, Arabic hub `/ar/مناطق-الخدمة/`; প্রতিটির আলাদা দুই ভাষার page, local introduction, preparation, প্রশ্নোত্তর, related area links ও preselected quote area। নতুন কোনো এলাকার coverage দাবি যোগ করা হয়নি।
- পুরোনো ৫৪টি URL অক্ষত। Existing guides/services-এর বিভ্রান্তিকর দাবি ও অসম্পূর্ণ description সংশোধন করা হয়েছে।
- প্রতিটি page আলাদা HTML document হিসেবে লোড হয়। Text, headings, links ও schema JavaScript ছাড়াই HTML-এ আছে। React শুধু build-এর সময় render করে; visitor-এর browser script প্রায় ৪ KB, gzip প্রায় ২ KB।
- Mobile navigation, ৩২০px grid, Arabic RTL, LTR phone display, keyboard focus, skip link, native FAQ, fixed WhatsApp/call buttons ও matching language navigation।
- দেওয়া logo, PNG favicon/touch icon, responsive AVIF hero, material illustrations, local photos ও Arabic fonts repository resources-এ।
- Quote form: name, phone, optional WhatsApp, material, quantity, ২৪টি area, message, optional photo preparation। Message WhatsApp-এ খোলে; visitor Send করেন। ছবি সরাসরি chat-এ attach হয় বা supported device-এর share option ব্যবহার হয়।
- Self-canonical, `ar-SA`/`en-SA`/`x-default`, sitemap, Google/Bing verification meta, robots allowances, Markdown links-সহ llms.txt, Organization/LocalBusiness/Service/FAQPage/Article/Breadcrumb structured data।
- Production-only consent-based Google Analytics ID `G-2DQ7V2XJ3E`, privacy policy এবং verified social URLs। Customer form values analytics-এ দেওয়া হয় না।
- IndexNow public key ও production build যাচাইয়ের পরে submission workflow। Deploy হওয়ার আগে পুরোনো content submit হয় না।
- Bare domain-এ country-based language selection; direct page URL স্বাধীন। Bot-এর default Arabic, visitor preference cookie country selection-এর আগে বিবেচিত হয়।
- Lockfile, pinned Wrangler, Node configuration, complete source/resources, GitHub validation workflow ও reproducible build। Pages ও Workers উভয় runtime-এ পরীক্ষা।

## তথ্যের সততা

Stock/illustrative images-কে বাস্তব completed collection বলা হয়নি। যাচাইকৃত job photo, testimonial বা project record না থাকায় “recent collections” section এবং fabricated reviews/payment proof যোগ করা হয়নি। একটি Dammam business entity ব্যবহৃত; প্রতিটি এলাকায় নতুন branch/address/map pin বানানো হয়নি।

Business model material **buying service**। বিক্রির product inventory বা verified offers নেই, তাই বিভ্রান্তিকর Product/Offer markup-এর বদলে Service markup দেওয়া হয়েছে। Price guide মূল্য নির্ধারণের ভিত্তি বোঝায়; fake live price list নয়।

## পরীক্ষার ফল

১১২টি page, পুরোনো ৫৪টি URL, সব local links, canonical/hreflang, ২৯২টি image reference, form ও schema checks পাস। Cloudflare Workers এবং Pages—দুই runtime-এ সব page ২০০, ২৫৮টি static redirect সঠিক, missing URL ৪০৪।

English/Arabic mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100; Agentic Browsing 3/3**। Local laboratory LCP প্রায় ১.৪–১.৬ সেকেন্ড, CLS ০। এটি live domain-এর blanket score guarantee নয়। `reports/`-এ raw ফল আছে।

## Account ও বাস্তব ব্যবসার কাজ

Existing Cloudflare Git connection/domain থাকলে source push-এ deployment হবে। নতুন connection/DNS setup account-এর কাজ; ZIP সেটি বদলায় না। Country-selection function free account-এর দৈনিক function quota ব্যবহার করে, সব content page static। Free plan ও domain বিষয়ে `CLOUDFLARE-PAGES.md`-এ বিস্তারিত আছে।

Google domain DNS verification record রাখতে হবে; sitemap Search Console/Bing-এ submit বা refresh করা যায়। Meta tags account ownership verification-এর সহায়ক, নিজেরা account verify করে না। IndexNow workflow matching live release পেলে submit করে; এই local কাজের সময় কোনো live submission হয়নি।

Google Business Profile/Bing Places-এর ownership, বাস্তব business address/service coverage verification এবং third-party backlinks/mentions account ও ব্যবসার প্রমাণ দিয়ে করতে হবে। এগুলো repository code দিয়ে তৈরি বা যাচাই করা যায় না। Ranking, Google Maps position বা AI recommendation কোনো markup/score নিশ্চিত করতে পারে না।
