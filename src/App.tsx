import type { CMSData } from './cms/types';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation, StaticRouter } from 'react-router-dom';

import Header from './components/Header';
import { CMSProvider, useCMS } from './static/CMSContext';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesArchivePage from './pages/ServicesArchivePage';
import CategorySinglePage from './pages/CategorySinglePage';
import LocationSinglePage from './pages/LocationSinglePage';
import LocationsArchivePage from './pages/LocationsArchivePage';
import BlogArchivePage from './pages/BlogArchivePage';
import EstimatorPage from './pages/EstimatorPage';
import FAQPage from './pages/FAQPage';
import DynamicPage from './pages/DynamicPage';
import NotFoundPage from './pages/NotFoundPage';
import BlogPostPage from './components/BlogPostPage';
import { arabicTranslations, englishTranslations } from './data';

export default function App({ initialData, serverLocation }: { initialData?: CMSData; serverLocation?: string } = {}) {
  const RouterComponent: any = serverLocation !== undefined ? StaticRouter : Router;
  return (
    <CMSProvider initialData={initialData}>
      <RouterComponent location={serverLocation}>
        {initialData?.notFound ? <NotFoundWrapper /> : <Routes>
          {/* Admin CMS System (Isolated from public bundle) */}

          {/* Root Redirect to primary canonical language /ar/ */}
          <Route path="/" element={<Navigate to="/ar/" replace />} />

          {/* Multilingual Routes */}
          <Route path="/:lang" element={<MainWrapper><LanguagePageResolver page="home" /></MainWrapper>} />
          <Route path="/:lang/" element={<MainWrapper><LanguagePageResolver page="home" /></MainWrapper>} />
          <Route path="/:lang/about" element={<MainWrapper><LanguagePageResolver page="about" /></MainWrapper>} />
          <Route path="/:lang/about/" element={<MainWrapper><LanguagePageResolver page="about" /></MainWrapper>} />
          <Route path="/:lang/contact" element={<MainWrapper><LanguagePageResolver page="contact" /></MainWrapper>} />
          <Route path="/:lang/contact/" element={<MainWrapper><LanguagePageResolver page="contact" /></MainWrapper>} />
          <Route path="/:lang/services" element={<MainWrapper><LanguagePageResolver page="services" /></MainWrapper>} />
          <Route path="/:lang/services/" element={<MainWrapper><LanguagePageResolver page="services" /></MainWrapper>} />
          <Route path="/:lang/services/:slug" element={<MainWrapper><LanguagePageResolver page="service-single" /></MainWrapper>} />
          <Route path="/:lang/services/:slug/" element={<MainWrapper><LanguagePageResolver page="service-single" /></MainWrapper>} />
          <Route path="/:lang/locations" element={<MainWrapper><LanguagePageResolver page="locations" /></MainWrapper>} />
          <Route path="/:lang/locations/" element={<MainWrapper><LanguagePageResolver page="locations" /></MainWrapper>} />
          <Route path="/:lang/locations/:slug" element={<MainWrapper><LanguagePageResolver page="location-single" /></MainWrapper>} />
          <Route path="/:lang/locations/:slug/" element={<MainWrapper><LanguagePageResolver page="location-single" /></MainWrapper>} />
          <Route path="/:lang/blog" element={<MainWrapper><LanguagePageResolver page="blog" /></MainWrapper>} />
          <Route path="/:lang/blog/" element={<MainWrapper><LanguagePageResolver page="blog" /></MainWrapper>} />
          <Route path="/:lang/blog/:slug" element={<MainWrapper><LanguagePageResolver page="blog-single" /></MainWrapper>} />
          <Route path="/:lang/blog/:slug/" element={<MainWrapper><LanguagePageResolver page="blog-single" /></MainWrapper>} />
          <Route path="/:lang/estimator" element={<MainWrapper><LanguagePageResolver page="estimator" /></MainWrapper>} />
          <Route path="/:lang/estimator/" element={<MainWrapper><LanguagePageResolver page="estimator" /></MainWrapper>} />
          <Route path="/:lang/faq" element={<MainWrapper><LanguagePageResolver page="faq" /></MainWrapper>} />
          <Route path="/:lang/faq/" element={<MainWrapper><LanguagePageResolver page="faq" /></MainWrapper>} />
          <Route path="/:lang/pages/:slug" element={<MainWrapper><LanguagePageResolver page="dynamic-page" /></MainWrapper>} />
          <Route path="/:lang/pages/:slug/" element={<MainWrapper><LanguagePageResolver page="dynamic-page" /></MainWrapper>} />

          {/* Legacy URL Server/Client 301 Mappings */}
          <Route path="/about" element={<Navigate to="/ar/about/" replace />} />
          <Route path="/contact" element={<Navigate to="/ar/contact/" replace />} />
          <Route path="/services" element={<Navigate to="/ar/services/" replace />} />
          <Route path="/services/:slug" element={<LegacyServiceRedirect />} />
          <Route path="/category/:slug" element={<LegacyServiceRedirect />} />
          <Route path="/locations" element={<Navigate to="/ar/locations/" replace />} />
          <Route path="/locations/:slug" element={<LegacyLocationRedirect />} />
          <Route path="/blog" element={<Navigate to="/ar/blog/" replace />} />
          <Route path="/blog/:slug" element={<LegacyBlogRedirect />} />
          <Route path="/article/:slug" element={<LegacyBlogRedirect />} />
          <Route path="/articles/:slug" element={<LegacyBlogRedirect />} />
          <Route path="/estimator" element={<Navigate to="/ar/estimator/" replace />} />
          <Route path="/faq" element={<Navigate to="/ar/faq/" replace />} />
          <Route path="/pages/:slug" element={<LegacyPageRedirect />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<MainWrapper><NotFoundWrapper /></MainWrapper>} />
        </Routes>}
      </RouterComponent>
    </CMSProvider>
  );
}

