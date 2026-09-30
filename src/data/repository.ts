import { randomUUID } from 'node:crypto';
/**
 * Authoritative Repository & Data Access Layer
 * Shera Scrap Haraj CMS & Public Portal
 *
 * Implements ONE authoritative source of truth with normalized entities:
 * - posts
 * - pages
 * - services
 * - locations
 * - categories
 * - tags
 * - media
 * - menus
 * - redirects
 * - settings
 * - users
 * - roles
 * - inquiries
 * - auditLogs
 *
 * Provides safe abstraction for SSR rendering and Admin mutations,
 * without exposing direct database implementation details to UI consumers.
 */

import fs from 'fs';
import { storeContext } from '../server/cloudStore';
import { cloudStorageEnabled } from '../server/firebaseAdmin';
import path from 'path';
import { SITE_CONFIG } from '../config/site';
import { generateSlug } from '../utils/slugService';
import { getNormalizedEntities } from './migration';
import {
  DomainPost,
  DomainPage,
  DomainCategory,
  DomainLocation,
  DomainMenuItem,
  DomainRedirect,
  DomainSiteSettings,
  DomainUser,
  DomainInquiry,
  DomainAuditLog,
  DomainMedia,
  DomainTag,
  ContentRevision,
  PublishingStatus,
} from '../types/domain';
import { CMSData, BlogPost, PageItem, ScrapServiceItem, ScrapCategory, LocationItem, MenuItem, RedirectionItem, SiteSettings } from '../cms/types';
import { initialCMSData } from '../cms/defaultData';

export interface NormalizedStore {
  content?: Partial<CMSData>;
  version: number;
  migratedAt: string;
  posts: DomainPost[];
  pages: DomainPage[];
  services: any[];
  locations: DomainLocation[];
  categories: DomainCategory[];
  tags: DomainTag[];
  media: DomainMedia[];
  menus: DomainMenuItem[];
  redirects: DomainRedirect[];
  settings: DomainSiteSettings;
  users: DomainUser[];
  roles: any[];
  inquiries: DomainInquiry[];
  auditLogs: DomainAuditLog[];
}

const STORE_PATH = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'), 'store.json');

// Initialize in-memory cache
let inMemoryStore: NormalizedStore | null = null;

/**
 * Load authoritative store from disk or generate normalized seed
 */
