import { ContentRevision, PublishingStatus } from '../types/domain';

export interface LocationItem {
  id: string;
  slug: string;
  cityAr: string;
  cityEn: string;
  titleAr: string;
  titleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  contentAr: string;
  contentEn: string;
  servicesOfferedAr: string[];
  servicesOfferedEn: string[];
  phone?: string;
  addressAr?: string;
  addressEn?: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  labelAr: string;
  labelEn: string;
  path: string;
  order: number;
  isHeader: boolean;
  isFooter: boolean;
  openInNewTab?: boolean;
}

export interface RedirectionItem {
  id: string;
  fromUrl: string;
  toUrl: string;
  type: '301' | '302';
  active: boolean;
}

export interface PageItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
  contentAr: string;
  contentEn: string;
  status?: PublishingStatus;
  isPublished: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  trashedAt?: string;
  revisions?: ContentRevision[];
  updatedAt: string;
}

export interface VideoPost {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  videoUrl: string;
  youtubeId?: string;
  type: 'purchase_proof' | 'service_guide';
  category?: string;
  date: string;
  featured: boolean;
  thumbnail?: string;
}

export interface ClientItem {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string;
  type: 'corporate' | 'individual' | 'contractor' | 'factory';
  status: 'active' | 'new_lead' | 'vip';
  companyRegNumber?: string;
  phone?: string;
  location?: string;
  totalTransactions?: string;
  dateAdded: string;
  notes?: string;
}

export interface SiteSettings {
  siteTitleAr: string;
  siteTitleEn: string;
  siteTaglineAr: string;
  siteTaglineEn: string;
  siteIcon: string; // Favicon URL / Upload
  siteLogo: string; // Header Logo & Footer Logo URL / Upload
  phone: string;
  whatsapp: string;
  email: string;
  locationAr: string;
  locationEn: string;
  workingHoursAr: string;
  workingHoursEn: string;
  announcementBarAr: string;
  announcementBarEn: string;
  showAnnouncementBar: boolean;
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
  siteKeywordsAr: string;
  siteKeywordsEn: string;

  // Webmaster & Analytics
  googleWebmasterCode: string;
  bingWebmasterCode: string;
  analyticsCode: string;

  // SEO Extras
  imageSeoAltRule: string;
  autoImageAltEnabled: boolean;
  llmsTxtContent: string;
  localSeoName: string;
  localSeoAddress: string;
  localSeoGeo: string;
  localSeoHours: string;
  redirections: RedirectionItem[];
  schemaJsonLd: string;
  siteUrl?: string;
  sitemapUrl: string;
  sitemapAutoGenerate: boolean;
  robotsTxtContent: string;

  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl?: string;
  googleMapEmbedUrl?: string;
  currencyAr: string;
  currencyEn: string;
}

export interface SliderSlide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badgeAr: string;
  badgeEn: string;
  image: string;
  ctaTextAr: string;
  ctaTextEn: string;
  ctaType: 'whatsapp' | 'estimator' | 'custom';
  ctaUrl?: string;
  order: number;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  date: string;
  status: PublishingStatus;
  isPublished?: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  trashedAt?: string;
  revisions?: ContentRevision[];
  views: number;
  postType?: 'article' | 'video';
  videoUrl?: string;
  youtubeId?: string;
}

export interface ScrapCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  rateEstimateAr: string;
  rateEstimateEn: string;
  baseRateSarPerKg: number;
  featuredImage: string;
  order: number;
}

export interface ScrapServiceItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  rateEstimateAr: string;
  rateEstimateEn: string;
  iconName: string;
  image: string;
  pointsAr: string[];
  pointsEn: string[];
  active: boolean;
  order: number;
}

export interface TagItem {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  role: 'super_admin' | 'administrator' | 'editor' | 'author' | 'moderator' | 'viewer';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  location?: string;
  materialType?: string;
  estimatedWeight?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface FAQEntry {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
}

export interface TestimonialEntry {
  id: string;
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  rating: number;
  textAr: string;
  textEn: string;
  date: string;
  verified: boolean;
}

export interface ThemeConfig {
  primaryColor: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate';
  enableDarkModeHeader: boolean;
  enableFloatingWhatsapp: boolean;
  enableWhiteLabel?: boolean;
  customCss?: string;
  footerTextAr: string;
  footerTextEn: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  size?: string;
  mimeType?: string;
  date: string;
}

export interface SearchQueryLog {
  id: string;
  query: string;
  category?: string;
  count: number;
  lastSearched: string;
  source: 'header_search' | 'estimator' | 'blog_search' | 'category_filter';
}

export interface CategoryAnalyticsStat {
  categoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
  viewsCount: number;
  inquiriesCount: number;
  searchesCount: number;
}

export interface EquipmentItem {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  capacityAr: string;
  capacityEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  specificationsAr?: string[];
  specificationsEn?: string[];
  active: boolean;
  order: number;
}

export interface WhyUsFeature {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  iconName: string;
  order: number;
  active: boolean;
}

export interface EstimatorConfig {
  aiAdviceAr: string;
  aiAdviceEn: string;
  minWeightKg: number;
  maxWeightKg: number;
  baseConfidence: number;
  whatsappMessageHeaderAr: string;
  whatsappMessageHeaderEn: string;
}

export interface CMSData {
  settings: SiteSettings;
  pages: PageItem[];
  slides: SliderSlide[];
  posts: BlogPost[];
  videoPosts: VideoPost[];
  categories: ScrapCategory[];
  services: ScrapServiceItem[];
  equipments?: EquipmentItem[];
  whyUsFeatures?: WhyUsFeature[];
  estimatorConfig?: EstimatorConfig;
  tags: TagItem[];
  clients: ClientItem[];
  users: AdminUser[];
  inquiries: Inquiry[];
  faqs: FAQEntry[];
  testimonials: TestimonialEntry[];
  locations?: LocationItem[];
  menus?: MenuItem[];
  theme: ThemeConfig;
  mediaLibrary?: MediaItem[];
  searchLogs?: SearchQueryLog[];
  categoryStats?: CategoryAnalyticsStat[];
}
