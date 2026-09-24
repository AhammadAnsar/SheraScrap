import path from 'path';
import fs from 'fs';
import { SITE_CONFIG, getCanonicalUrl } from '../config/site';
import { 
  getCachedCMSData, 
  getPostBySlug, 
  getPageBySlug, 
  getScrapCategoryBySlug, 
  getServiceBySlug,
  getAllServices,
  getLocationBySlug, 
  getPublishedPosts, 
  getPublishedLocations, 
  getRedirect,
  isContentPublished,
} from '../data/repository';
import { buildSeoMetadata, RenderedSeoTags } from '../seo/seoService';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { resolveRedirect } from './redirectService';
import { verifyPreviewToken } from './previewService';

export interface SsrRenderResult {
  statusCode: number;
  redirectUrl?: string;
  html?: string;
}

/**
 * Escapes HTML characters for safe SSR output
 */
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders server-side HTML response for any incoming request
 */
export async function renderSsrPage(
  urlPath: string, 
  indexHtmlTemplate: string,
  options?: {
    preview?: boolean;
    previewToken?: string;
    user?: any;
  }
): Promise<SsrRenderResult> {
  const cleanUrl = urlPath.split('?')[0];
  const queryStr = urlPath.includes('?') ? urlPath.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryStr);
  const isPreviewRequested = searchParams.get('preview') === 'true' || options?.preview === true;
  const tokenFromQuery = searchParams.get('token') || options?.previewToken;

  const isUserEditor = !!(options?.user && ['super_admin', 'administrator', 'editor', 'author'].includes(options.user.role));

  function checkPreviewAuthorized(entityType: 'post' | 'page', entitySlug: string): boolean {
    if (!isPreviewRequested) return false;
    if (isUserEditor) return true;
    if (tokenFromQuery && verifyPreviewToken(tokenFromQuery, entityType, entitySlug)) {
      return true;
    }
    return false;
  }

  // 1. Resolve redirects (managed redirects, historical patterns, and trailing slash enforcement)
  const redirectResolution = resolveRedirect(cleanUrl);
  if (redirectResolution) {
    return redirectResolution;
  }

  // 1b. Admin Route: Serve secure English SPA shell with noindex
  if (cleanUrl.startsWith('/admin')) {
    const adminSeo = buildSeoMetadata({
      title: 'Admin Portal & Login | Shera Scrap CMS',
      description: 'Secure English administration and content management portal for Shera Scrap.',
      canonicalPath: '/admin/',
      lang: 'en',
      noindex: true,
    });
    const finalHtml = injectSeoAndContent(indexHtmlTemplate, adminSeo, '', 'en');
    return {
      statusCode: 200,
      html: finalHtml,
    };
  }

  // 2. Multilingual Route Resolution
  const segments = cleanUrl.replace(/^\/|\/$/g, '').split('/');
  const langSegment = segments[0];

  if (langSegment !== 'ar' && langSegment !== 'en') {
    // Unknown prefix, return 404
    return render404(indexHtmlTemplate, 'ar', cleanUrl);
  }

  const lang = langSegment as 'ar' | 'en';
  const isAr = lang === 'ar';
  const section = segments[1] || '';
  const itemSlug = segments[2] || '';
  const cmsData = getCachedCMSData();
  const settings = cmsData.settings;

  let seoTags: RenderedSeoTags;
  let bodyContentHtml = '';
  let statusCode = 200;

  // Header navigation HTML for raw HTML crawlers
  const crawlableHeaderHtml = `
    <header class="bg-white border-b border-slate-100 py-4 px-4 sm:px-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
        <div>
          <a href="/${lang}/" class="text-xl font-black text-slate-900">${isAr ? settings.siteTitleAr : settings.siteTitleEn}</a>
          <p class="text-xs text-emerald-600 font-bold">${isAr ? settings.siteTaglineAr : settings.siteTaglineEn}</p>
        </div>
        <nav class="flex items-center gap-4 text-sm font-bold text-slate-700">
          <a href="/${lang}/" class="hover:text-emerald-600">${isAr ? 'الرئيسية' : 'Home'}</a>
          <a href="/${lang}/services/" class="hover:text-emerald-600">${isAr ? 'خدماتنا' : 'Services'}</a>
          <a href="/${lang}/locations/restaurant-equipment-dammam/" class="hover:text-emerald-600">${isAr ? 'معدات المطاعم' : 'Restaurant Equipment'}</a>
          <a href="/${lang}/locations/used-furniture-jubail/" class="hover:text-emerald-600">${isAr ? 'أثاث الجبيل' : 'Jubail Furniture'}</a>
          <a href="/${lang}/blog/" class="hover:text-emerald-600">${isAr ? 'المدونة' : 'Blog'}</a>
          <a href="/${lang}/estimator/" class="hover:text-emerald-600">${isAr ? 'حاسبة الأسعار' : 'Estimator'}</a>
          <a href="/${lang}/about/" class="hover:text-emerald-600">${isAr ? 'من نحن' : 'About Us'}</a>
          <a href="/${lang}/contact/" class="hover:text-emerald-600">${isAr ? 'اتصل بنا' : 'Contact'}</a>
        </nav>
      </div>
    </header>
  `;

  // Crawlable footer HTML
  const crawlableFooterHtml = `
    <footer class="bg-slate-950 text-slate-300 py-12 px-4 sm:px-8 mt-16 border-t border-slate-800">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 class="text-white font-bold mb-3">${isAr ? settings.siteTitleAr : settings.siteTitleEn}</h4>
          <p class="text-xs text-slate-400 leading-relaxed">${isAr ? 'شراء كافة أنواع السكراب والمعادن ومعدات المطاعم والمكيفات بأعلى سعر كاش بالدمام والمنطقة الشرقية.' : 'Certified scrap metal and used equipment purchasing across Dammam and Eastern Province.'}</p>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">${isAr ? 'خدمات السكراب' : 'Services'}</h4>
          <ul class="text-xs space-y-2 text-slate-400">
            <li><a href="/${lang}/services/used-air-conditioners/" class="hover:text-white">${isAr ? 'شراء مكيفات مستعملة وسكراب' : 'Used AC Units'}</a></li>
            <li><a href="/${lang}/services/copper-scrap/" class="hover:text-white">${isAr ? 'شراء سكراب نحاس كاش' : 'Copper Scrap'}</a></li>
            <li><a href="/${lang}/services/iron-scrap/" class="hover:text-white">${isAr ? 'شراء حديد سكراب وهياكل' : 'Iron & Steel Scrap'}</a></li>
            <li><a href="/${lang}/services/aluminum-scrap/" class="hover:text-white">${isAr ? 'شراء ألمنيوم ومطابخ' : 'Aluminum Scrap'}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">${isAr ? 'مناطق التغطية' : 'Locations'}</h4>
          <ul class="text-xs space-y-2 text-slate-400">
            <li><a href="/${lang}/locations/restaurant-equipment-dammam/" class="hover:text-white">${isAr ? 'معدات مطاعم مستعملة بالدمام' : 'Restaurant Equipment Dammam'}</a></li>
            <li><a href="/${lang}/locations/scrap-metals-dammam/" class="hover:text-white">${isAr ? 'محل سكراب وخردة بالدمام' : 'Scrap Metals Dammam'}</a></li>
            <li><a href="/${lang}/locations/used-furniture-jubail/" class="hover:text-white">${isAr ? 'شراء أثاث مستعمل بالجبيل' : 'Used Furniture Jubail'}</a></li>
            <li><a href="/${lang}/locations/ac-scrap-jubail/" class="hover:text-white">${isAr ? 'مكيفات مستعملة بالجبيل' : 'AC Buyers Jubail'}</a></li>
            <li><a href="/${lang}/locations/used-furniture-khobar/" class="hover:text-white">${isAr ? 'أثاث ومعدات بالخبر' : 'Furniture & Scrap Khobar'}</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-bold mb-3">${isAr ? 'تواصل فوري' : 'Contact Us'}</h4>
          <p class="text-xs text-slate-400 mb-2">${isAr ? settings.locationAr : settings.locationEn}</p>
          <p class="text-sm font-black text-emerald-400 mb-1"><a href="tel:${settings.phone}">${settings.phone}</a></p>
          <p class="text-xs text-slate-400">${isAr ? settings.workingHoursAr : settings.workingHoursEn}</p>
        </div>
      </div>
      <div class="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 text-center text-xs text-slate-500">
        <p>${isAr ? 'جميع الحقوق محفوظة © مؤسسة شيرا لشراء السكراب والمعدات بالدمام' : 'All rights reserved © Shera Scrap Purchasing Dammam'}</p>
      </div>
    </footer>
  `;

  // Route 1: Homepage
  if (!section) {
    const title = isAr ? settings.seoTitleAr || settings.siteTitleAr : settings.seoTitleEn || settings.siteTitleEn;
    const desc = isAr ? settings.seoDescriptionAr : settings.seoDescriptionEn;

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/`,
      lang,
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-7xl mx-auto px-4 py-12">
        <section class="text-center max-w-4xl mx-auto mb-16">
          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 leading-tight mb-6">
            ${isAr ? 'مؤسسة شيرا | شراء سكراب ومعدات مطاعم ومكيفات بالدمام' : 'Shera Scrap | Scrap Metal, AC & Restaurant Equipment Buyers in Dammam'}
          </h1>
          <p class="text-slate-600 text-lg leading-relaxed mb-8">
            ${escapeHtml(desc)}
          </p>
          <div class="flex justify-center gap-4 flex-wrap">
            <a href="tel:${settings.phone}" class="bg-slate-900 text-white font-bold px-6 py-3.5 rounded-xl text-sm">
              ${isAr ? `اتصل الآن: ${settings.phone}` : `Call Now: ${settings.phone}`}
            </a>
            <a href="https://wa.me/${settings.whatsapp}" class="bg-emerald-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm">
              ${isAr ? 'واتساب لمعاينة فورية كاش' : 'WhatsApp for Instant Cash Valuation'}
            </a>
          </div>
        </section>

        <!-- Services Highlights -->
        <section class="mb-16">
          <h2 class="text-2xl font-black text-slate-900 mb-6 text-center">${isAr ? 'خدمات شراء السكراب والمعادن' : 'Scrap Purchasing Services'}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${(cmsData.categories || []).map(cat => `
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 class="text-lg font-bold text-slate-900 mb-2">
                  <a href="/${lang}/services/${cat.slug || cat.id}/" class="text-emerald-700 hover:underline">
                    ${isAr ? cat.nameAr : cat.nameEn}
                  </a>
                </h3>
                <p class="text-xs text-slate-600 mb-3">${isAr ? cat.descriptionAr : cat.descriptionEn}</p>
                <span class="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-md">
                  ${isAr ? cat.rateEstimateAr : cat.rateEstimateEn}
                </span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Location Landing Pages Links -->
        <section class="mb-16 bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <h2 class="text-2xl font-black text-slate-900 mb-4">${isAr ? 'تغطية مناطق الخدمة بالمنطقة الشرقية' : 'Service Coverage Areas'}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a href="/${lang}/locations/restaurant-equipment-dammam/" class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 font-bold text-slate-900 text-sm">
              ${isAr ? '📍 شراء معدات مطاعم مستعملة بالدمام' : '📍 Used Restaurant Equipment Dammam'}
            </a>
            <a href="/${lang}/locations/scrap-metals-dammam/" class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 font-bold text-slate-900 text-sm">
              ${isAr ? '📍 شراء الخردوات والسكراب بالدمام' : '📍 Scrap Metals & Yard Dammam'}
            </a>
            <a href="/${lang}/locations/used-furniture-jubail/" class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 font-bold text-slate-900 text-sm">
              ${isAr ? '📍 شراء أثاث مستعمل بالجبيل' : '📍 Buy Used Furniture in Jubail'}
            </a>
            <a href="/${lang}/locations/ac-scrap-jubail/" class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 font-bold text-slate-900 text-sm">
              ${isAr ? '📍 مكيفات سكراب ومستعملة بالجبيل' : '📍 Used & Scrap AC in Jubail'}
            </a>
            <a href="/${lang}/locations/used-furniture-khobar/" class="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 font-bold text-slate-900 text-sm">
              ${isAr ? '📍 أثاث ومعدات مستعملة بالخبر' : '📍 Used Furniture & Equipment Khobar'}
            </a>
          </div>
        </section>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 2: Services Archive
  } else if (section === 'services' && !itemSlug) {
    const title = isAr ? 'خدمات شراء السكراب والمعادن بالدمام' : 'Scrap Metal & Equipment Purchasing Services Dammam';
    const desc = isAr ? 'تصفح كافة خدماتنا في شراء سكراب النحاس، الحديد، الألمنيوم، المكيفات، ومعدات المطاعم مع الفك والتحميل الفوري المجاني.' : 'Explore our comprehensive scrap purchasing services in Dammam with free on-site pickup and instant cash.';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/services/`,
      lang,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'خدماتنا' : 'Services', path: `/${lang}/services/` },
      ],
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center">${title}</h1>
        <p class="text-slate-600 text-center max-w-3xl mx-auto mb-12">${desc}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${(cmsData.categories || []).map(cat => `
            <article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div class="p-6">
                <h2 class="text-xl font-bold text-slate-900 mb-2">
                  <a href="/${lang}/services/${cat.slug || cat.id}/" class="text-emerald-700 hover:underline">
                    ${isAr ? cat.nameAr : cat.nameEn}
                  </a>
                </h2>
                <p class="text-sm text-slate-600 mb-4">${isAr ? cat.descriptionAr : cat.descriptionEn}</p>
                <div class="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span class="text-emerald-600 font-extrabold text-sm">${isAr ? cat.rateEstimateAr : cat.rateEstimateEn}</span>
                  <a href="/${lang}/services/${cat.slug || cat.id}/" class="text-xs font-bold text-slate-900 underline">
                    ${isAr ? 'التفاصيل والبيع ←' : 'View Details →'}
                  </a>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 3: Service Single / Category Single
  } else if (section === 'services' && itemSlug) {
    const category = getScrapCategoryBySlug(itemSlug);
    const service = !category ? getServiceBySlug(itemSlug) : null;
    if (!category && !service) {
      return render404(indexHtmlTemplate, lang, cleanUrl);
    }

    const name = category ? (isAr ? category.nameAr : category.nameEn) : (isAr ? service.titleAr : service.titleEn);
    const title = category 
      ? (isAr ? `${category.nameAr} | شراء سكراب بالدمام` : `${category.nameEn} | Scrap Buyer in Dammam`)
      : (isAr ? `${service.titleAr} | شراء وتثمين سكراب بالدمام` : `${service.titleEn} | Shera Scrap Services Dammam`);
    const desc = category ? (isAr ? category.descriptionAr : category.descriptionEn) : (isAr ? service.descriptionAr : service.descriptionEn);
    const rate = category ? (isAr ? category.rateEstimateAr : category.rateEstimateEn) : (isAr ? 'أعلى سعر كاش فوري' : 'Highest Cash Payout');
    const slug = category ? category.slug : service.slug;
    const image = (category && category.featuredImage) || (service && service.image) || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&h=630&q=80';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/services/${slug}/`,
      lang,
      type: 'service',
      image,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'الخدمات' : 'Services', path: `/${lang}/services/` },
        { name, path: `/${lang}/services/${slug}/` },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': name,
        'description': desc,
        'provider': {
          '@type': 'RecyclingCenter',
          'name': SITE_CONFIG.business.nameAr,
          'telephone': SITE_CONFIG.business.phone,
        },
        'areaServed': {
          '@type': 'City',
          'name': 'Dammam',
        },
      }
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <nav class="text-xs text-slate-500 font-bold mb-6 flex gap-2">
          <a href="/${lang}/" class="hover:text-emerald-600">${isAr ? 'الرئيسية' : 'Home'}</a> /
          <a href="/${lang}/services/" class="hover:text-emerald-600">${isAr ? 'الخدمات' : 'Services'}</a> /
          <span class="text-slate-900">${escapeHtml(name)}</span>
        </nav>
        <article class="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4">${escapeHtml(name)}</h1>
          <p class="text-lg text-slate-700 leading-relaxed mb-8">${escapeHtml(desc)}</p>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <span class="text-xs font-bold text-slate-500 block uppercase">${isAr ? 'السعر التقديري بالدمام' : 'Estimated Rate in Dammam'}</span>
              <span class="text-2xl font-black text-emerald-600">${escapeHtml(rate)}</span>
            </div>
            <a href="https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(isAr ? `السلام عليكم، لدي ${name} للبيع بالدمام.` : `Hello, I want to sell ${name} in Dammam.`)}" class="bg-emerald-600 text-slate-950 font-black px-6 py-3 rounded-xl">
              ${isAr ? 'طلب تسعير وبيع عبر الواتساب' : 'Request Quote via WhatsApp'}
            </a>
          </div>
        </article>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 4a: Locations Archive
  } else if (section === 'locations' && !itemSlug) {
    const title = isAr ? 'مناطق تغطية شراء السكراب والمعدات بالمنطقة الشرقية' : 'Scrap & Used Equipment Coverage Areas | Eastern Province';
    const desc = isAr ? 'نشتري السكراب ومعدات المطاعم والمكيفات والأثاث المستعمل بالدمام، الخبر، الجبيل، والقطيف مع النقل والتثمين الفوري المجاني.' : 'Scrap purchasing and used equipment collection services across Dammam, Khobar, Jubail, and Qatif with free transportation.';
    const locations = getPublishedLocations();

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/locations/`,
      lang,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'المناطق' : 'Locations', path: `/${lang}/locations/` },
      ],
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center">${escapeHtml(title)}</h1>
        <p class="text-slate-600 text-center max-w-3xl mx-auto mb-12">${escapeHtml(desc)}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${locations.map(loc => `
            <article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6 flex flex-col justify-between">
              <div>
                <span class="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-md mb-3">${escapeHtml(isAr ? loc.cityAr : loc.cityEn)}</span>
                <h2 class="text-xl font-bold text-slate-900 mb-2">
                  <a href="/${lang}/locations/${loc.slug}/" class="hover:text-emerald-600">
                    ${escapeHtml(isAr ? loc.titleAr : loc.titleEn)}
                  </a>
                </h2>
                <p class="text-xs text-slate-600 mb-4 leading-relaxed">${escapeHtml(isAr ? loc.metaDescriptionAr : loc.metaDescriptionEn)}</p>
              </div>
              <div class="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <a href="tel:${loc.phone || settings.phone}" class="text-slate-900 font-bold">${escapeHtml(loc.phone || settings.phone)}</a>
                <a href="/${lang}/locations/${loc.slug}/" class="text-emerald-700 font-bold underline">${isAr ? 'عرض المنطقة ←' : 'View Location →'}</a>
              </div>
            </article>
          `).join('')}
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 4b: Location Landing Page (Phase 10 Target Intents)
  } else if (section === 'locations' && itemSlug) {
    const loc = getLocationBySlug(itemSlug);
    if (!loc || !loc.isPublished) {
      return render404(indexHtmlTemplate, lang, cleanUrl);
    }

    const title = isAr ? loc.titleAr : loc.titleEn;
    const desc = isAr ? loc.metaDescriptionAr : loc.metaDescriptionEn;
    const content = isAr ? loc.contentAr : loc.contentEn;
    const city = isAr ? loc.cityAr : loc.cityEn;
    const services = isAr ? loc.servicesOfferedAr : loc.servicesOfferedEn;

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/locations/${loc.slug}/`,
      lang,
      type: 'service',
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'المناطق' : 'Locations', path: `/${lang}/services/` },
        { name: city, path: `/${lang}/locations/${loc.slug}/` },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': title,
        'description': desc,
        'telephone': loc.phone || SITE_CONFIG.business.phone,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': city,
          'addressRegion': 'المنطقة الشرقية',
          'addressCountry': 'SA',
        },
      }
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-5xl mx-auto px-4 py-12">
        <nav class="text-xs text-slate-500 font-bold mb-6 flex gap-2">
          <a href="/${lang}/" class="hover:text-emerald-600">${isAr ? 'الرئيسية' : 'Home'}</a> /
          <a href="/${lang}/services/" class="hover:text-emerald-600">${isAr ? 'المناطق والخدمات' : 'Locations & Services'}</a> /
          <span class="text-slate-900">${city}</span>
        </nav>

        <section class="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-10">
          <span class="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
            ${isAr ? `تغطية ${city}` : `${city} Coverage`}
          </span>
          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">${escapeHtml(title)}</h1>
          <p class="text-slate-300 text-base md:text-lg mb-8 max-w-3xl">${escapeHtml(desc)}</p>
          <div class="flex gap-4 flex-wrap">
            <a href="https://wa.me/${settings.whatsapp}" class="bg-emerald-600 text-slate-950 font-black px-6 py-3.5 rounded-xl">
              ${isAr ? 'تواصل واتساب لمعالجة فورية' : 'Instant WhatsApp Dispatch'}
            </a>
            <a href="tel:${loc.phone || settings.phone}" class="bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl border border-slate-700">
              ${loc.phone || settings.phone}
            </a>
          </div>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 class="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              ${isAr ? `تفاصيل الخدمة والمعاينة في ${city}` : `Service Details in ${city}`}
            </h2>
            <div class="text-slate-700 leading-relaxed whitespace-pre-line text-base">
              ${escapeHtml(content)}
            </div>
          </div>

          <aside class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 class="text-lg font-bold text-slate-900 mb-4">${isAr ? 'الخدمات المشمولة' : 'Included Services'}</h3>
              <ul class="space-y-2 text-sm text-slate-700">
                ${services.map(s => `<li>✓ ${escapeHtml(s)}</li>`).join('')}
              </ul>
            </div>
          </aside>
        </section>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 5: Blog Archive
  } else if (section === 'blog' && !itemSlug) {
    const title = isAr ? 'مدونة وأخبار السكراب بالدمام' : 'Scrap Trading Blog & Market News';
    const desc = isAr ? 'أحدث المقالات والإرشادات لتسعير وفرز السكراب والمعادن والمكيفات المستعملة بالمنطقة الشرقية.' : 'Educational guides on metal scrap recycling, AC valuations, and daily price trends.';
    const posts = getPublishedPosts(lang);

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/blog/`,
      lang,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'المدونة' : 'Blog', path: `/${lang}/blog/` },
      ],
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center">${title}</h1>
        <p class="text-slate-600 text-center max-w-2xl mx-auto mb-12">${desc}</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${posts.map(post => `
            <article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div class="p-6">
                <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md mb-3 inline-block">${post.category}</span>
                <h2 class="text-lg font-bold text-slate-900 mb-2">
                  <a href="/${lang}/blog/${post.slug || post.id}/" class="hover:text-purple-700">
                    ${isAr ? post.titleAr : post.titleEn}
                  </a>
                </h2>
                <p class="text-xs text-slate-600 leading-relaxed mb-4">${isAr ? post.excerptAr : post.excerptEn}</p>
              </div>
              <div class="p-6 pt-0 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>${post.date}</span>
                <a href="/${lang}/blog/${post.slug || post.id}/" class="text-purple-700 font-bold underline">
                  ${isAr ? 'اقرأ المقال ←' : 'Read Article →'}
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 6: Single Blog Post
  } else if (section === 'blog' && itemSlug) {
    const isAuthorized = checkPreviewAuthorized('post', itemSlug);
    const post = getPostBySlug(itemSlug, isAuthorized);
    if (!post || (!isContentPublished(post) && !isAuthorized)) {
      return render404(indexHtmlTemplate, lang, cleanUrl);
    }

    const title = isAr ? post.titleAr : post.titleEn;
    const desc = isAr ? post.excerptAr : post.excerptEn;
    const content = isAr ? post.contentAr : post.contentEn;

    const isPreviewActive = isAuthorized && !isContentPublished(post);

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/blog/${post.slug}/`,
      lang,
      type: 'article',
      image: post.featuredImage,
      publishedTime: post.date,
      noindex: isPreviewActive,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'المدونة' : 'Blog', path: `/${lang}/blog/` },
        { name: title, path: `/${lang}/blog/${post.slug}/` },
      ],
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': desc,
        'image': post.featuredImage,
        'datePublished': post.date,
        'author': {
          '@type': 'Person',
          'name': post.author || 'Shera Scrap Editor',
        },
        'publisher': {
          '@type': 'Organization',
          'name': SITE_CONFIG.business.nameAr,
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=300&q=80',
          },
        },
      }
    });

    const previewBannerHtml = isPreviewActive ? `
      <aside aria-label="CMS Preview Notice" class="sticky top-0 z-50 bg-amber-400 text-slate-950 font-sans px-4 py-2.5 shadow-lg border-b border-amber-500" dir="ltr">
        <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div class="flex items-center gap-2 font-bold">
            <span class="bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">Preview Mode</span>
            <span>Status: <strong class="uppercase text-slate-950">${post.status}</strong></span>
            ${post.scheduledFor ? `<span>• Scheduled For: <strong>${new Date(post.scheduledFor).toLocaleString()}</strong></span>` : ''}
            <span class="hidden md:inline text-amber-950 font-normal">| Only visible to authorized editors. Excluded from public index.</span>
          </div>
          <div class="flex items-center gap-2">
            <a href="/admin/#/posts" class="bg-slate-950 hover:bg-slate-800 text-white font-bold px-3 py-1 rounded text-xs transition-colors">
              Return to CMS
            </a>
          </div>
        </div>
      </aside>
    ` : '';

    bodyContentHtml = `
      ${previewBannerHtml}
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <nav class="text-xs text-slate-500 font-bold mb-6 flex gap-2">
          <a href="/${lang}/" class="hover:text-purple-600">${isAr ? 'الرئيسية' : 'Home'}</a> /
          <a href="/${lang}/blog/" class="hover:text-purple-600">${isAr ? 'المدونة' : 'Blog'}</a> /
          <span class="text-slate-900 truncate">${title}</span>
        </nav>

        <article class="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
          <div class="flex items-center gap-4 text-xs text-slate-500 mb-6 font-bold">
            <span class="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">${post.category}</span>
            <span>${post.date}</span>
            <span>${post.author}</span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-slate-900 mb-8 leading-snug">${escapeHtml(title)}</h1>
          <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4">
            ${escapeHtml(content)}
          </div>
        </article>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 7: About Page
  } else if (section === 'about') {
    const title = isAr ? 'من نحن | مؤسسة شيرا لشراء السكراب والمعدات' : 'About Us | Shera Scrap Purchasing Dammam';
    const desc = isAr ? 'تعرف على مؤسسة شيرا المتخصصة في شراء وتدوير السكراب والمعادن ومعدات المطاعم بالدمام والمنطقة الشرقية.' : 'Learn about Shera Scrap, leading metal scrap recycling and restaurant equipment buyers in Dammam.';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/about/`,
      lang,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'من نحن' : 'About Us', path: `/${lang}/about/` },
      ],
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-6 text-center">${title}</h1>
        <p class="text-slate-600 text-lg leading-relaxed text-center mb-12">${desc}</p>
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-slate-700 leading-relaxed">
          <h2 class="text-2xl font-bold text-slate-900">${isAr ? 'رؤيتنا ورسالتنا' : 'Our Mission'}</h2>
          <p>${isAr ? 'نسعى لتوفير أسهل وأسرع حلول بيع السكراب والمعادن والأجهزة المستعملة للأفراد والشركات والمصانع بالمنطقة الشرقية مع الالتزام بأعلى معايير الشفافية والدفع الكاش الفوري.' : 'We provide streamlined scrap metal liquidation for residences, commercial businesses and factories with instant cash payouts and certified digital weighing.'}</p>
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 8: Contact Page
  } else if (section === 'contact') {
    const title = isAr ? 'اتصل بنا | طلب معاينة وشراء سكراب بالدمام' : 'Contact Us | Scrap Evaluation & Pickup';
    const desc = isAr ? 'تواصل مع مؤسسة شيرا للمعاينة الفورية وشراء السكراب والمكيفات ومعدات المطاعم بالدمام والخبر والجبيل.' : 'Get in touch with Shera Scrap for instant free on-site valuation across Dammam, Khobar and Jubail.';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/contact/`,
      lang,
      breadcrumbs: [
        { name: isAr ? 'الرئيسية' : 'Home', path: `/${lang}/` },
        { name: isAr ? 'اتصل بنا' : 'Contact Us', path: `/${lang}/contact/` },
      ],
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center">${title}</h1>
        <p class="text-slate-600 text-center mb-10">${desc}</p>
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
          <p class="text-2xl font-black text-emerald-600 mb-2"><a href="tel:${settings.phone}">${settings.phone}</a></p>
          <p class="text-slate-500 mb-6">${isAr ? settings.locationAr : settings.locationEn}</p>
          <a href="https://wa.me/${settings.whatsapp}" class="inline-block bg-emerald-600 text-slate-950 font-black px-8 py-3.5 rounded-xl">
            ${isAr ? 'محادثة فورية على الواتساب' : 'Chat on WhatsApp'}
          </a>
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 9: Price Estimator Page
  } else if (section === 'estimator') {
    const title = isAr ? 'حاسبة أسعار السكراب | تسعير فوري بالدمام' : 'Scrap Metal Price Estimator | Dammam';
    const desc = isAr ? 'احسب القيمة التقديرية لسكراب النحاس والحديد والمكيفات بالدمام طبقاً لأسعار البورصة اليوم.' : 'Get instant cash estimates for copper, iron, AC units and scrap materials in Dammam.';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/estimator/`,
      lang,
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4">${title}</h1>
        <p class="text-slate-600 mb-8">${desc}</p>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 10: FAQ Page
  } else if (section === 'faq') {
    const title = isAr ? 'الأسئلة الشائعة حول بيع السكراب والمعادن' : 'Frequently Asked Questions | Shera Scrap';
    const desc = isAr ? 'إجابات عن موازين التثمين، تسليم الكاش الفوري، والنقل المجاني لكافة كميات السكراب بالدمام.' : 'All your questions answered about calibrated weighing, free trucking, and instant cash payment.';

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/faq/`,
      lang,
    });

    bodyContentHtml = `
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 text-center">${title}</h1>
        <p class="text-slate-600 text-center mb-10">${desc}</p>
      </main>
      ${crawlableFooterHtml}
    `;

  // Route 11: Custom Dynamic Pages
  } else if (section === 'pages' && itemSlug) {
    const isAuthorized = checkPreviewAuthorized('page', itemSlug);
    const page = getPageBySlug(itemSlug, isAuthorized);
    if (!page || (!isContentPublished(page) && !isAuthorized)) {
      return render404(indexHtmlTemplate, lang, cleanUrl);
    }

    const isPreviewActive = isAuthorized && !isContentPublished(page);
    const title = isAr ? page.seoTitleAr || page.titleAr : page.seoTitleEn || page.titleEn;
    const desc = isAr ? page.seoDescriptionAr : page.seoDescriptionEn;
    const content = isAr ? page.contentAr : page.contentEn;

    seoTags = buildSeoMetadata({
      title,
      description: desc,
      canonicalPath: `/${lang}/pages/${page.slug}/`,
      lang,
      noindex: isPreviewActive,
    });

    const previewBannerHtml = isPreviewActive ? `
      <aside aria-label="CMS Preview Notice" class="sticky top-0 z-50 bg-amber-400 text-slate-950 font-sans px-4 py-2.5 shadow-lg border-b border-amber-500" dir="ltr">
        <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div class="flex items-center gap-2 font-bold">
            <span class="bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider">Preview Mode</span>
            <span>Status: <strong class="uppercase text-slate-950">${page.status || 'DRAFT'}</strong></span>
            ${page.scheduledFor ? `<span>• Scheduled For: <strong>${new Date(page.scheduledFor).toLocaleString()}</strong></span>` : ''}
            <span class="hidden md:inline text-amber-950 font-normal">| Only visible to authorized editors. Excluded from public index.</span>
          </div>
          <div class="flex items-center gap-2">
            <a href="/admin/#/pages" class="bg-slate-950 hover:bg-slate-800 text-white font-bold px-3 py-1 rounded text-xs transition-colors">
              Return to CMS
            </a>
          </div>
        </div>
      </aside>
    ` : '';

    bodyContentHtml = `
      ${previewBannerHtml}
      ${crawlableHeaderHtml}
      <main class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-8">${escapeHtml(isAr ? page.titleAr : page.titleEn)}</h1>
        <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed">
          ${sanitizeHtml(content)}
        </div>
      </main>
      ${crawlableFooterHtml}
    `;

  // Unknown route -> 404
  } else {
    return render404(indexHtmlTemplate, lang, cleanUrl);
  }

  // Inject into indexHtmlTemplate
  const finalHtml = injectSeoAndContent(indexHtmlTemplate, seoTags, bodyContentHtml, lang);

  return {
    statusCode,
    html: finalHtml,
  };
}