export function loadStore(): NormalizedStore {
  const context = storeContext.getStore();
  if (context) return context.store;
  if (cloudStorageEnabled() && process.env.CMS_BUILD !== '1') throw new Error('Cloud repository requires a request context');
  if (inMemoryStore) return inMemoryStore;

  try {
    if (typeof process !== 'undefined' && fs.existsSync && fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      inMemoryStore = JSON.parse(raw) as NormalizedStore;
      return inMemoryStore;
    }
  } catch (e) {
    console.warn('Repository: Failed to read from data/store.json, falling back to normalization engine:', e);
  }

  // Fallback: Generate normalized entities deterministically
  const normalized = getNormalizedEntities();
  inMemoryStore = {
    version: 1,
    migratedAt: new Date().toISOString(),
    media: [],
    ...normalized,
  };

  // Attempt to persist fallback
  try {
    if (typeof process !== 'undefined' && fs.writeFileSync) {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STORE_PATH, JSON.stringify(inMemoryStore, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Repository: Could not write initial store to disk:', err);
  }

  return inMemoryStore;
}

/**
 * Persist store to disk and update in-memory cache
 */
function persistStore(store: NormalizedStore) {
  const context = storeContext.getStore();
  if (context) { context.store = store; context.dirty = true; return; }
  if (cloudStorageEnabled() && process.env.CMS_BUILD !== '1') throw new Error('Cloud writes require a request context');
  inMemoryStore = store;
  try {
    if (typeof process !== 'undefined' && fs.writeFileSync) {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const tempPath = STORE_PATH + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
      fs.renameSync(tempPath, STORE_PATH);
    }
  } catch (err) {
    inMemoryStore = null;
    throw new Error('Failed to persist CMS data', { cause: err });
  }
}

// -----------------------------------------------------------------------------
// PUBLISHING STATE EVALUATION HELPER
// -----------------------------------------------------------------------------

export { isContentPublished } from '../utils/publication';
import { isContentPublished } from '../utils/publication';

// -----------------------------------------------------------------------------
// POSTS REPOSITORY & PUBLISHING WORKFLOW
// -----------------------------------------------------------------------------

export function getAllPosts(): DomainPost[] {
  const store = loadStore();
  return store.posts || [];
}

export function getPublishedPosts(lang: 'ar' | 'en' = 'ar'): DomainPost[] {
  return getAllPosts().filter(p => isContentPublished(p));
}

export function getPostBySlug(slug: string, preview: boolean = false): DomainPost | null {
  const cleanSlug = generateSlug(slug);
  const posts = getAllPosts();
  const post = posts.find(p => generateSlug(p.slug) === cleanSlug || p.id === slug);
  if (!post) return null;
  // Trashed posts cannot be viewed even with preview unless explicitly handled
  if (post.status === 'trash' && !preview) return null;
  if (isContentPublished(post) || preview) return post;
  return null;
}

export function savePost(post: Partial<DomainPost> & { titleAr: string }): DomainPost {
  const store = loadStore();
  const id = post.id || `post-${Date.now()}`;
  const slug = generateSlug(post.slug || post.titleAr);
  const now = new Date().toISOString();

  const existingIndex = store.posts.findIndex(p => p.id === id);
  const existingPost = existingIndex >= 0 ? store.posts[existingIndex] : null;

  // Determine publication status
  const requestedStatus: PublishingStatus = post.status || (existingPost ? existingPost.status : 'draft');
  const scheduledFor = post.scheduledFor || existingPost?.scheduledFor;
  const isPub = isContentPublished({ status: requestedStatus, scheduledFor });
  const publishedAt = requestedStatus === 'published' 
    ? (post.publishedAt || existingPost?.publishedAt || now) 
    : existingPost?.publishedAt;

  // Handle revisions history snapshot before mutation
  let revisions: ContentRevision[] = existingPost?.revisions || [];
  if (existingPost) {
    const hasContentChanged = 
      existingPost.contentAr !== post.contentAr ||
      existingPost.contentEn !== post.contentEn ||
      existingPost.titleAr !== post.titleAr ||
      existingPost.status !== requestedStatus;

    if (hasContentChanged) {
      const newRev: ContentRevision = {
        id: `rev-post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        revisionNumber: revisions.length + 1,
        entityId: id,
        entityType: 'post',
        titleAr: existingPost.titleAr,
        titleEn: existingPost.titleEn,
        contentAr: existingPost.contentAr,
        contentEn: existingPost.contentEn,
        excerptAr: existingPost.excerptAr,
        excerptEn: existingPost.excerptEn,
        slug: existingPost.slug,
        status: existingPost.status,
        savedAt: existingPost.updatedAt || now,
        savedBy: existingPost.author || 'Author',
        changeSummary: `Snapshot before update to status: ${requestedStatus}`,
      };
      revisions = [newRev, ...revisions].slice(0, 25);
    }
  }

  const savedPost: DomainPost = {
    id,
    slug,
    titleAr: post.titleAr,
    titleEn: post.titleEn || post.titleAr,
    excerptAr: post.excerptAr || '',
    excerptEn: post.excerptEn || '',
    contentAr: post.contentAr || '',
    contentEn: post.contentEn || '',
    category: post.category || 'scrap-metals',
    categorySlug: generateSlug(post.categorySlug || post.category || 'scrap-metals'),
    tags: post.tags || [],
    featuredImage: post.featuredImage || '',
    author: post.author || 'إدارة شيرا سكراب',
    date: post.date || now.split('T')[0],
    publishedAt,
    scheduledFor,
    trashedAt: requestedStatus === 'trash' ? (post.trashedAt || now) : undefined,
    status: requestedStatus,
    isPublished: isPub,
    views: post.views || existingPost?.views || 0,
    seoTitleAr: post.seoTitleAr || post.titleAr,
    seoTitleEn: post.seoTitleEn || post.titleEn,
    seoDescriptionAr: post.seoDescriptionAr || post.excerptAr,
    seoDescriptionEn: post.seoDescriptionEn || post.excerptEn,
    revisions,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    const oldPost = store.posts[existingIndex];
    if (oldPost && oldPost.slug && oldPost.slug !== slug && isContentPublished(oldPost)) {
      const oldArPath = `/ar/blog/${oldPost.slug}/`;
      const newArPath = `/ar/blog/${slug}/`;
      const oldEnPath = `/en/blog/${oldPost.slug}/`;
      const newEnPath = `/en/blog/${slug}/`;

      if (!store.redirects.some(r => r.fromUrl === oldArPath)) {
        store.redirects.push({
          id: `red-auto-${Date.now()}-ar`,
          fromUrl: oldArPath,
          toUrl: newArPath,
          type: '301',
          active: true,
          createdAt: now,
        });
      }
      if (!store.redirects.some(r => r.fromUrl === oldEnPath)) {
        store.redirects.push({
          id: `red-auto-${Date.now()}-en`,
          fromUrl: oldEnPath,
          toUrl: newEnPath,
          type: '301',
          active: true,
          createdAt: now,
        });
      }
    }
    store.posts[existingIndex] = savedPost;
  } else {
    store.posts.unshift(savedPost);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_POST' : 'CREATE_POST',
    entityType: 'posts',
    entityId: id,
    details: `Saved post: ${post.titleAr} (${slug}) [Status: ${requestedStatus}]`,
  });

  persistStore(store);
  return savedPost;
}

export function trashPost(id: string): DomainPost | null {
  const store = loadStore();
  const index = store.posts.findIndex(p => p.id === id);
  if (index < 0) return null;

  const post = store.posts[index];
  const now = new Date().toISOString();
  post.status = 'trash';
  post.isPublished = false;
  post.trashedAt = now;
  post.updatedAt = now;

  logAuditEvent({
    action: 'TRASH_POST',
    entityType: 'posts',
    entityId: id,
    details: `Moved post ${post.titleAr} to Trash`,
  });

  persistStore(store);
  return post;
}

export function restorePost(id: string): DomainPost | null {
  const store = loadStore();
  const index = store.posts.findIndex(p => p.id === id);
  if (index < 0) return null;

  const post = store.posts[index];
  const now = new Date().toISOString();
  post.status = 'draft'; // restored items safely return to draft state
  post.isPublished = false;
  post.trashedAt = undefined;
  post.updatedAt = now;

  logAuditEvent({
    action: 'RESTORE_POST',
    entityType: 'posts',
    entityId: id,
    details: `Restored post ${post.titleAr} from Trash to Draft`,
  });

  persistStore(store);
  return post;
}

export function deletePost(id: string): boolean {
  return deletePostPermanently(id);
}

export function deletePostPermanently(id: string): boolean {
  const store = loadStore();
  const initialLength = store.posts.length;
  store.posts = store.posts.filter(p => p.id !== id);
  if (store.posts.length !== initialLength) {
    logAuditEvent({
      action: 'PERMANENT_DELETE_POST',
      entityType: 'posts',
      entityId: id,
      details: `Permanently deleted post with ID: ${id}`,
    });
    persistStore(store);
    return true;
  }
  return false;
}

export function getPostRevisions(id: string): ContentRevision[] {
  const store = loadStore();
  const post = store.posts.find(p => p.id === id);
  return post?.revisions || [];
}

export function restorePostRevision(id: string, revisionId: string, restoredBy: string = 'Editor'): DomainPost | null {
  const store = loadStore();
  const post = store.posts.find(p => p.id === id);
  if (!post || !post.revisions) return null;

  const revision = post.revisions.find(r => r.id === revisionId);
  if (!revision) return null;

  // Snapshot current state before rollback
  const now = new Date().toISOString();
  const rollbackSnapshot: ContentRevision = {
    id: `rev-post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    revisionNumber: post.revisions.length + 1,
    entityId: post.id,
    entityType: 'post',
    titleAr: post.titleAr,
    titleEn: post.titleEn,
    contentAr: post.contentAr,
    contentEn: post.contentEn,
    excerptAr: post.excerptAr,
    excerptEn: post.excerptEn,
    slug: post.slug,
    status: post.status,
    savedAt: post.updatedAt || now,
    savedBy: restoredBy,
    changeSummary: `Snapshot before restoring revision ${revision.revisionNumber}`,
  };

  // Revert fields
  post.titleAr = revision.titleAr;
  post.titleEn = revision.titleEn;
  post.contentAr = revision.contentAr;
  post.contentEn = revision.contentEn;
  if (revision.excerptAr) post.excerptAr = revision.excerptAr;
  if (revision.excerptEn) post.excerptEn = revision.excerptEn;
  post.updatedAt = now;
  post.revisions = [rollbackSnapshot, ...post.revisions].slice(0, 25);

  logAuditEvent({
    action: 'RESTORE_POST_REVISION',
    entityType: 'posts',
    entityId: id,
    details: `Restored revision #${revision.revisionNumber} for post ${post.titleAr}`,
  });

  persistStore(store);
  return post;
}

// -----------------------------------------------------------------------------
// PAGES REPOSITORY & PUBLISHING WORKFLOW
// -----------------------------------------------------------------------------

export function getAllPages(): DomainPage[] {
  const store = loadStore();
  return store.pages || [];
}

export function getPublishedPages(lang: 'ar' | 'en' = 'ar'): DomainPage[] {
  return getAllPages().filter(p => isContentPublished(p));
}

export function getPageBySlug(slug: string, preview: boolean = false): DomainPage | null {
  const cleanSlug = generateSlug(slug);
  const pages = getAllPages();
  const page = pages.find(p => generateSlug(p.slug) === cleanSlug || p.id === slug);
  if (!page) return null;
  if (page.status === 'trash' && !preview) return null;
  if (isContentPublished(page) || preview) return page;
  return null;
}

export function savePage(page: Partial<DomainPage> & { titleAr: string }): DomainPage {
  const store = loadStore();
  const id = page.id || `page-${Date.now()}`;
  const slug = generateSlug(page.slug || page.titleAr);
  const now = new Date().toISOString();

  const existingIndex = store.pages.findIndex(p => p.id === id);
  const existingPage = existingIndex >= 0 ? store.pages[existingIndex] : null;

  // Determine publication status
  const requestedStatus: PublishingStatus = page.status || (page.isPublished === false ? 'draft' : 'published');
  const scheduledFor = page.scheduledFor || existingPage?.scheduledFor;
  const isPub = isContentPublished({ status: requestedStatus, scheduledFor });
  const publishedAt = requestedStatus === 'published'
    ? (page.publishedAt || existingPage?.publishedAt || now)
    : existingPage?.publishedAt;

  // Handle revisions history snapshot before mutation
  let revisions: ContentRevision[] = existingPage?.revisions || [];
  if (existingPage) {
    const hasContentChanged =
      existingPage.contentAr !== page.contentAr ||
      existingPage.contentEn !== page.contentEn ||
      existingPage.titleAr !== page.titleAr ||
      existingPage.status !== requestedStatus;

    if (hasContentChanged) {
      const newRev: ContentRevision = {
        id: `rev-page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        revisionNumber: revisions.length + 1,
        entityId: id,
        entityType: 'page',
        titleAr: existingPage.titleAr,
        titleEn: existingPage.titleEn,
        contentAr: existingPage.contentAr,
        contentEn: existingPage.contentEn,
        slug: existingPage.slug,
        status: existingPage.status,
        savedAt: existingPage.updatedAt || now,
        savedBy: 'Administrator',
        changeSummary: `Snapshot before update to status: ${requestedStatus}`,
      };
      revisions = [newRev, ...revisions].slice(0, 25);
    }
  }

  const savedPage: DomainPage = {
    id,
    slug,
    titleAr: page.titleAr,
    titleEn: page.titleEn || page.titleAr,
    contentAr: page.contentAr || '',
    contentEn: page.contentEn || '',
    seoTitleAr: page.seoTitleAr || page.titleAr,
    seoTitleEn: page.seoTitleEn || page.titleEn,
    seoDescriptionAr: page.seoDescriptionAr || '',
    seoDescriptionEn: page.seoDescriptionEn || '',
    status: requestedStatus,
    isPublished: isPub,
    publishedAt,
    scheduledFor,
    trashedAt: requestedStatus === 'trash' ? (page.trashedAt || now) : undefined,
    revisions,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    const oldPage = store.pages[existingIndex];
    if (oldPage && oldPage.slug && oldPage.slug !== slug && isContentPublished(oldPage)) {
      const oldArPath = `/ar/pages/${oldPage.slug}/`;
      const newArPath = `/ar/pages/${slug}/`;
      if (!store.redirects.some(r => r.fromUrl === oldArPath)) {
        store.redirects.push({
          id: `red-page-auto-${Date.now()}`,
          fromUrl: oldArPath,
          toUrl: newArPath,
          type: '301',
          active: true,
          createdAt: now,
        });
      }
    }
    store.pages[existingIndex] = savedPage;
  } else {
    store.pages.push(savedPage);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_PAGE' : 'CREATE_PAGE',
    entityType: 'pages',
    entityId: id,
    details: `Saved page: ${page.titleAr} (${slug}) [Status: ${requestedStatus}]`,
  });

  persistStore(store);
  return savedPage;
}

export function trashPage(id: string): DomainPage | null {
  const store = loadStore();
  const index = store.pages.findIndex(p => p.id === id);
  if (index < 0) return null;

  const page = store.pages[index];
  const now = new Date().toISOString();
  page.status = 'trash';
  page.isPublished = false;
  page.trashedAt = now;
  page.updatedAt = now;

  logAuditEvent({
    action: 'TRASH_PAGE',
    entityType: 'pages',
    entityId: id,
    details: `Moved page ${page.titleAr} to Trash`,
  });

  persistStore(store);
  return page;
}

export function restorePage(id: string): DomainPage | null {
  const store = loadStore();
  const index = store.pages.findIndex(p => p.id === id);
  if (index < 0) return null;

  const page = store.pages[index];
  const now = new Date().toISOString();
  page.status = 'draft';
  page.isPublished = false;
  page.trashedAt = undefined;
  page.updatedAt = now;

  logAuditEvent({
    action: 'RESTORE_PAGE',
    entityType: 'pages',
    entityId: id,
    details: `Restored page ${page.titleAr} from Trash to Draft`,
  });

  persistStore(store);
  return page;
}

export function deletePage(id: string): boolean {
  return deletePagePermanently(id);
}

export function deletePagePermanently(id: string): boolean {
  const store = loadStore();
  const initialLength = store.pages.length;
  store.pages = store.pages.filter(p => p.id !== id);
  if (store.pages.length !== initialLength) {
    logAuditEvent({
      action: 'PERMANENT_DELETE_PAGE',
      entityType: 'pages',
      entityId: id,
      details: `Permanently deleted page with ID: ${id}`,
    });
    persistStore(store);
    return true;
  }
  return false;
}

export function getPageRevisions(id: string): ContentRevision[] {
  const store = loadStore();
  const page = store.pages.find(p => p.id === id);
  return page?.revisions || [];
}

export function restorePageRevision(id: string, revisionId: string, restoredBy: string = 'Administrator'): DomainPage | null {
  const store = loadStore();
  const page = store.pages.find(p => p.id === id);
  if (!page || !page.revisions) return null;

  const revision = page.revisions.find(r => r.id === revisionId);
  if (!revision) return null;

  const now = new Date().toISOString();
  const rollbackSnapshot: ContentRevision = {
    id: `rev-page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    revisionNumber: page.revisions.length + 1,
    entityId: page.id,
    entityType: 'page',
    titleAr: page.titleAr,
    titleEn: page.titleEn,
    contentAr: page.contentAr,
    contentEn: page.contentEn,
    slug: page.slug,
    status: page.status,
    savedAt: page.updatedAt || now,
    savedBy: restoredBy,
    changeSummary: `Snapshot before restoring revision ${revision.revisionNumber}`,
  };

  page.titleAr = revision.titleAr;
  page.titleEn = revision.titleEn;
  page.contentAr = revision.contentAr;
  page.contentEn = revision.contentEn;
  page.updatedAt = now;
  page.revisions = [rollbackSnapshot, ...page.revisions].slice(0, 25);

  logAuditEvent({
    action: 'RESTORE_PAGE_REVISION',
    entityType: 'pages',
    entityId: id,
    details: `Restored revision #${revision.revisionNumber} for page ${page.titleAr}`,
  });

  persistStore(store);
  return page;
}

// -----------------------------------------------------------------------------
// SERVICES REPOSITORY
// -----------------------------------------------------------------------------

export function getAllServices(): any[] {
  const store = loadStore();
  return store.services || [];
}

export function getPublishedServices(): any[] {
  return getAllServices().filter(s => s.active !== false);
}

export function getServiceBySlug(slug: string): any | null {
  const cleanSlug = generateSlug(slug);
  return getAllServices().find(s => generateSlug(s.slug) === cleanSlug || s.id === slug) || null;
}

export function saveService(service: any): any {
  const store = loadStore();
  const id = service.id || `srv-${Date.now()}`;
  const slug = generateSlug(service.slug || service.titleAr);
  const now = new Date().toISOString();

  const existingIndex = store.services.findIndex(s => s.id === id);
  const savedService = {
    ...service,
    id,
    slug,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store.services[existingIndex] = savedService;
  } else {
    store.services.push(savedService);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_SERVICE' : 'CREATE_SERVICE',
    entityType: 'services',
    entityId: id,
    details: `Saved service: ${service.titleAr}`,
  });

  persistStore(store);
  return savedService;
}

export function deleteService(id: string): boolean {
  const store = loadStore();
  const initialLength = store.services.length;
  store.services = store.services.filter(s => s.id !== id);
  if (store.services.length !== initialLength) {
    logAuditEvent({
      action: 'DELETE_SERVICE',
      entityType: 'services',
      entityId: id,
      details: `Deleted service with ID: ${id}`,
    });
    persistStore(store);
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// LOCATIONS REPOSITORY
// -----------------------------------------------------------------------------

export function getAllLocations(): DomainLocation[] {
  const store = loadStore();
  return store.locations || [];
}

export function getPublishedLocations(): DomainLocation[] {
  return getAllLocations().filter(l => l.isPublished);
}

export function getLocationBySlug(slug: string): DomainLocation | null {
  const cleanSlug = generateSlug(slug);
  return getAllLocations().find(l => generateSlug(l.slug) === cleanSlug || l.id === slug) || null;
}

export function saveLocation(loc: Partial<DomainLocation> & { titleAr: string; cityAr: string }): DomainLocation {
  const store = loadStore();
  const id = loc.id || `loc-${Date.now()}`;
  const slug = generateSlug(loc.slug || loc.titleAr);
  const now = new Date().toISOString();

  const existingIndex = store.locations.findIndex(l => l.id === id);
  const savedLoc: DomainLocation = {
    id,
    slug,
    cityAr: loc.cityAr,
    cityEn: loc.cityEn || loc.cityAr,
    titleAr: loc.titleAr,
    titleEn: loc.titleEn || loc.titleAr,
    metaDescriptionAr: loc.metaDescriptionAr || '',
    metaDescriptionEn: loc.metaDescriptionEn || '',
    contentAr: loc.contentAr || '',
    contentEn: loc.contentEn || '',
    servicesOfferedAr: loc.servicesOfferedAr || [],
    servicesOfferedEn: loc.servicesOfferedEn || [],
    phone: loc.phone || SITE_CONFIG.business.phone,
    addressAr: loc.addressAr || '',
    addressEn: loc.addressEn || '',
    status: loc.isPublished ? 'published' : 'draft',
    isPublished: loc.isPublished !== false,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store.locations[existingIndex] = savedLoc;
  } else {
    store.locations.push(savedLoc);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_LOCATION' : 'CREATE_LOCATION',
    entityType: 'locations',
    entityId: id,
    details: `Saved location: ${loc.cityAr} (${slug})`,
  });

  persistStore(store);
  return savedLoc;
}

export function deleteLocation(id: string): boolean {
  const store = loadStore();
  const initialLength = store.locations.length;
  store.locations = store.locations.filter(l => l.id !== id);
  if (store.locations.length !== initialLength) {
    logAuditEvent({
      action: 'DELETE_LOCATION',
      entityType: 'locations',
      entityId: id,
      details: `Deleted location with ID: ${id}`,
    });
    persistStore(store);
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// CATEGORIES REPOSITORY
// -----------------------------------------------------------------------------

export function getAllCategories(): DomainCategory[] {
  const store = loadStore();
  return store.categories || [];
}

export function getCategoryBySlug(slug: string): DomainCategory | null {
  const cleanSlug = generateSlug(slug);
  return getAllCategories().find(c => generateSlug(c.slug) === cleanSlug || c.id === slug) || null;
}

export function getScrapCategoryBySlug(slug: string): ScrapCategory | null {
  return getCategoryBySlug(slug) as any;
}

export function saveCategory(category: Partial<DomainCategory> & { nameAr: string }): DomainCategory {
  const store = loadStore();
  const id = category.id || `cat-${Date.now()}`;
  const slug = generateSlug(category.slug || category.nameAr);
  const now = new Date().toISOString();

  const existingIndex = store.categories.findIndex(c => c.id === id);
  const savedCat: DomainCategory = {
    id,
    slug,
    nameAr: category.nameAr,
    nameEn: category.nameEn || category.nameAr,
    descriptionAr: category.descriptionAr || '',
    descriptionEn: category.descriptionEn || '',
    rateEstimateAr: category.rateEstimateAr || '',
    rateEstimateEn: category.rateEstimateEn || '',
    iconName: category.iconName || 'Flame',
    featuredImage: category.featuredImage || '',
    featured: Boolean(category.featured),
    order: category.order || 1,
    pointsAr: category.pointsAr || [],
    pointsEn: category.pointsEn || [],
    status: 'published',
    isPublished: true,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    store.categories[existingIndex] = savedCat;
  } else {
    store.categories.push(savedCat);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_CATEGORY' : 'CREATE_CATEGORY',
    entityType: 'categories',
    entityId: id,
    details: `Saved category: ${category.nameAr}`,
  });

  persistStore(store);
  return savedCat;
}

export function deleteCategory(id: string): boolean {
  const store = loadStore();
  const initialLength = store.categories.length;
  store.categories = store.categories.filter(c => c.id !== id);
  if (store.categories.length !== initialLength) {
    logAuditEvent({
      action: 'DELETE_CATEGORY',
      entityType: 'categories',
      entityId: id,
      details: `Deleted category with ID: ${id}`,
    });
    persistStore(store);
    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// MENUS & REDIRECTS REPOSITORY
// -----------------------------------------------------------------------------

export function getAllMenus(): DomainMenuItem[] {
  const store = loadStore();
  return store.menus || [];
}

export function saveMenu(menu: DomainMenuItem): DomainMenuItem {
  const store = loadStore();
  const existingIndex = store.menus.findIndex(m => m.id === menu.id);
  if (existingIndex >= 0) {
    store.menus[existingIndex] = menu;
  } else {
    store.menus.push(menu);
  }
  persistStore(store);
  return menu;
}

export function deleteMenu(id: string): boolean {
  const store = loadStore();
  store.menus = store.menus.filter(m => m.id !== id);
  persistStore(store);
  return true;
}

export function getAllRedirects(): DomainRedirect[] {
  const store = loadStore();
  return store.redirects || [];
}

export function getRedirect(path: string): DomainRedirect | null {
  const cleanPath = path.replace(/\/+$/, "") || "/";
  const redirects = getAllRedirects();
  return redirects.find(r => r.active && (r.fromUrl.replace(/\/+$/, "") || "/") === cleanPath) || null;
}

export function saveRedirect(redirect: DomainRedirect): DomainRedirect {
  const store = loadStore();
  const existingIndex = store.redirects.findIndex(r => r.id === redirect.id);
  if (existingIndex >= 0) {
    store.redirects[existingIndex] = redirect;
  } else {
    store.redirects.push(redirect);
  }
  persistStore(store);
  return redirect;
}

export function deleteRedirect(id: string): boolean {
  const store = loadStore();
  store.redirects = store.redirects.filter(r => r.id !== id);
  persistStore(store);
  return true;
}

// -----------------------------------------------------------------------------
// SETTINGS REPOSITORY
// -----------------------------------------------------------------------------

export function getSiteSettings(): DomainSiteSettings {
  const store = loadStore();
  return store.settings;
}

export function updateSiteSettings(partial: Partial<DomainSiteSettings>): DomainSiteSettings {
  const store = loadStore();
  store.settings = {
    ...store.settings,
    ...partial,
    siteUrl: SITE_CONFIG.canonicalDomain,
    sitemapUrl: `${SITE_CONFIG.canonicalDomain}/sitemap.xml`,
    updatedAt: new Date().toISOString(),
  };
  logAuditEvent({
    action: 'UPDATE_SETTINGS',
    entityType: 'settings',
    entityId: 'general',
    details: 'Updated global site settings',
  });
  persistStore(store);
  return store.settings;
}

// -----------------------------------------------------------------------------
// INQUIRIES & AUDIT LOGS REPOSITORY
// -----------------------------------------------------------------------------

export function getAllInquiries(): DomainInquiry[] {
  const store = loadStore();
  return store.inquiries || [];
}

export function createInquiry(inquiry: Omit<DomainInquiry, 'id' | 'createdAt'>): DomainInquiry {
  const store = loadStore();
  const newInq: DomainInquiry = {
    id: `inq-${randomUUID()}`,
    name: inquiry.name.substring(0, 200),
    phone: inquiry.phone.substring(0, 50),
    location: inquiry.location?.substring(0, 200) || 'الدمام',
    materialType: inquiry.materialType?.substring(0, 100) || 'سكراب عام',
    notes: inquiry.notes?.substring(0, 5000) || '',
    status: inquiry.status || 'new',
    createdAt: new Date().toISOString(),
  };
  store.inquiries.unshift(newInq);
  persistStore(store);
  return newInq;
}

export function deleteInquiry(id: string): boolean {
  const store = loadStore();
  const index = store.inquiries.findIndex(i => i.id === id);
  if (index < 0) return false;
  store.inquiries.splice(index, 1);
  persistStore(store);
  return true;
}

export function updateInquiryStatus(id: string, status: DomainInquiry['status']): boolean {
  const store = loadStore();
  const inq = store.inquiries.find(i => i.id === id);
  if (inq) {
    inq.status = status;
    persistStore(store);
    return true;
  }
  return false;
}

export function getAllAuditLogs(): DomainAuditLog[] {
  const store = loadStore();
  return store.auditLogs || [];
}

export function logAuditEvent(event: { action: string; entityType: string; entityId: string; details: string; userId?: string; userName?: string }): DomainAuditLog {
  const store = loadStore();
  const log: DomainAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    userId: event.userId || 'system',
    userName: event.userName || 'Shera Scrap Admin',
    details: event.details,
    timestamp: new Date().toISOString(),
  };
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500);
  }
  persistStore(store);
  return log;
}

// -----------------------------------------------------------------------------
// USERS & ROLES REPOSITORY
// -----------------------------------------------------------------------------

export function getAllUsers(): DomainUser[] {
  const store = loadStore();
  return store.users || [];
}

export function saveUser(user: Partial<DomainUser> & { email: string; username: string }): DomainUser {
  const store = loadStore();
  const id = user.id || `usr-${Date.now()}`;
  const existingIndex = store.users.findIndex(u => u.id === id || u.email.toLowerCase() === user.email.toLowerCase());
  
  const savedUser: DomainUser = {
    id,
    username: user.username,
    name: user.name || user.username,
    email: user.email.toLowerCase(),
    role: user.role || 'editor',
    avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    createdAt: user.createdAt || new Date().toISOString().split('T')[0],
    lastLogin: user.lastLogin || new Date().toISOString().split('T')[0],
  };

  if (existingIndex >= 0) {
    store.users[existingIndex] = savedUser;
  } else {
    store.users.push(savedUser);
  }

  logAuditEvent({
    action: existingIndex >= 0 ? 'UPDATE_USER' : 'CREATE_USER',
    entityType: 'users',
    entityId: id,
    details: `Saved user ${savedUser.email} with role ${savedUser.role}`,
  });

  persistStore(store);
  return savedUser;
}

export function deleteUser(id: string): boolean {
  const store = loadStore();
  const user = store.users.find(u => u.id === id);
  if (!user) return false;

  // Prevent deleting super_admin if it's the last one
  if (user.role === 'super_admin') {
    const superAdmins = store.users.filter(u => u.role === 'super_admin');
    if (superAdmins.length <= 1) {
      throw new Error('Cannot delete the last Super Admin account');
    }
  }

  store.users = store.users.filter(u => u.id !== id);
  logAuditEvent({
    action: 'DELETE_USER',
    entityType: 'users',
    entityId: id,
    details: `Deleted user: ${user.email} (${user.name})`,
  });

  persistStore(store);
  return true;
}

export function getAllRoles(): { id: string; roleName: string; permissions: string[]; description: string }[] {
  const store = loadStore();
  return store.roles || [];
}

import { defaultLocations as baseDefaultLocations, defaultMenus as baseDefaultMenus } from './defaults';

// -----------------------------------------------------------------------------
// COMPATIBILITY LAYER FOR EXISTING SSR & SITEMAP GENERATOR
// -----------------------------------------------------------------------------

export const defaultLocations: LocationItem[] = baseDefaultLocations as any;
export const defaultMenus: MenuItem[] = baseDefaultMenus as any;

export function getAuthoritativeCMSData(storedData?: Partial<CMSData>): CMSData {
  const store = loadStore();
  const base = { ...initialCMSData };
  return {
    ...base,
    ...store.content,
    ...storedData,
    posts: (store.posts as any) || base.posts,
    pages: (store.pages as any) || base.pages,
    services: (store.services as any) || base.services,
    locations: (store.locations as any) || defaultLocations,
    categories: (store.categories as any) || base.categories,
    menus: (store.menus as any) || defaultMenus,
    settings: {
      ...base.settings,
      ...store.settings,
      siteTitleAr: store.settings.siteTitleAr,
      siteTitleEn: store.settings.siteTitleEn,
      siteTaglineAr: store.settings.siteTaglineAr,
      siteTaglineEn: store.settings.siteTaglineEn,
      phone: store.settings.phone,
      whatsapp: store.settings.whatsapp,
      email: store.settings.email,
      siteUrl: SITE_CONFIG.canonicalDomain,
      sitemapUrl: `${SITE_CONFIG.canonicalDomain}/sitemap.xml`,
      redirections: (store.redirects as any) || [],
    },
  };
}

export function getCachedCMSData(): CMSData {
  return getAuthoritativeCMSData();
}

function stampContentChanges<T extends { id: string }>(incoming: T[], previous: T[]): T[] {
  const comparable = (item: any) => JSON.stringify(Object.fromEntries(Object.entries(item).filter(([key]) => !['views', 'updatedAt', 'modifiedAt'].includes(key)).sort(([a], [b]) => a.localeCompare(b))));
  return incoming.map(item => {
    const old = previous.find(p => p.id === item.id);
    return !old || comparable(item) !== comparable(old) ? { ...item, updatedAt: new Date().toISOString() } : item;
  });
}

export function setCachedCMSData(data: CMSData) {
  // Synchronize incoming full data to authoritative store
  const store = loadStore();
  if (data.posts) store.posts = stampContentChanges(data.posts as any[], store.posts);
  if (data.pages) store.pages = stampContentChanges(data.pages as any[], store.pages);
  if (data.services) store.services = data.services as any;
  if (data.locations) store.locations = stampContentChanges(data.locations as any[], store.locations);
  if (data.categories) store.categories = data.categories as any;
  if (data.menus) store.menus = data.menus as any;
  if (data.settings?.redirections) store.redirects = data.settings.redirections as any;
  const { users, inquiries, posts, pages, services, locations, categories, menus, settings, preview, notFound, ...content } = data;
  store.content = { ...store.content, ...content };
  if (settings) store.settings = { ...store.settings, ...settings } as any;
  persistStore(store);
}
