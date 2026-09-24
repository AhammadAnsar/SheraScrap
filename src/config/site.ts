/**
 * Canonical Site Configuration for Shera Scrap Haraj
 * Single Source of Truth for domain, branding, contact, and multilingual settings.
 */

export const SITE_CONFIG = {
  canonicalDomain: "https://sherascrap.com",
  defaultLanguage: "ar" as const,
  supportedLanguages: ["ar", "en"] as const,
  
  business: {
    nameAr: "مؤسسة شيرا لشراء السكراب والمعدات بالدمام",
    nameEn: "Shera Scrap Purchasing & Recycling Dammam",
    shortNameAr: "شيرا سكراب",
    shortNameEn: "Shera Scrap",
    phone: "+966573690164",
    phoneDisplay: "057 369 0164",
    whatsapp: "966573690164",
    email: "info@sherascrap.com",
    addressAr: "حي الخالدية، الدمام 32232، المنطقة الشرقية، المملكة العربية السعودية",
    addressEn: "Al Khaldiyah District, Dammam 32232, Eastern Province, Saudi Arabia",
    cityAr: "الدمام",
    cityEn: "Dammam",
    countryCode: "SA",
    geo: {
      latitude: 26.4344,
      longitude: 50.1033,
    },
    openingHours: "Mo-Su 00:00-23:59",
    openingHoursDisplayAr: "خدمة 24 ساعة / 7 أيام طوال الأسبوع",
    openingHoursDisplayEn: "24/7 Scrap Collection & Cash Payout",
    priceRange: "SAR",
  },

  social: {
    facebook: "https://facebook.com/sherascrap",
    twitter: "https://twitter.com/sherascrap",
    instagram: "https://instagram.com/sherascrap",
    tiktok: "https://tiktok.com/@sherascrap",
    youtube: "https://youtube.com/@sherascrap",
  },
};

export type SupportedLanguage = (typeof SITE_CONFIG.supportedLanguages)[number];

export function getCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Ensure trailing slash for directory routes, maintain clean URL
  const normalized = cleanPath === "/" ? "" : cleanPath.replace(/\/+$/, "") + "/";
  return `${SITE_CONFIG.canonicalDomain}${normalized}`;
}
