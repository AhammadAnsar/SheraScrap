import { getCachedCMSData } from '../data/repository';
import { isContentPublished } from '../utils/publication';
import type { CMSData } from '../cms/types';

export function getPublicData(): CMSData {
  const d = getCachedCMSData();
  return {
    settings: { ...d.settings, redirections: [] },
    pages: d.pages.filter(isContentPublished).map(p => ({ ...p, isPublished: true })), posts: d.posts.filter(isContentPublished),
    locations: (d.locations || []).filter(isContentPublished).map(l => ({ ...l, isPublished: true })),
    services: d.services.filter(s => s.active !== false), categories: d.categories,
    slides: d.slides, videoPosts: d.videoPosts, equipments: d.equipments,
    whyUsFeatures: d.whyUsFeatures, estimatorConfig: d.estimatorConfig,
    tags: d.tags, clients: d.clients, faqs: d.faqs, testimonials: d.testimonials,
    menus: d.menus, theme: d.theme, users: [], inquiries: [],
    searchLogs: [], categoryStats: [], mediaLibrary: [],
  };
}