// Redirect helpers for legacy URLs
function LegacyServiceRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/ar/services/${slug}/`} replace />;
}

function LegacyLocationRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/ar/locations/${slug}/`} replace />;
}

function LegacyBlogRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/ar/blog/${slug}/`} replace />;
}

function LegacyPageRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/ar/pages/${slug}/`} replace />;
}

function MainWrapper({ children }: { children: React.ReactNode }) {
  const { cmsData } = useCMS();
  return <>{cmsData.preview && <aside className="bg-amber-300 text-black p-3 text-center">Preview — unpublished content</aside>}{children}</>;
}

interface LanguagePageResolverProps {
  page: 'home' | 'about' | 'contact' | 'services' | 'service-single' | 'locations' | 'location-single' | 'blog' | 'blog-single' | 'estimator' | 'faq' | 'dynamic-page';
}

function LanguagePageResolver({ page }: LanguagePageResolverProps) {
  const params = useParams<{ lang?: string }>();
  const rawLang = params.lang || 'ar';
  
  // Validate language code


  const lang = rawLang as 'ar' | 'en';
  const t = lang === 'ar' ? arabicTranslations : englishTranslations;

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  if (rawLang !== 'ar' && rawLang !== 'en') return <NotFoundPage lang="ar" />;

  const setLang = (newLang: 'ar' | 'en') => {
    // Language toggle is handled seamlessly in LanguageSelector
  };

  let PageComponent = null;

  switch (page) {
    case 'home':
      PageComponent = <HomePage lang={lang} t={t} />;
      break;
    case 'about':
      PageComponent = <AboutPage lang={lang} t={t} />;
      break;
    case 'contact':
      PageComponent = <ContactPage lang={lang} t={t} />;
      break;
    case 'services':
      PageComponent = <ServicesArchivePage lang={lang} t={t} />;
      break;
    case 'service-single':
      PageComponent = <CategorySinglePage lang={lang} />;
      break;
    case 'locations':
      PageComponent = <LocationsArchivePage lang={lang} />;
      break;
    case 'location-single':
      PageComponent = <LocationSinglePage lang={lang} />;
      break;
    case 'blog':
      PageComponent = <BlogArchivePage lang={lang} t={t} />;
      break;
    case 'blog-single':
      PageComponent = <BlogPostPage lang={lang} setLang={setLang} t={t} />;
      break;
    case 'estimator':
      PageComponent = <EstimatorPage lang={lang} t={t} />;
      break;
    case 'faq':
      PageComponent = <FAQPage lang={lang} t={t} />;
      break;
    case 'dynamic-page':
      PageComponent = <DynamicPage lang={lang} />;
      break;
    default:
      PageComponent = <NotFoundPage lang={lang} />;
  }

  return (
    <AppLayout lang={lang} setLang={setLang} t={t}>
      {PageComponent}
    </AppLayout>
  );
}

function NotFoundWrapper() {
  const lang = useLocation().pathname.startsWith("/en/") ? "en" : "ar";
  return (
    <AppLayout lang={lang} setLang={() => {}} t={lang === "en" ? englishTranslations : arabicTranslations}>
      <NotFoundPage lang={lang} />
    </AppLayout>
  );
}
