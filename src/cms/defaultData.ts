import { CMSData } from './types';

export const initialCMSData: CMSData = {
  settings: {
    siteTitleAr: "Shera Scrap Haraj - حراج أفضل سكراب",
    siteTitleEn: "Shera Scrap Haraj - Best Metal Scrap Dealer",
    siteTaglineAr: "Best Metal Scrap Dealer",
    siteTaglineEn: "Best Metal Scrap Dealer",
    siteIcon: "/resources/e133392db4d8bc98.webp",
    siteLogo: "",
    phone: "0573690164",
    whatsapp: "966573690164",
    email: "info@sherascrap.com",
    locationAr: "الدمام - حي الخالدية - المنطقة الشرقية، المملكة العربية السعودية",
    locationEn: "Dammam - Al Khaldiyah - Eastern Province, Saudi Arabia",
    workingHoursAr: "24 ساعة / 7 أيام في الأسبوع",
    workingHoursEn: "24 Hours / 7 Days a Week",
    announcementBarAr: "⚡️ نشتري السكراب بأعلى سعر اليوم في الدمام والشرقية! تواصل الآن كاش فوري ونقل مجاني 🚛",
    announcementBarEn: "⚡️ We buy all scrap at top market prices today in Dammam & Eastern Province! Instant cash payout 🚛",
    showAnnouncementBar: true,
    seoTitleAr: "شراء سكراب بالدمام | مكيفات مستعملة، نحاس، حديد، سيارات - شيرا",
    seoTitleEn: "Sell Scrap Metal Dammam | Used ACs, Copper, Iron, Vehicles - Shera",
    seoDescriptionAr: "المؤسسة الرسمية المعتمدة لشراء السكراب والحديد والنحاس والأجهزة الكهربائية بالدمام والشرقية بأعلى سعر تسليم كاش فورياً ونقل مجاني من موقعك.",
    seoDescriptionEn: "Official certified scrap buyers in Dammam & Eastern Province. Selling copper, iron, ACs, and industrial scrap with free dismantling and instant cash.",
    siteKeywordsAr: "شراء سكراب بالدمام, سكراب نحاس, سكراب حديد, مكيفات مستعملة, حراج سكراب الشرقية",
    siteKeywordsEn: "Scrap metal Dammam, sell used ACs Dammam, copper scrap prices, iron scrap buyers",

    // Webmaster & Analytics
    googleWebmasterCode: "",
    bingWebmasterCode: "msvalidate.01=shera_scrap_bing_code",
    analyticsCode: "G-SHERA123456",

    // SEO Extras
    imageSeoAltRule: "{title} - شركة شيرا لشراء السكراب بالدمام والشرقية",
    autoImageAltEnabled: true,
    llmsTxtContent: `# Shera Scrap Haraj - Certified Metal & Equipment Buyers in Dammam
> Official Scrap Metals & Used Equipment Buying Service in Eastern Province, KSA
Domain: https://sherascrap.com

## Core Services
- Copper Scrap Purchasing (Red & Yellow Copper)
- Used Air Conditioners (Central, Split, Window ACs)
- Heavy Scrap Iron & Demolition Metals
- Scrap Cars, Heavy Vehicles & Machinery
- Stainless Steel & Aluminum Scrap

## Contact Details
- Phone: +966 57 369 0164
- Email: info@sherascrap.com
- Website: https://sherascrap.com
- Location: Dammam - Al Khaldiyah, Eastern Province, Saudi Arabia
- Cash Payout: Instant on-site cash payment with free transportation`,
    localSeoName: "مؤسسة شيرا لشراء السكراب والمعدات بالدمام",
    localSeoAddress: "حي الخالدية، الدمام 32232، المنطقة الشرقية، المملكة العربية السعودية",
    localSeoGeo: "26.4344, 50.1033",
    localSeoHours: "Mo-Su 00:00-23:59",
    redirections: [
      { id: "red-1", fromUrl: "/old-scrap-rates", toUrl: "/#estimator", type: "301", active: true },
      { id: "red-2", fromUrl: "/contact-us-old", toUrl: "/#contact", type: "301", active: true }
    ],
    schemaJsonLd: `{
  "@context": "https://schema.org",
  "@type": "RecyclingCenter",
  "@id": "https://sherascrap.com/#organization",
  "name": "مؤسسة شيرا لشراء السكراب بالدمام",
  "url": "https://sherascrap.com",
  "image": "/resources/908d153f3fdeae69.webp",
  "telephone": "+966573690164",
  "email": "info@sherascrap.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "حي الخالدية",
    "addressLocality": "الدمام",
    "addressRegion": "المنطقة الشرقية",
    "addressCountry": "SA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 26.4344,
    "longitude": 50.1033
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}`,
    sitemapUrl: "https://sherascrap.com/sitemap.xml",
    sitemapAutoGenerate: true,
    robotsTxtContent: `User-agent: *\nAllow: /\nSitemap: https://sherascrap.com/sitemap.xml`,

    facebookUrl: "https://facebook.com/sherascrap",
    twitterUrl: "https://twitter.com/sherascrap",
    instagramUrl: "https://instagram.com/sherascrap",
    youtubeUrl: "https://youtube.com/@sherascrap",
    tiktokUrl: "https://tiktok.com/@sherascrap",
    googleMapEmbedUrl: "https://maps.google.com/maps?q=King%20Khaled%20St,%20Al%20Athir,%20Dammam%2032248,%20Saudi%20Arabia&t=&z=15&ie=UTF8&iwloc=&output=embed",
    currencyAr: "ر.س",
    currencyEn: "SAR"
  },
  pages: [
    {
      id: "page-home",
      slug: "home",
      titleAr: "الرئيسية",
      titleEn: "Home",
      seoTitleAr: "شراء سكراب بالدمام والشرقية | مؤسسة شيرا",
      seoTitleEn: "Scrap Buyers Dammam | Shera Scrap Enterprise",
      seoDescriptionAr: "الصفحة الرئيسية لمؤسسة شيرا المعتمدة لشراء كافة أنواع سكراب المعادن والمكيفات بأعلى أسعار الكاش.",
      seoDescriptionEn: "Home page for official certified scrap metal buyers in Dammam & Eastern Province.",
      contentAr: "أهلاً بكم في مؤسسة شيرا لشراء السكراب بالدمام. نتميز بتقديم أعلى سعر كاش ونقل مجاني فوري.",
      contentEn: "Welcome to Shera Scrap Trading. Top market cash prices with free pickup.",
      isPublished: true,
      updatedAt: "2026-07-22"
    },
    {
      id: "page-about",
      slug: "about",
      titleAr: "من نحن",
      titleEn: "About Us",
      seoTitleAr: "من نحن | مؤسسة شيرا لشراء السكراب",
      seoTitleEn: "About Us | Shera Scrap Haraj Dammam",
      seoDescriptionAr: "تعرف على تاريخ وخبرة مؤسسة شيرا في مجال تجارة وإعادة تدوير السكراب بالمنطقة الشرقية.",
      seoDescriptionEn: "Learn about Shera's legacy in certified scrap metal trading and recycling in Eastern Province.",
      contentAr: "مؤسسة شيرا هي إحدى كبرى المؤسسات المعتمدة بالدمام المتخصصة في تجارة وتجميع وتدوير السكراب والمعادن.",
      contentEn: "Shera Enterprise is a leading certified organization in Dammam for scrap trading and logistics.",
      isPublished: true,
      updatedAt: "2026-07-22"
    },
    {
      id: "page-services",
      slug: "services",
      titleAr: "خدماتنا",
      titleEn: "Services",
      seoTitleAr: "خدمات شراء السكراب والتفكيك المجاني بالدمام",
      seoTitleEn: "Scrap Buying Services & Free Dismantling in Dammam",
      seoDescriptionAr: "نقدم خدمات شاملة لشراء السكراب، تفكيك المكيفات المركزية، رفع المخلفات المعدنية وتثمين المصانع.",
      seoDescriptionEn: "Comprehensive scrap buying, AC dismantling, industrial site clearance & metal appraisal.",
      contentAr: "نغطي كافة خدمات شراء وتفكيك ونقل السكراب بكافة أحجامه من الأفراد والشركات والمصانع.",
      contentEn: "We cover all scrap buying, dismantling, and haulage services across Dammam.",
      isPublished: true,
      updatedAt: "2026-07-22"
    },
    {
      id: "page-pricing",
      slug: "pricing",
      titleAr: "الأسعار (دليل الأسعار)",
      titleEn: "Pricing Guide",
      seoTitleAr: "دليل أسعار السكراب اليوم بالدمام | النحاس، الحديد، الألمنيوم",
      seoTitleEn: "Scrap Rates Guide Today Dammam | Copper, Iron, Aluminum",
      seoDescriptionAr: "جدول الأسعار اليومي لشراء سكراب النحاس الأحمر والأصفر، الحديد الثقيل، المكيفات، والألمنيوم.",
      seoDescriptionEn: "Updated daily price index for copper, heavy iron, used ACs, and aluminum scrap in KSA.",
      contentAr: "نحدث أسعار السكراب يومياً طبقاً للبورصة العالمية والمحلية في المملكة لتضمن الحصول على أفضل سعر.",
      contentEn: "Our scrap pricing is updated daily according to local and global metal market indices.",
      isPublished: true,
      updatedAt: "2026-07-22"
    },
    {
      id: "page-contact",
      slug: "contact",
      titleAr: "اتصل بنا",
      titleEn: "Contact Us",
      seoTitleAr: "اتصل بنا | طلب معاينة وشراء سكراب بالدمام",
      seoTitleEn: "Contact Us | Scrap Pickup Request Dammam",
      seoDescriptionAr: "تواصل مع فريق مؤسسة شيرا مباشرة عبر الاتصال أو الواتساب لمعاينة السكراب واستلام الكاش فورياً.",
      seoDescriptionEn: "Get in touch with Shera Scrap team via phone or WhatsApp for free site evaluation and instant cash.",
      contentAr: "تواصل معنا 24/7 عبر الهواتف الموضحة أو احجز موعد معاينة مجاني لشحنتك.",
      contentEn: "Contact us 24/7 via phone or WhatsApp to book your free scrap inspection.",
      isPublished: true,
      updatedAt: "2026-07-22"
    },
    {
      id: "page-blog",
      slug: "blog",
      titleAr: "المدونة",
      titleEn: "Blog",
      seoTitleAr: "مدونة السكراب | مقالات ودلائل تجارة المعادن بالدمام",
      seoTitleEn: "Scrap Trading Blog & Educational Guides Dammam",
      seoDescriptionAr: "مقالات تثقيفية حول كيفية تصنيف السكراب، نصائح بيع المكيفات المستعملة، وتوقعات أسعار المعادن.",
      seoDescriptionEn: "Educational blog posts on scrap classification, selling tips, and market price insights.",
      contentAr: "اقرأ أحدث المقالات والدلائل الإرشادية لتكون على دراية بكيفية الاستفادة القصوى من السكراب لديلك.",
      contentEn: "Read the latest guides and tips on maximizing value from your scrap metals.",
      isPublished: true,
      updatedAt: "2026-07-22"
    }
  ],
  videoPosts: [
    {
      id: "vid-1",
      titleAr: "فيديو إثبات شراء وتفريغ سكراب نحاس بمبلغ 45,000 ريال كاش",
      titleEn: "Purchase Proof: 45,000 SAR Copper Scrap Unloading in Dammam",
      descriptionAr: "شاهد عملية تفريغ 1.2 тон من سكراب النحاس الخالص وتسليم المبلغ نقداً فورياً للعميل.",
      descriptionEn: "Video documenting 1.2 tons of copper scrap delivery and instant cash payment to client.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      type: "purchase_proof",
      category: "سكراب نحاس",
      date: "2026-07-15",
      featured: true,
      thumbnail: "/resources/c0afd68f7fa7a62b.webp"
    },
    {
      id: "vid-2",
      titleAr: "دليل طريقة تفكيك وقص هيكل المكيفات المركزية القديمة مع فريق شيرا",
      titleEn: "Service Guide: Dismantling Central Air Conditioning Units Safely",
      descriptionAr: "فيديو إرشادي يوضح كيفية تفكيك المكيفات المركزية الضخمة من أسطح المباني بدون إلحاق أي ضرر بالمنشأة.",
      descriptionEn: "Educational guide showcasing our certified team safely extracting heavy roof AC units.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      type: "service_guide",
      category: "مكيفات مستعملة",
      date: "2026-07-10",
      featured: false,
      thumbnail: "/resources/166c07f7e98baf03.webp"
    }
  ],
  clients: [
    {
      id: "cli-1",
      nameAr: "شركة الشرقية للمقاولات العامة",
      nameEn: "Eastern Province General Contracting",
      logoUrl: "/resources/91dafbcc4007001f.webp",
      type: "corporate",
      status: "vip",
      companyRegNumber: "2050123456",
      phone: "0501234567",
      location: "الدمام - المدينة الصناعية الثانية",
      totalTransactions: "350,000 ر.س",
      dateAdded: "2026-01-15",
      notes: "عقد توريد سكراب حديد ونحاس منتظم شهرياً"
    },
    {
      id: "cli-2",
      nameAr: "مصنع الخليج للهياكل المعدنية",
      nameEn: "Gulf Metal Structures Factory",
      logoUrl: "/resources/848ecbd5513a3158.webp",
      type: "factory",
      status: "active",
      companyRegNumber: "2050987654",
      phone: "0559876543",
      location: "الخبر - الصناعية",
      totalTransactions: "180,000 ر.س",
      dateAdded: "2026-03-20",
      notes: "شراء مخلفات التقطيع والألمنيوم"
    },
    {
      id: "cli-3",
      nameAr: "مؤسسة الأعمال المتقدمة (طلب انضمام جديد)",
      nameEn: "Advanced Works Trading (New Lead)",
      logoUrl: "/resources/0c47173fac80c0d3.webp",
      type: "contractor",
      status: "new_lead",
      phone: "0543210987",
      location: "الجبيل",
      dateAdded: "2026-07-21",
      notes: "تم إرسال طلب تسعير 15 тон سكراب حديد"
    }
  ],
  theme: {
    primaryColor: "emerald",
    enableDarkModeHeader: true,
    enableFloatingWhatsapp: true,
    enableWhiteLabel: false,
    footerTextAr: "جميع الحقوق محفوظة © 2026 لمؤسسة شيرا لشراء السكراب والخدمات اللوجستية بالشرقية.",
    footerTextEn: "All rights reserved © 2026 Shera Scrap Trading & Logistics Services Eastern Province."
  },
  slides: [
    {
      id: "slide-1",
      titleAr: "أنواع السكراب التي نشتريها بالدمام",
      titleEn: "Types of Scrap Metal We Buy",
      subtitleAr: "نشتري جميع أنواع سكراب المعادن والمكيفات المستعملة والسيارات والمعدات بأوزان دقيقة ونقل مجاني فوري.",
      subtitleEn: "We buy all scrap metals, obsolete air conditioners, scrap vehicles, and industrial machinery with certified scales and free transport.",
      badgeAr: "أعلى أسعار شراء كاش فوري",
      badgeEn: "Highest On-Site Cash Purchase",
      image: "/resources/cb264e210c7f742d.webp",
      ctaTextAr: "تواصل واتساب مباشر للبيع",
      ctaTextEn: "Sell Scrap via WhatsApp",
      ctaType: "whatsapp",
      order: 1,
      active: true
    },
    {
      id: "slide-2",
      titleAr: "مميزات واختصاصات مؤسسة شيرا للسكراب",
      titleEn: "Specialties of Shera Scrap Haraj",
      subtitleAr: "نخدمك بأعلى معايير المصداقية والسرعة مع تفكيك ونقل مجاني وشاحنات مجهزة وموازين رقمية معتمدة.",
      subtitleEn: "Premium scrap trading service with free dismantling, digital scales, and instant on-site cash payment.",
      badgeAr: "خدمات متميزة وشاملة",
      badgeEn: "Premium Comprehensive Services",
      image: "/resources/f31252212691256e.webp",
      ctaTextAr: "طلب شاحنة تفكيك ونقل",
      ctaTextEn: "Request Free Pickup Fleet",
      ctaType: "whatsapp",
      order: 2,
      active: true
    },
    {
      id: "slide-3",
      titleAr: "لماذا يفضلنا أكثر من 5000 عميل بالشرقية؟",
      titleEn: "Why Choose Shera Scrap Haraj?",
      subtitleAr: "نقدم أفضل الأسعار وتسهيلات كاملة لبيع السكراب مع الدفع النقدي المباشر وأسطول شاحنات حديث.",
      subtitleEn: "Trusted by over 5,000 customers for top market cash rates, same-day service, and complete reliability.",
      badgeAr: "اختيار أكثر من 5000 عميل بالشرقية",
      badgeEn: "Trusted by 5,000+ Customers",
      image: "/resources/f5350e45bb6fddbc.webp",
      ctaTextAr: "احصل على أعلى سعر الآن",
      ctaTextEn: "Get Top Market Rate",
      ctaType: "whatsapp",
      order: 3,
      active: true
    },
    {
      id: "slide-4",
      titleAr: "مناطق تغطية خدماتنا بالشرقية",
      titleEn: "Our Service Coverage Area",
      subtitleAr: "أسطول شاحناتنا متواجد يومياً لنقل وتفكيك السكراب في الدمام، الجبيل، الخبر، الأحساء، والنعيرية.",
      subtitleEn: "Our mobile truck fleet covers all major cities and industrial hubs across the Eastern Province.",
      badgeAr: "تغطية كاملة للمنطقة الشرقية",
      badgeEn: "Full Eastern Province Coverage",
      image: "/resources/7dc4b418344653d8.webp",
      ctaTextAr: "طلب شاحنة لمدينتك عبر الواتساب",
      ctaTextEn: "Request Truck to Your City",
      ctaType: "whatsapp",
      order: 4,
      active: true
    }
  ],
  categories: [
    {
      id: "cat-copper",
      slug: "copper",
      nameAr: "نحاس وكيابل كهربائية",
      nameEn: "Copper & Power Cables",
      descriptionAr: "نشتري جميع أنواع النحاس الأحمر والأصفر والنحاس المعزول والكيابل بأعلى أسعار البورصة كاش.",
      descriptionEn: "We buy pure red copper, yellow brass, insulated copper wires, and power cables at top market rates.",
      icon: "Zap",
      rateEstimateAr: "30 - 45 ر.س / كجم",
      rateEstimateEn: "30 - 45 SAR / kg",
      baseRateSarPerKg: 38,
      featuredImage: "/resources/fallback.svg",
      order: 1
    },
    {
      id: "cat-ac",
      slug: "air-conditioners",
      nameAr: "مكيفات مستعملة وسكراب",
      nameEn: "Used & Scrap AC Units",
      descriptionAr: "شراء مكيفات شباك وسبليت ومكيفات مركزية وتالفة مع التفكيك والتنزيل والتحميل المجاني.",
      descriptionEn: "Buying window ACs, split ACs, and central cooling units with free on-site dismantling.",
      icon: "Home",
      rateEstimateAr: "250 - 900 ر.س / وحدة",
      rateEstimateEn: "250 - 900 SAR / unit",
      baseRateSarPerKg: 18,
      featuredImage: "/resources/5fd21da8bc206578.webp",
      order: 2
    },
    {
      id: "cat-iron",
      slug: "iron-steel",
      nameAr: "حديد وسكراب معادن ثقيلة",
      nameEn: "Iron & Heavy Steel Scrap",
      descriptionAr: "شراء حديد البناء، الهياكل المعدنية، صلب المصانع والورش والكميات الكبيرة بأوزان دقيقة.",
      descriptionEn: "Buying construction iron, structural steel, beams, and factory scrap with mobile weighing.",
      icon: "Factory",
      rateEstimateAr: "0.95 - 1.45 ر.س / كجم",
      rateEstimateEn: "0.95 - 1.45 SAR / kg",
      baseRateSarPerKg: 1.2,
      featuredImage: "/resources/c0afd68f7fa7a62b.webp",
      order: 3
    },
    {
      id: "cat-aluminum",
      slug: "aluminum",
      nameAr: "ألمنيوم ومقاطع مطابخ",
      nameEn: "Aluminum & Kitchen Scrap",
      descriptionAr: "شراء الألمنيوم بأنواعه: مطابخ، شبابيك، خردة، وقوالب ألمنيوم صافي بسعر مميز.",
      descriptionEn: "Buying all forms of aluminum scrap, profile windows, kitchen frames, and ingots.",
      icon: "Scale",
      rateEstimateAr: "6.5 - 11.0 ر.س / كجم",
      rateEstimateEn: "6.5 - 11.0 SAR / kg",
      baseRateSarPerKg: 8.5,
      featuredImage: "/resources/45ae8be8dac14d2a.webp",
      order: 4
    },
    {
      id: "cat-electronics",
      slug: "electronics",
      nameAr: "إلكترونيات وبطاريات",
      nameEn: "Electronic Scrap & Batteries",
      descriptionAr: "شراء الأجهزة الإلكترونية التالفة، كروت اللوحات، بطاريات السيارات، والمعدات الكهربائية.",
      descriptionEn: "Buying obsolete electronics, PCB circuit boards, car batteries, and electrical gear.",
      icon: "Cpu",
      rateEstimateAr: "15 - 85 ر.س / قطعة",
      rateEstimateEn: "15 - 85 SAR / piece",
      baseRateSarPerKg: 5.5,
      featuredImage: "/resources/a85ff57555ef6d59.webp",
      order: 5
    },
    {
      id: "cat-vehicles",
      slug: "vehicles-machinery",
      nameAr: "سيارات تالفة ومعدات ثقيلة",
      nameEn: "Scrap Vehicles & Machinery",
      descriptionAr: "شراء السيارات المصتدمة والمعدات الزراعية والصناعية والشاحنات التالفة وإلغاء اللوحات.",
      descriptionEn: "Buying wrecked cars, tractors, generators, scrap trucks, and heavy industrial plant equipment.",
      icon: "Car",
      rateEstimateAr: "1,500 - 18,000 ر.س / مركبة",
      rateEstimateEn: "1,500 - 18,000 SAR / vehicle",
      baseRateSarPerKg: 1.5,
      featuredImage: "/resources/48b3b6f6afc851e9.webp",
      order: 6
    }
  ],
  services: [
    {
      id: "srv-ac",
      slug: "ac-buying",
      titleAr: "شراء مكيفات مستعملة بالدمام",
      titleEn: "Used AC Scrap Buying Dammam",
      subtitleAr: "مكيفات شباك، سبليت، ومكيفات مركزية وتالفة مع الفك المجاني",
      subtitleEn: "Window, Split & Central units with free on-site removal",
      rateEstimateAr: "250 - 900 ر.س / unit",
      rateEstimateEn: "250 - 900 SAR / unit",
      iconName: "Home",
      image: "/resources/5fd21da8bc206578.webp",
      pointsAr: ["فك وتنزيل مجاني 100%", "تقييم فوري حسب الحالة والتكيف", "دفع نقدي كاش بموقعك"],
      pointsEn: ["100% Free removal", "Instant rating by condition", "Direct cash payment on site"],
      active: true,
      order: 1
    },
    {
      id: "srv-copper",
      slug: "copper-buying",
      titleAr: "شراء نحاس وكيابل كهربائية",
      titleEn: "Copper Scrap & Wire Clearance",
      subtitleAr: "نحاس أحمر وأصفر، كيابل محطات، ومخلفات تمديدات",
      subtitleEn: "Red & yellow copper wires, cables and electrical scrap",
      rateEstimateAr: "30 - 45 ر.س / kg",
      rateEstimateEn: "30 - 45 SAR / kg",
      iconName: "Zap",
      image: "/resources/fallback.svg",
      pointsAr: ["موازين رقمية دقيقة", "أعلى أسعار بورصة المعادن", "استلام الكميات من الموقع"],
      pointsEn: ["Certified digital scale", "Top metal market index", "Direct site collection"],
      active: true,
      order: 2
    },
    {
      id: "srv-iron",
      slug: "iron-buying",
      titleAr: "شراء حديد وسكراب مصانع",
      titleEn: "Iron & Industrial Factory Scrap",
      subtitleAr: "حديد مباني، هياكل ثقيلة، مخلفات ورش ومصانع",
      subtitleEn: "Construction steel, heavy beams, and workshop scrap",
      rateEstimateAr: "0.95 - 1.45 ر.س / kg",
      rateEstimateEn: "0.95 - 1.45 SAR / kg",
      iconName: "Factory",
      image: "/resources/c0afd68f7fa7a62b.webp",
      pointsAr: ["شاحنات هيدروليكية كبيرة", "قص وتفكيك مجاني للمنشآت", "عقود توريد ورخص رسمية"],
      pointsEn: ["Hydraulic heavy truck fleet", "Free facility clearance", "Official licensed contracts"],
      active: true,
      order: 3
    }
  ],
  posts: [
    {
      id: "post-1",
      slug: "how-to-sell-scrap-dammam-best-price",
      titleAr: "كيف تبيع السكراب بالدمام بأعلى سعر اليوم؟ دليل الشراء الكامل 2026",
      titleEn: "How to Sell Scrap Metal in Dammam for Top Market Rates (2026 Guide)",
      excerptAr: "تعرف على أهم العوامل التي تحدد سعر أسواق السكراب بالدمام وكيف تضمن حقك في الوزن والدفع النقدي الفوري.",
      excerptEn: "Discover the main factors driving scrap metal pricing in Dammam and how to ensure exact weight and instant cash payouts.",
      contentAr: `### أسعار السكراب في الدمام والشرقية لعام 2026

تعتبر مدينة الدمام والمنطقة الشرقية المركز الصناعي الأول لشراء وتدوير السكراب والمعادن في المملكة العربية السعودية. عند رغبتك في بيع السكراب سواء كان **حديد، نحاس، مكيفات مستعملة، أو مخلفات مصانع**، هناك نصائح ذهبية تضمن لك الحصول على أعلى قيمة مالية:

1. **فرز المعادن قبل البيع**: فصل النحاس الأحمر عن الكيابل والألمنيوم يرفع سعر الكيلو بشكل ملحوظ.
2. **الاستعانة بجهة معتمدة ذات ميزان إلكتروني**: التأكد من أن الميزان إلكتروني ومحمول أمام عينيك يضمن لك العدالة المطلقة.
3. **الدفع الكاش المباشر**: مؤسسة شيرا تضمن تسليم المبلغ نقداً بالكامل قبل تحميل السكراب على الشاحنة.

تواصل معنا الآن عبر الواتساب للحصول على تسعيرة فورية!`,
      contentEn: `### Scrap Metal Pricing Guide in Dammam 2026

Dammam and the Eastern Province are the primary industrial hubs for scrap metal trading in Saudi Arabia. When selling scrap—whether **steel, copper, old ACs, or factory machinery**—follow these key practices to get top payout:

1. **Sort Metals Before Sale**: Separating pure red copper from insulated wiring increases your rate per kilogram.
2. **Use Certified Digital Scales**: Always demand mobile digital weighing on-site.
3. **Instant Cash Delivery**: Shera Scrap guarantees 100% full cash payout before truck loading.

Contact us today via WhatsApp to get a instant live quote!`,
      category: "دليل الأسعار",
      tags: ["شراء سكراب", "الدمام", "أسعار النحاس", "مكيفات مستعملة"],
      featuredImage: "/resources/977b74fd04bf7eb7.webp",
      author: "إدارة مؤسسة شيرا",
      date: "2026-07-20",
      status: "published",
      views: 342,
      postType: "article"
    },
    {
      id: "post-2",
      slug: "used-ac-buying-dammam-guide",
      titleAr: "طريقة تقييم وبيع المكيفات المستعملة والتالفة بالدمام والخبر",
      titleEn: "Valuing and Selling Used Window & Split ACs in Dammam & Khobar",
      excerptAr: "دليل سريع لمعرفة قيمة المكيفات الشباك والسبليت وكيف تحصل على خدمة تفكيك ونقل مجاني لموقعك.",
      excerptEn: "A quick guide on determining used window & split AC value and getting free removal at your home.",
      contentAr: `### شراء المكيفات المستعملة بالدمام والشرقية

المكيفات القديمة والمستعملة تحتوي على كميات قيّمة من النحاس والحديد والكمبروسرات. مؤسسة شيرا توفر خدمة شمولية لشراء كافة أنواع المكيفات:

* **مكيفات الشباك (Window ACs)**: نشتري الوحدات الشغالة والتالفة بأسعار ممتازة.
* **مكيفات السبليت (Split ACs)**: نرسل فنيين متمرسين لفك الوحدات الداخلية والخارجية مجاناً دون إلحاق أي ضرر بالنموذج السكني.
* **المكيفات المركزية و الشيلرات**: إمكانية رفع وتفكيك المعدات الثقيلة بواسطة رافعات هيدروليكية.

احجز موعد وصول الشاحنة اليوم!`,
      contentEn: `### Buying Used ACs in Dammam & Khobar

Used air conditioners contain high-value copper coils, iron housing, and heavy compressor units. Shera Scrap offers free removal and top cash payments:

* **Window AC Units**: Purchasing both working and non-working units at competitive prices.
* **Split AC Systems**: Certified technicians dismantle indoor and outdoor split units without damage to walls.
* **Central Chillers & Commercial Units**: Hydraulic crane support for heavy commercial units.

Book your pickup today!`,
      category: "خدمات المكيفات",
      tags: ["مكيفات مستعملة", "فك مجاني", "حراج الدمام"],
      featuredImage: "/resources/683a9e15be39857b.webp",
      author: "قسم صيانة وتدوير المكيفات",
      date: "2026-07-18",
      status: "published",
      views: 215,
      postType: "article"
    },
    {
      id: "post-v1",
      slug: "video-purchase-proof-copper-dammam",
      titleAr: "فيديو إثبات شراء وتفريغ سكراب نحاس بمبلغ 45,000 ريال كاش",
      titleEn: "Purchase Proof: 45,000 SAR Copper Scrap Unloading in Dammam",
      excerptAr: "شاهد عملية تفريغ 1.2 тон من سكراب النحاس الخالص وتسليم المبلغ نقداً فورياً للعميل.",
      excerptEn: "Video documenting 1.2 tons of copper scrap delivery and instant cash payment to client.",
      contentAr: "فيديو توثيقي لعمليات التفريغ والدفع الكاش المباشر بموقع العميل بالدمام.",
      contentEn: "Documented video proof of on-site scrap unloading and cash payment in Dammam.",
      category: "سكراب نحاس",
      tags: ["فيديو إثبات", "نحاس", "كاش فوري"],
      featuredImage: "/resources/977b74fd04bf7eb7.webp",
      author: "تغطيات الميدان",
      date: "2026-07-15",
      status: "published",
      views: 520,
      postType: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ"
    },
    {
      id: "post-v2",
      slug: "video-dismantling-central-ac-guide",
      titleAr: "دليل طريقة تفكيك وقص هيكل المكيفات المركزية القديمة مع فريق شيرا",
      titleEn: "Service Guide: Dismantling Central Air Conditioning Units Safely",
      excerptAr: "فيديو إرشادي يوضح كيفية تفكيك المكيفات المركزية الضخمة من أسطح المباني بدون إلحاق أي ضرر بالمنشأة.",
      excerptEn: "Educational guide showcasing our certified team safely extracting heavy roof AC units.",
      contentAr: "شرح مرئي لطريقة فك ونقل المكيفات المركزية بواسطة الرافعات.",
      contentEn: "Video guide showing heavy central AC extraction with cranes.",
      category: "مكيفات مستعملة",
      tags: ["دليل خدمات", "مكيفات مركزية"],
      featuredImage: "/resources/2914506f7fec90ff.webp",
      author: "فريق التفكيك والإنقاذ",
      date: "2026-07-10",
      status: "published",
      views: 380,
      postType: "video",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ"
    }
  ],
  tags: [
    { id: "tag-1", nameAr: "سكراب الدمام", nameEn: "Dammam Scrap", slug: "dammam-scrap" },
    { id: "tag-2", nameAr: "مكيفات مستعملة", nameEn: "Used ACs", slug: "used-acs" },
    { id: "tag-3", nameAr: "أسعار النحاس", nameEn: "Copper Rates", slug: "copper-rates" },
    { id: "tag-4", nameAr: "سكراب مصانع", nameEn: "Factory Scrap", slug: "factory-scrap" },
    { id: "tag-5", nameAr: "تسليم كاش", nameEn: "Instant Cash", slug: "instant-cash" }
  ],
  equipments: [
    {
      id: "eq-1",
      titleAr: "شاحنات ونقل هيدروليكي ثقيل",
      titleEn: "Heavy Transport Trucks & Winches",
      subtitleAr: "أسطول نقل مجاني متكامل للشرقية والدمام",
      subtitleEn: "Complimentary Heavy Scrap Fleet",
      capacityAr: "حملات تصل إلى 50 طن",
      capacityEn: "Up to 50 Tons Capacity",
      descriptionAr: "أسطول شاحنات مجهز بأوناش هيدروليكية لرفع ونقل هياكل السكراب الثقيلة، مكيفات المبانى والمصانع مباشرة من موقعك مع سائقين معتمدين.",
      descriptionEn: "Fleet equipped with heavy hydraulic cranes and winches to load factory scrap, HVAC units, and heavy structural metals.",
      image: "/resources/908ba3d51ed0f881.webp",
      specificationsAr: ["أوناش هيدروليكية 25 طن", "شواحن نقل مبطنة للسلامة", "خدمة سريعة في موقعك"],
      specificationsEn: ["25-Ton Hydraulic Cranes", "Safety-Lined Flatbeds", "Fast On-Site Dispatch"],
      active: true,
      order: 1
    },
    {
      id: "eq-2",
      titleAr: "موازين جسرية وميدانية إلكترونية دقيقة",
      titleEn: "Digital Weighbridge & Field Scales",
      subtitleAr: "معتمدة وموزونة 100% لتسليم الحساب فوراً",
      subtitleEn: "100% Certified Meters for Instant Payout",
      capacityAr: "دقة عالية حتى 100 طن",
      capacityEn: "100 Tons Precision Measuring",
      descriptionAr: "موازين إلكترونية رقمية معايرة معتمدة تضمن شفافية الوزن لجميع كميات النحاس، الحديد والمكيفات المستعملة أمام العميل.",
      descriptionEn: "Calibrated digital weighbridges providing transparent, exact weight readouts for copper, iron, and bulk scrap.",
      image: "/resources/2fbf23c1fc6b0a6a.webp",
      specificationsAr: ["شاشة عرض رقمية مكشوفة", "دقة مئوية غرامية", "طباعة إيصال وزن فوري"],
      specificationsEn: ["Visible Digital Display", "Gram-Accurate Sensors", "Instant Printed Ticket"],
      active: true,
      order: 2
    },
    {
      id: "eq-3",
      titleAr: "مكابس هيدروليكية لضغط السكراب",
      titleEn: "Hydraulic Scrap Metal Balers",
      subtitleAr: "تكثيف وضغط سكراب السيارات والألومنيوم",
      subtitleEn: "High-Pressure Baling for Scrap Recycling",
      capacityAr: "ضغط بقوة 200 طن",
      capacityEn: "200-Ton Hydraulic Compaction",
      descriptionAr: "مكابس ضغط عالية القوة لكبس الصفيح، هياكل السيارات والشرائح معدنية لتجهيزها لإعادة التدوير بإنتاجية عالية.",
      descriptionEn: "High-density compaction presses for sheet metals, car bodies, and loose aluminum to streamline processing.",
      image: "/resources/da90e0cd9e18bba8.webp",
      specificationsAr: ["كبس مكعبات معيارية", "سرعة معالجة عالية", "صديقة للبيئة"],
      specificationsEn: ["Standardized Cubes", "High Processing Speed", "Eco-Friendly System"],
      active: true,
      order: 3
    },
    {
      id: "eq-4",
      titleAr: "رافعات وشواكيش تقطيع الهياكل المعدنية",
      titleEn: "Hydraulic Material Handlers & Shears",
      subtitleAr: "معدات تقطيع هياكل المصانع والمباني",
      subtitleEn: "Industrial Demolition & Scrap Cutting",
      capacityAr: "قص حديد بسماكة 50 مم",
      capacityEn: "Cut Up to 50mm Steel Plate",
      descriptionAr: "مقصات هيدروليكية عملاقة لتقطيع الجسور، الهياكل المعدنية، والخزانات الضخمة إلى أحجام قابلة للنقل بالكامل.",
      descriptionEn: "Industrial hydraulic shears designed to slice heavy steel beams, tanks, and structural scrap safely.",
      image: "/resources/f8667adade162bd3.webp",
      specificationsAr: ["قص سريع بدون لهب", "أذرع تلبيس بعيدة المدى", "فريق تفكيك محترف"],
      specificationsEn: ["Cold-Cut Safety Shears", "Long-Reach Crane Arms", "Certified Dismantling Crew"],
      active: true,
      order: 4
    }
  ],
  users: [],
  inquiries: [],
  faqs: [
    {
      id: "faq-1",
      questionAr: "كيف يتم تحديد سعر السكراب بالدمام؟",
      questionEn: "How is the scrap metal price calculated in Dammam?",
      answerAr: "يتم تحديد السعر بناءً على نوع المعدن (نحاس، حديد، ألمنيوم)، الدرجة، والوزن الصافي المعتمد بموازيننا الإلكترونية بحسب أسعار حراج الدمام اليومية.",
      answerEn: "Prices depend on the metal type (copper, steel, aluminum), grade purity, and accurate weight measured on our certified digital scales.",
      order: 1
    },
    {
      id: "faq-2",
      questionAr: "هل خدمة التفكيك والنقل مجانية بالكامل؟",
      questionEn: "Is the dismantling and transport service completely free?",
      answerAr: "نعم، نوفر عمالة متخصصة لفك المكيفات والمعدات وشاحنات لنقل السكراب مجاناً بدون أي رسوم إضافية عليك.",
      answerEn: "Yes! Our specialized crews handle dismantling and transport with zero hidden fees.",
      order: 2
    },
    {
      id: "faq-3",
      questionAr: "متى أستلم المبلغ المالي مقابل البيع؟",
      questionEn: "When do I receive my cash payment?",
      answerAr: "يتم تسليم المبلغ كاملاً نقداً (كاش) فور الانتهاء من عملية الوزن في موقعك وقبل تحميل الشاحنة.",
      answerEn: "Payment is delivered 100% in instant cash on-site right after weighing and before loading.",
      order: 3
    }
  ],
  testimonials: [
    {
      id: "test-1",
      nameAr: "أبو عبد الله الدوسري",
      nameEn: "Abu Abdullah Al-Dossary",
      locationAr: "الدمام - حي النزهة",
      locationEn: "Dammam - Al Nuzha",
      rating: 5,
      textAr: "ماشاء الله تعامل راقي وسرعة بالوصول. بعت لهم 8 مكيفات شباك وسكراب حديد، فكوهم ونقلوهم وسلّموني المبلغ كاش فوراً بنفس الموقع.",
      textEn: "Excellent professional service! Sold 8 window ACs and scrap iron. They dismantled everything and paid me cash on the spot.",
      date: "2026-07-15",
      verified: true
    },
    {
      id: "test-2",
      nameAr: "مهندس خالد الشمري",
      nameEn: "Eng. Khaled Al-Shammari",
      locationAr: "الجبيل - المنطقة الصناعية",
      locationEn: "Jubail Industrial City",
      rating: 5,
      textAr: "تعاملنا مع مؤسسة شيرا لشراء مخلفات ورشة ومصنع بوزن أكثر من 15 طن، ميزانهم دقيق وأسعارهم هي الأفضل بالشرقية بكل أمانة.",
      textEn: "We worked with Shera Scrap for over 15 tons of factory workshop scrap. Accurate weighing and best rates in Eastern Province.",
      date: "2026-07-10",
      verified: true
    }
  ],
  mediaLibrary: [
    {
      id: "m-1",
      url: "/resources/cb264e210c7f742d.webp",
      title: "سكراب مكيفات سبلت وشباك الدمام",
      size: "450 KB",
      mimeType: "image/jpeg",
      date: "2026-07-20"
    },
    {
      id: "m-2",
      url: "/resources/1b152307ce41fe56.webp",
      title: "شراء خردة ونحاس أحمر وأصفر",
      size: "620 KB",
      mimeType: "image/jpeg",
      date: "2026-07-18"
    },
    {
      id: "m-3",
      url: "/resources/56632de2ba742e9e.webp",
      title: "سكراب حديد ثقيل وهياكل ومعدات",
      size: "510 KB",
      mimeType: "image/jpeg",
      date: "2026-07-15"
    },
    {
      id: "m-4",
      url: "/resources/ea35e1a7d70745f3.webp",
      title: "سكراب ألومنيوم ومطابخ ونوافذ",
      size: "390 KB",
      mimeType: "image/jpeg",
      date: "2026-07-12"
    }
  ],
  searchLogs: [
    {
      id: "srch-1",
      query: "شراء مكيفات خربانة بالدمام",
      category: "مكيفات مستعملة وسكراب",
      count: 142,
      lastSearched: "2026-07-22 18:45",
      source: "header_search"
    },
    {
      id: "srch-2",
      query: "سعر كيلو النحاس الاحمر اليوم",
      category: "نحاس وكيابل كهربائية",
      count: 98,
      lastSearched: "2026-07-22 19:10",
      source: "estimator"
    },
    {
      id: "srch-3",
      query: "نشتري السكراب حي الفيصلية",
      category: "حديد وسكراب معادن ثقيلة",
      count: 76,
      lastSearched: "2026-07-22 17:30",
      source: "header_search"
    },
    {
      id: "srch-4",
      query: "سكراب مطابخ ألمنيوم بالخبر",
      category: "ألمنيوم ومقاطع مطابخ",
      count: 64,
      lastSearched: "2026-07-22 16:20",
      source: "category_filter"
    },
    {
      id: "srch-5",
      query: "تقييم بطاريات سيارات سكراب",
      category: "إلكترونيات وبطاريات",
      count: 45,
      lastSearched: "2026-07-22 14:05",
      source: "estimator"
    },
    {
      id: "srch-6",
      query: "شراء سيارات تالفة مصدومة الجبيل",
      category: "سيارات تالفة ومعدات ثقيلة",
      count: 38,
      lastSearched: "2026-07-21 21:15",
      source: "blog_search"
    }
  ],
  categoryStats: [
    {
      categoryId: "cat-ac",
      categoryNameAr: "مكيفات مستعملة وسكراب",
      categoryNameEn: "Used & Scrap AC Units",
      viewsCount: 1840,
      inquiriesCount: 112,
      searchesCount: 310
    },
    {
      categoryId: "cat-copper",
      categoryNameAr: "نحاس وكيابل كهربائية",
      categoryNameEn: "Copper & Power Cables",
      viewsCount: 1520,
      inquiriesCount: 89,
      searchesCount: 265
    },
    {
      categoryId: "cat-iron",
      categoryNameAr: "حديد وسكراب معادن ثقيلة",
      categoryNameEn: "Iron & Heavy Steel Scrap",
      viewsCount: 1290,
      inquiriesCount: 68,
      searchesCount: 180
    },
    {
      categoryId: "cat-aluminum",
      categoryNameAr: "ألمنيوم ومقاطع مطابخ",
      categoryNameEn: "Aluminum & Kitchen Scrap",
      viewsCount: 940,
      inquiriesCount: 42,
      searchesCount: 135
    },
    {
      categoryId: "cat-electronics",
      categoryNameAr: "إلكترونيات وبطاريات",
      categoryNameEn: "Electronic Scrap & Batteries",
      viewsCount: 620,
      inquiriesCount: 28,
      searchesCount: 88
    },
    {
      categoryId: "cat-vehicles",
      categoryNameAr: "سيارات تالفة ومعدات ثقيلة",
      categoryNameEn: "Scrap Vehicles & Machinery",
      viewsCount: 490,
      inquiriesCount: 19,
      searchesCount: 62
    }
  ],
  whyUsFeatures: [
    {
      id: "why-1",
      titleAr: "أعلى سعر كاش فوري بالدمام",
      titleEn: "Highest Instant Cash Rate in Dammam",
      descAr: "نضمن لك أعلى سعر كيلو للمكيفات والنحاس والحديد بالمنطقة الشرقية وفق بورصة المعادن اليومية مع تسليم المبلغ كاش فورياً.",
      descEn: "Get top daily market rates for copper, iron, ACs, and aluminum with instant cash on delivery.",
      iconName: "Banknote",
      order: 1,
      active: true
    },
    {
      id: "why-2",
      titleAr: "تحميل ونقل مجاني 100%",
      titleEn: "100% Free Dismantling & Transportation",
      descAr: "فريقنا المتخصص يتكفل بفك المكيفات وتحميل الخردة والحديد الثقيل بأحدث الشاحنات دون تحميلك أي تكاليف إضافية.",
      descEn: "Our expert team handles dismantling, heavy lifting, and transport with zero hidden fees.",
      iconName: "Truck",
      order: 2,
      active: true
    },
    {
      id: "why-3",
      titleAr: "موازين رقمية معتمدة أمامك",
      titleEn: "100% Calibrated Digital Scale",
      descAr: "نزن كافة الكميات بموازين إلكترونية دقيقة ومعتمدة بحضورك لضمان الشفافية والعدالة الكاملة في التثمين.",
      descEn: "Transparent weighing on certified electronic scales right at your site.",
      iconName: "Scale",
      order: 3,
      active: true
    },
    {
      id: "why-4",
      titleAr: "خدمة فورية خلال 30 دقيقة",
      titleEn: "30-Minute Rapid On-Site Response",
      descAr: "نغطي كافة أحياء الدمام والخبر والظهران والجبيل والقطيف على مدار 24 ساعة يومياً طوال أيام الأسبوع.",
      descEn: "Covering all districts of Dammam, Khobar, Jubail, and Dhahran 24/7.",
      iconName: "Clock",
      order: 4,
      active: true
    }
  ],
  estimatorConfig: {
    aiAdviceAr: "الأسعار المعروضة تقديرية وفق بورصة المعادن بالشرقية اليوم. ننصح بتجميع الكميات الكبيرة للحصول على بونص إضافي كاش!",
    aiAdviceEn: "Estimates are calculated based on today's Eastern Province metal rates. Bulk quantities receive premium cash bonuses!",
    minWeightKg: 10,
    maxWeightKg: 5000,
    baseConfidence: 96,
    whatsappMessageHeaderAr: "مرحباً مؤسسة شيرا، قمت بحساب قيمة سكراب عبر الحاسبة الذكية بالموقع:",
    whatsappMessageHeaderEn: "Hello Shera Scrap, I evaluated my scrap using the AI Estimator on website:"
  }
};