/**
 * Generates an architectural 404 HTTP status response with rendered HTML
 */
function render404(indexHtmlTemplate: string, lang: 'ar' | 'en', path: string): SsrRenderResult {
  const isAr = lang === 'ar';
  const seoTags = buildSeoMetadata({
    title: isAr ? '404 - الصفحة غير موجودة' : '404 - Page Not Found',
    description: isAr ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' : 'The page you requested was not found.',
    canonicalPath: `/${lang}/404`,
    lang,
    noindex: true,
  });

  const bodyContentHtml = `
    <header class="bg-white border-b border-slate-100 py-4 px-4 text-center">
      <a href="/${lang}/" class="text-xl font-black text-slate-900">${isAr ? SITE_CONFIG.business.nameAr : SITE_CONFIG.business.nameEn}</a>
    </header>
    <main class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <span class="text-emerald-600 font-black text-7xl mb-4">404</span>
      <h1 class="text-3xl font-black text-slate-900 mb-4">${isAr ? 'الصفحة المطلوبة غير موجودة' : 'Page Not Found'}</h1>
      <p class="text-slate-600 mb-8 max-w-md">${isAr ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم تغيير مسارها.' : 'Sorry, the page you requested does not exist or has moved.'}</p>
      <a href="/${lang}/" class="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl shadow-md">${isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</a>
    </main>
  `;

  const finalHtml = injectSeoAndContent(indexHtmlTemplate, seoTags, bodyContentHtml, lang);

  return {
    statusCode: 404,
    html: finalHtml,
  };
}

