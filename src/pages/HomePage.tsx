import React from 'react';
import SEO from '../components/SEO';
import ServiceAreaGrid from '../components/ServiceAreaGrid';
import { SectionHeading, Process, FAQs } from '../components/EditorialParts';
import QuoteRequest from '../static/QuoteRequest';
import { useCMS } from '../static/CMSContext';
import { areaHubPath, words, type Lang } from '../content/serviceAreas';
import { buyingCategories } from '../content/catalog';
import { whatsappUrl } from '../utils/whatsapp';
import type { LanguagePack } from '../types';

export default function HomePage({lang}: {lang:Lang;t:LanguagePack}) {
  const ar=lang==='ar', {cmsData}=useCMS();
  const wa=whatsappUrl(cmsData.settings.whatsapp, ar?'السلام عليكم، أريد بيع سكراب في الدمام.':'Hello, I would like to sell scrap in Dammam.');
  const t=(en:string,arabic:string)=>ar?arabic:en;
  const guides=cmsData.posts.filter(p=>!p.slug.startsWith('video-')).slice(0,2);
  return <>
    <SEO title={t('Scrap Buyer Dammam | Metal & Equipment Collection','شراء سكراب الدمام | المعادن والمعدات')}
      description={t('SheraScrap buys copper, iron, aluminum, cables, AC units and industrial scrap in Dammam. Send photos for a quote and coordinate collection across our Eastern Province service areas.','شيرا سكراب لشراء سكراب الدمام: النحاس والحديد والألمنيوم والكابلات والمكيفات والسكراب الصناعي. أرسل الصور للتقييم ونسق الاستلام ضمن مناطق خدمتنا في الشرقية.')}
      canonicalPath={`/${lang}/`} lang={lang} image="/resources/brand/icon-512.png" />
    <section className="home-hero">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow light">{t('DAMMAM · EASTERN PROVINCE','الدمام · المنطقة الشرقية')}</p>
          <h1>{t('Scrap Buyer in Dammam','شراء سكراب الدمام')}</h1>
          <p className="hero-lead">{t('Turn the scrap you no longer need into its next useful chapter.','سكرابك له قيمة. دعنا نساعدك على الاستفادة منه.')}</p>
          <p>{t('Looking for a scrap buyer Dammam businesses and households can contact directly? SheraScrap buys metals, cables, AC units, industrial scrap and selected used equipment. Start with a photo and a few details.','هل تبحث عن مشتري سكراب الدمام؟ تشتري شيرا سكراب المعادن والكابلات والمكيفات والسكراب الصناعي والمعدات المستعملة المختارة. ابدأ بصورة وتفاصيل بسيطة عن الكمية.')}</p>
          <div className="cta-row"><a className="button button-green" href={wa}>{t('Get a WhatsApp quote','اطلب تسعير عبر واتساب')} <span aria-hidden="true">{ar?'←':'↗'}</span></a><a className="button button-outline-light" href={`tel:${cmsData.settings.phone}`}>{t('Call our team','اتصل بالفريق')}</a></div>
          <p className="hero-coverage">{t('Serving Dammam, Khobar, Dhahran, Jubail, Al-Ahsa, Qatif and our other covered locations.','نخدم الدمام والخبر والظهران والجبيل والأحساء والقطيف ومناطق أخرى ضمن نطاق خدمتنا.')} <a href={areaHubPath(lang)}>{t('View all service areas','عرض جميع مناطق الخدمة')}</a></p>
        </div>
        <div className="hero-visual">
          <img src="/resources/metalwork-1200.avif" srcSet="/resources/metalwork-720.avif 720w, /resources/metalwork-1200.avif 1200w" sizes="(max-width: 900px) calc(100vw - 40px), (max-width: 1300px) 45vw, 550px" width="1200" height="795" fetchPriority="high" alt={t('Steel reinforcement and equipment at a construction site','حديد تسليح ومعدات في موقع إنشاءات')} />
          <div className="hero-visual-note"><span className="visual-mark" aria-hidden="true">↻</span><div><strong>{t('Metal. Equipment. New possibilities.','معادن. معدات. فرص جديدة.')}</strong><span>{t('A clear assessment starts with the details.','التقييم الواضح يبدأ من التفاصيل.')}</span></div></div>
        </div>
      </div>
    </section>
    <div className="trust-strip site-container" aria-label={t('Service information','معلومات الخدمة')}>
      {[words('Metal & equipment enquiries','طلبات المعادن والمعدات'),words('Inspection before final pricing','المعاينة قبل التسعير النهائي'),words('Collection arranged with you','الاستلام بالتنسيق معك'),words('Direct WhatsApp contact','تواصل مباشر عبر واتساب')].map((x,i)=><p key={x.en}><span aria-hidden="true">{new Intl.NumberFormat(ar?'ar-SA':'en-SA',{minimumIntegerDigits:2}).format(i+1)}</span>{x[lang]}</p>)}
    </div>
    <section className="editorial-section site-container" id="what-we-buy">
      <SectionHeading eyebrow={t('WHAT WE BUY','ما نشتريه')} title={t('A place for every useful material','لكل مادة فرصة للاستفادة')} text={t('Tell us what you have. We assess metals by grade and equipment by its condition, then discuss the right next step.','أخبرنا بما لديك. نقيّم المعادن حسب الدرجة والمعدات حسب حالتها، ثم نناقش الخطوة المناسبة.')} />
      <div className="material-grid">{buyingCategories.map((item,i)=><a className="material-card" href={`/${lang}/services/${item.slug}/`} key={item.slug}><span className={`material-symbol symbol-${item.icon}`} aria-hidden="true"><img src={`/resources/materials/${item.slug}.svg`} width="50" height="50" alt="" loading="lazy"/></span><h3>{item.title[lang]}</h3><p>{item.description[lang]}</p><span className="card-link">{t('Explore this service','تفاصيل الخدمة')} <span aria-hidden="true">{ar?'←':'↗'}</span></span></a>)}</div>
    </section>
    <section className="soft-section"><div className="site-container split-section">
      <div><p className="eyebrow">{t('SELL YOUR SCRAP IN DAMMAM','بيع السكراب في الدمام')}</p><h2>{t('Clear the space. Understand the value.','أفسح المساحة. واعرف القيمة.')}</h2></div>
      <div><p>{t('A few unused AC units, metal offcuts in a workshop or equipment from a commercial clearance: each lot deserves an assessment of its own. Send a clear overview so we can distinguish reusable equipment from metal sold for recycling.','مكيفات غير مستخدمة، أو قصاصات معدن في ورشة، أو معدات إخلاء تجاري: تستحق كل كمية تقييماً خاصاً بها. أرسل صورة عامة واضحة لنميز المعدات القابلة للاستخدام عن المعادن المباعة للتدوير.')}</p><a className="text-link" href={areaHubPath(lang)}>{t('Find your collection area','ابحث عن منطقة الاستلام')} <span aria-hidden="true">{ar?'←':'↗'}</span></a></div>
    </div></section>
    <section className="editorial-section site-container" id="how-it-works"><SectionHeading eyebrow={t('A SIMPLE START','بداية بسيطة')} title={t('From the first photo to collection','من الصورة الأولى إلى الاستلام')} /><Process lang={lang}/></section>
    <section className="price-section"><div className="site-container split-section"><div><p className="eyebrow">{t('SCRAP PRICE GUIDES','أدلة أسعار السكراب')}</p><h2>{t('Know what shapes your quote','اعرف ما يحدد تسعيرتك')}</h2><p>{t('Metal type, purity, net weight and handling requirements all matter. Our guides explain the process; your final offer is agreed after assessment.','نوع المعدن ونقاوته والوزن الصافي ومتطلبات المناولة كلها مهمة. توضح الأدلة طريقة التقييم؛ ويتفق على العرض النهائي بعد المعاينة.')}</p><a className="button button-dark" href={`/${lang}/pages/pricing/`}>{t('Read the pricing guide','اقرأ دليل التسعير')}</a></div><div className="price-factors">{[words('Material & grade','المادة والدرجة'),words('Weight & condition','الوزن والحالة'),words('Access & handling','الدخول والمناولة')].map((x,i)=><div key={i}><span>{ar?['١','٢','٣'][i]:['01','02','03'][i]}</span><strong>{x[lang]}</strong><span aria-hidden="true">{ar?'←':'→'}</span></div>)}</div></div></section>
    <section className="industrial-section"><div className="site-container industrial-grid"><img src="/resources/4cee9a24a70ed88e.webp" width="600" height="400" loading="lazy" alt={t('Equipment and metalwork in a manufacturing facility','معدات وتشغيل معادن داخل منشأة تصنيع')}/><div><p className="eyebrow light">{t('FOR BUSINESSES','للقطاع التجاري والصناعي')}</p><h2>{t('A considered approach to industrial scrap','تعامل مدروس مع السكراب الصناعي')}</h2><p>{t('Factory metal, warehouse clearances and machinery can require more planning than a small metal lot. Start with an inventory, approximate weights, access requirements and photos. We discuss scope before arranging removal.','قد تحتاج معادن المصانع وإخلاء المستودعات والآلات إلى تخطيط أوسع من كمية معادن صغيرة. ابدأ بقائمة الموجودات والأوزان التقريبية ومتطلبات الدخول والصور. نناقش نطاق العمل قبل ترتيب الإزالة.')}</p><a className="button button-green" href={`/${lang}/services/industrial-scrap/`}>{t('Industrial scrap enquiries','طلبات السكراب الصناعي')}</a></div></div></section>
    <section className="editorial-section site-container" id="service-areas"><SectionHeading eyebrow={t('OUR COVERAGE','نطاق خدمتنا')} title={t('Scrap Buying Service Areas','مناطق خدمة شراء السكراب')} text={t('Based in Dammam, SheraScrap serves customers across the listed locations in the Eastern Province. Select your area to see how to prepare your enquiry.','من الدمام، تخدم شيرا سكراب العملاء في المواقع المذكورة بالمنطقة الشرقية. اختر منطقتك لمعرفة كيفية تجهيز طلبك.')} /><ServiceAreaGrid lang={lang} featured/><a className="text-link" href={areaHubPath(lang)}>{t('Explore all service areas','استعرض جميع مناطق الخدمة')} <span aria-hidden="true">{ar?'←':'↗'}</span></a></section>
    <section className="soft-section"><div className="site-container editorial-section"><SectionHeading eyebrow={t('WHY SHERASCRAP','لماذا شيرا سكراب')} title={t('A clear conversation, before you commit','تفاهم واضح قبل الاتفاق')} /><div className="reason-grid">{[
      [words('The right questions','الأسئلة المناسبة'),words('We start with the material, condition and access—not a one-size-fits-all price.','نبدأ بنوع المادة والحالة والدخول، لتقييم يناسب الكمية المعروضة.')],
      [words('Terms you understand','شروط واضحة لك'),words('Discuss measurement, removal and payment terms before the load leaves your premises.','ناقش القياس والإزالة وشروط الدفع قبل خروج الحمولة من موقعك.')],
      [words('Direct contact','تواصل مباشر'),words('Speak to the team on WhatsApp or by phone. Your enquiry stays a conversation.','تحدث مع الفريق عبر واتساب أو الهاتف. يبقى طلبك حواراً مباشراً.')],
    ].map(([h,p])=><div key={h.en}><h3>{h[lang]}</h3><p>{p[lang]}</p></div>)}</div></div></section>
    <section className="editorial-section site-container"><SectionHeading eyebrow={t('SELLING GUIDES','أدلة البيع')} title={t('Useful advice before you sell','معلومات مفيدة قبل البيع')} /><div className="guide-grid">{guides.map(p=><a className="guide-card" key={p.id} href={`/${lang}/blog/${p.slug}/`}><span className="eyebrow">{t('SHERASCRAP GUIDE','دليل شيرا سكراب')}</span><h3>{ar?p.titleAr:p.titleEn}</h3><p>{ar?p.excerptAr:p.excerptEn}</p><span className="text-link">{t('Read the guide','اقرأ الدليل')} {ar?'←':'↗'}</span></a>)}</div></section>
    <section className="soft-section"><div className="site-container editorial-section"><SectionHeading title={t('Questions before collection','أسئلة قبل الاستلام')} /><FAQs lang={lang}/></div></section>
    <QuoteRequest lang={lang}/>
  </>;
}


