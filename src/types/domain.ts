/**
 * Shera Scrap - Core Domain Entities & Type Definitions
 * Single Source of Truth for CMS entities, roles, and status states.
 */

export type PublishingStatus = 'draft' | 'scheduled' | 'published' | 'archived' | 'trash';

export type UserRole = 'super_admin' | 'administrator' | 'editor' | 'author' | 'viewer';

export interface AuthorRef {
  id: string;
  name: string;
  avatar?: string;
}

export interface ContentRevision {
  id: string;
  revisionNumber: number;
  entityId: string;
  entityType: 'post' | 'page';
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  excerptAr?: string;
  excerptEn?: string;
  slug: string;
  status: PublishingStatus;
  savedAt: string;
  savedBy: string;
  changeSummary?: string;
}

export interface DomainPost {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  category: string;
  categorySlug?: string;
  tags?: string[];
  featuredImage: string;
  author: string;
  date: string;
  publishedAt?: string;
  scheduledFor?: string;
  trashedAt?: string;
  status: PublishingStatus;
  isPublished: boolean;
  views?: number;
  seoTitleAr?: string;
  seoTitleEn?: string;
  seoDescriptionAr?: string;
  seoDescriptionEn?: string;
  revisions?: ContentRevision[];
  updatedAt: string;
}

export interface DomainPage {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  seoTitleAr?: string;
  seoTitleEn?: string;
  seoDescriptionAr?: string;
  seoDescriptionEn?: string;
  status: PublishingStatus;
  isPublished: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  trashedAt?: string;
  revisions?: ContentRevision[];
  updatedAt: string;
}

export interface DomainCategory {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  rateEstimateAr: string;
  rateEstimateEn: string;
  iconName: string;
  featuredImage: string;
  featured: boolean;
  order: number;
  pointsAr: string[];
  pointsEn: string[];
  status: PublishingStatus;
  isPublished: boolean;
  updatedAt: string;
}

export interface DomainLocation {
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
  status: PublishingStatus;
  isPublished: boolean;
  updatedAt: string;
}

export interface DomainRedirect {
  id: string;
  fromUrl: string;
  toUrl: string;
  type: '301' | '302';
  active: boolean;
  createdAt: string;
}

export interface DomainMedia {
  id: string;
  url: string;
  fileName: string;
  altTextAr?: string;
  altTextEn?: string;
  title?: string;
  mimeType: string;
  fileSize: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface DomainMenuItem {
  id: string;
  labelAr: string;
  labelEn: string;
  path: string;
  order: number;
  isHeader: boolean;
  isFooter: boolean;
  openInNewTab?: boolean;
}

export interface DomainUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface DomainTag {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  count?: number;
}

export interface DomainInquiry {
  id: string;
  name: string;
  phone: string;
  location?: string;
  materialType?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface DomainAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  details: string;
  timestamp: string;
}

export interface DomainSiteSettings {
  id: string;
  siteTitleAr: string;
  siteTitleEn: string;
  siteTaglineAr: string;
  siteTaglineEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressAr: string;
  addressEn: string;
  siteUrl: string;
  sitemapUrl: string;
  updatedAt: string;
}