/**
 * Injects SEO tags, structured data, html lang/dir attributes and server-rendered content into base index.html
 */
function injectSeoAndContent(
  template: string, 
  seo: RenderedSeoTags, 
  bodyContent: string, 
  lang: 'ar' | 'en'
): string {
  const isRtl = lang === 'ar';
  let result = template;

  // Set html lang and dir
  result = result.replace(/<html[^>]*>/i, `<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}" class="dark">`);

  // Replace <title>...</title> if template had any
  if (result.includes('<title>')) {
    result = result.replace(/<title>[\s\S]*?<\/title>/i, '');
  }

  // Inject dynamic SEO meta tags and Schema JSON-LD cleanly
  if (result.includes('<!-- SSR_HEAD_INJECTION -->')) {
    result = result.replace('<!-- SSR_HEAD_INJECTION -->', `${seo.metaTagsHtml}\n    ${seo.jsonLdHtml}`);
  } else {
    const headAdditions = `\n    ${seo.metaTagsHtml}\n    ${seo.jsonLdHtml}\n  </head>`;
    result = result.replace(/<\/head>/i, headAdditions);
  }

  // Inject pre-rendered body content into <div id="root">
  const rootEmptyTag = '<div id="root"></div>';
  const rootOpenTag = '<div id="root">';
  if (result.includes(rootEmptyTag)) {
    result = result.replace(rootEmptyTag, `<div id="root">${bodyContent}</div>`);
  } else if (result.includes(rootOpenTag)) {
    result = result.replace(rootOpenTag, `${rootOpenTag}${bodyContent}`);
  }

  return result;
}
