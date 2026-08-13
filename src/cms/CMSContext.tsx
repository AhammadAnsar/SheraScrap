import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { 
  CMSData, 
  SiteSettings, 
  PageItem,
  SliderSlide, 
  BlogPost, 
  VideoPost,
  ScrapCategory, 
  ScrapServiceItem, 
  EquipmentItem,
  TagItem, 
  ClientItem,
  AdminUser, 
  Inquiry, 
  FAQEntry, 
  TestimonialEntry, 
  ThemeConfig,
  SearchQueryLog,
  CategoryAnalyticsStat
} from './types';
import { initialCMSData } from './defaultData';

const LOCAL_STORAGE_KEY = 'shera_cms_data_v2';
const AUTH_KEY = 'shera_cms_auth_user_v2';

interface CMSContextType {
  cmsData: CMSData;
  currentUser: AdminUser | null;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  
  // Auth
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;

  // Settings & Theme
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;

  // Pages
  addPage: (page: Omit<PageItem, 'id' | 'updatedAt'>) => void;
  updatePage: (id: string, page: Partial<PageItem>) => void;
  deletePage: (id: string) => void;

  // Sliders
  addSlide: (slide: Omit<SliderSlide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<SliderSlide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (slides: SliderSlide[]) => void;

  // Posts
  addPost: (post: Omit<BlogPost, 'id' | 'views'>) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;

  // Video Posts
  addVideoPost: (video: Omit<VideoPost, 'id'>) => void;
  updateVideoPost: (id: string, video: Partial<VideoPost>) => void;
  deleteVideoPost: (id: string) => void;

  // Categories
  addCategory: (category: Omit<ScrapCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ScrapCategory>) => void;
  deleteCategory: (id: string) => void;

  // Services
  addService: (service: Omit<ScrapServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ScrapServiceItem>) => void;
  deleteService: (id: string) => void;

  // Equipments
  addEquipment: (equipment: Omit<EquipmentItem, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<EquipmentItem>) => void;
  deleteEquipment: (id: string) => void;

  // Tags
  addTag: (tag: Omit<TagItem, 'id'>) => void;
  deleteTag: (id: string) => void;

  // Clients
  addClient: (client: Omit<ClientItem, 'id' | 'dateAdded'>) => void;
  updateClient: (id: string, client: Partial<ClientItem>) => void;
  deleteClient: (id: string) => void;

  // Users
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;

  // Inquiries
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  // FAQs
  addFAQ: (faq: Omit<FAQEntry, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQEntry>) => void;
  deleteFAQ: (id: string) => void;

  // Testimonials
  addTestimonial: (test: Omit<TestimonialEntry, 'id'>) => void;
  updateTestimonial: (id: string, test: Partial<TestimonialEntry>) => void;
  deleteTestimonial: (id: string) => void;

  // Backup & Reset
  importCMSData: (jsonString: string) => boolean;
  exportCMSData: () => string;
  resetToDefaults: () => void;

  // Search & Category Analytics
  logSearchQuery: (query: string, category?: string, source?: SearchQueryLog['source']) => void;
  clearSearchLogs: () => void;
  incrementCategoryView: (categoryId: string) => void;

  // Server Persistence Status & Methods
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveCMSData: (newData: CMSData) => void;
  forceServerSync: () => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const isRemoteChange = useRef(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedSettings = { ...initialCMSData.settings, ...(parsed.settings || {}) };

        // Normalize site title & tagline if they hold old/legacy text
        if (!mergedSettings.siteTitleAr || mergedSettings.siteTitleAr.includes('مؤسسة شيرا لشراء السكراب')) {
          mergedSettings.siteTitleAr = "Shera Scrap Haraj - حراج أفضل سكراب";
        }
        if (!mergedSettings.siteTitleEn || mergedSettings.siteTitleEn.includes('Dammam - Certified')) {
          mergedSettings.siteTitleEn = "Shera Scrap Haraj - Best Metal Scrap Dealer";
        }
        if (!mergedSettings.siteTaglineAr || mergedSettings.siteTaglineAr.includes('أفضل شركة لشراء')) {
          mergedSettings.siteTaglineAr = "Best Metal Scrap Dealer";
        }
        if (!mergedSettings.siteTaglineEn) {
          mergedSettings.siteTaglineEn = "Best Metal Scrap Dealer";
        }

        return {
          ...initialCMSData,
          ...parsed,
          equipments: (parsed.equipments && parsed.equipments.length > 0) ? parsed.equipments : initialCMSData.equipments,
          settings: mergedSettings,
          theme: { ...initialCMSData.theme, ...(parsed.theme || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to parse CMS data from localStorage:', e);
    }
    return initialCMSData;
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse auth user:', e);
    }
    return null;
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [isServerLoaded, setIsServerLoaded] = useState<boolean>(false);

  // Helper to persist CMS data to React state, LocalStorage, Firebase Firestore, and PHP server
  const saveCMSData = async (newData: CMSData) => {
    setCmsData(newData);
    setSaveStatus('saving');
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }

    let firestoreSuccess = false;
    try {
      const docRef = doc(db, 'cms', 'content');
      await setDoc(docRef, newData);
      firestoreSuccess = true;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
    } catch (err) {
      console.warn('Firebase Firestore save notice:', err);
    }

    // Sync to PHP backup endpoint if present
    fetch('/api/data.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    })
      .then(res => res.json())
      .then(data => {
        if (!firestoreSuccess) {
          if (data && (data.status === 'success' || data.bytes > 0)) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3500);
          } else {
            setSaveStatus('error');
          }
        }
      })
      .catch(err => {
        console.warn('Backup server save notice:', err);
        if (!firestoreSuccess) setSaveStatus('error');
      });
  };

  const forceServerSync = async (): Promise<boolean> => {
    setSaveStatus('saving');
    try {
      const docRef = doc(db, 'cms', 'content');
      await setDoc(docRef, cmsData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3500);
      return true;
    } catch (err) {
      console.error('Firestore sync failed:', err);
    }
    
    try {
      const res = await fetch('/api/data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsData)
      });
      const data = await res.json();
      if (data && (data.status === 'success' || data.bytes > 0)) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3500);
        return true;
      }
    } catch (err) {
      console.error('PHP server sync failed:', err);
    }
    setSaveStatus('error');
    return false;
  };

  // Subscribe to Firebase Firestore for real-time live synchronization across all devices
  useEffect(() => {
    let isMounted = true;
    const docRef = doc(db, 'cms', 'content');

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (!isMounted) return;
      if (snapshot.exists()) {
        const data = snapshot.data() as CMSData;
        if (data && data.settings) {
          const mergedData = {
            ...initialCMSData,
            ...data,
            settings: { ...initialCMSData.settings, ...(data.settings || {}) },
            theme: { ...initialCMSData.theme, ...(data.theme || {}) }
          };
          isRemoteChange.current = true;
          setCmsData(mergedData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
          } catch (e) {}
        }
      } else {
        // Seed initial data if Firestore document is missing
        setDoc(docRef, initialCMSData).catch(err => console.warn('Firestore initial seed notice:', err));
      }
      setIsServerLoaded(true);
    }, (err) => {
      console.warn('Firestore subscription notice (falling back to server/local):', err);
      // Fallback: fetch from PHP server if Firestore network fails
      fetch('/api/data.php?t=' + Date.now())
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          if (data && data.settings && !data.status) {
            const mergedData = {
              ...initialCMSData,
              ...data,
              settings: { ...initialCMSData.settings, ...(data.settings || {}) },
              theme: { ...initialCMSData.theme, ...(data.theme || {}) }
            };
          isRemoteChange.current = true;
          setCmsData(mergedData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
          } catch (e) {}
          }
        })
        .catch(e => console.log('PHP server fallback notice:', e))
        .finally(() => {
          if (isMounted) setIsServerLoaded(true);
        });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Automatically sync to Firebase Cloud Firestore, Hostinger PHP server API, and LocalStorage whenever cmsData changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cmsData));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }

    if (isRemoteChange.current) {
       // This change came from Firestore onSnapshot. Don't bounce it back.
       isRemoteChange.current = false;
       return;
    }

    if (isServerLoaded) {
      setSaveStatus('saving');

      // 1. Direct write to Firebase Cloud Firestore Database
      const docRef = doc(db, 'cms', 'content');
      setDoc(docRef, cmsData)
        .then(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        })
        .catch(err => {
          console.warn('Firebase Firestore real-time sync notice:', err);
        });

      // 2. Backup write to Hostinger PHP Server Endpoint (/api/data.php)
      fetch('/api/data.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsData)
      }).catch(err => {
        console.warn('Sync to Hostinger server API failed:', err);
      });
    }
  }, [cmsData, isServerLoaded]);

  // Dynamically update browser tab Favicon and Document Title whenever siteIcon/siteLogo/siteTitle changes
  useEffect(() => {
    if (!cmsData || !cmsData.settings) return;
    const settings = cmsData.settings;

    // 1. Favicon link updates
    const iconUrl = settings.siteIcon || settings.siteLogo;
    if (iconUrl) {
      const faviconRels = ["icon", "shortcut icon", "apple-touch-icon"];
      faviconRels.forEach(rel => {
        let link = document.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = iconUrl;
      });
    }

    // 2. Document title update
    if (settings.siteTitleAr || settings.siteTitleEn) {
      const isAr = document.documentElement.lang === 'ar' || document.dir === 'rtl';
      const title = isAr
        ? (settings.siteTitleAr + (settings.siteTaglineAr ? ` | ${settings.siteTaglineAr}` : ''))
        : (settings.siteTitleEn + (settings.siteTaglineEn ? ` | ${settings.siteTaglineEn}` : ''));
      if (title && document.title !== title) {
        document.title = title;
      }
    }
  }, [cmsData.settings?.siteIcon, cmsData.settings?.siteLogo, cmsData.settings?.siteTitleAr, cmsData.settings?.siteTitleEn, cmsData.settings?.siteTaglineAr, cmsData.settings?.siteTaglineEn]);

  // Save auth state
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }, [currentUser]);

  // Auth Methods
  const login = async (usernameInput: string, passInput: string): Promise<boolean> => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (!cleanUsername || !cleanPass) return false;

    // Use Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanUsername, cleanPass);
      if (userCredential.user) {
        const adminUser: AdminUser = {
          id: userCredential.user.uid,
          username: userCredential.user.email?.split('@')[0] || 'admin',
          password: '',
          name: 'مدير النظام (Admin)',
          email: userCredential.user.email || '',
          role: 'super_admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01',
          lastLogin: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(adminUser);
        setIsAdminOpen(true);
        return true;
      }
    } catch (e) {
      console.error("Auth failed:", e);
    }
    return false;
  };


  const logout = () => {
    setCurrentUser(null);
    setIsAdminOpen(false);
  };

  // Settings & Theme
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setCmsData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setCmsData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...newTheme }
    }));
  };

  // Pages
  const addPage = (page: Omit<PageItem, 'id' | 'updatedAt'>) => {
    const newPage: PageItem = {
      ...page,
      id: `page-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCmsData(prev => ({
      ...prev,
      pages: [...(prev.pages || []), newPage]
    }));
  };

  const updatePage = (id: string, page: Partial<PageItem>) => {
    setCmsData(prev => ({
      ...prev,
      pages: (prev.pages || []).map(p => p.id === id ? { ...p, ...page, updatedAt: new Date().toISOString().split('T')[0] } : p)
    }));
  };

  const deletePage = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      pages: (prev.pages || []).filter(p => p.id !== id)
    }));
  };

  // Video Posts
  const addVideoPost = (video: Omit<VideoPost, 'id'>) => {
    const newVid: VideoPost = {
      ...video,
      id: `vid-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      videoPosts: [newVid, ...(prev.videoPosts || [])]
    }));
  };

  const updateVideoPost = (id: string, video: Partial<VideoPost>) => {
    setCmsData(prev => ({
      ...prev,
      videoPosts: (prev.videoPosts || []).map(v => v.id === id ? { ...v, ...video } : v)
    }));
  };

  const deleteVideoPost = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      videoPosts: (prev.videoPosts || []).filter(v => v.id !== id)
    }));
  };

  // Clients
  const addClient = (client: Omit<ClientItem, 'id' | 'dateAdded'>) => {
    const newCli: ClientItem = {
      ...client,
      id: `cli-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setCmsData(prev => ({
      ...prev,
      clients: [newCli, ...(prev.clients || [])]
    }));
  };

  const updateClient = (id: string, client: Partial<ClientItem>) => {
    setCmsData(prev => ({
      ...prev,
      clients: (prev.clients || []).map(c => c.id === id ? { ...c, ...client } : c)
    }));
  };

  const deleteClient = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      clients: (prev.clients || []).filter(c => c.id !== id)
    }));
  };

  const addSlide = (slide: Omit<SliderSlide, 'id'>) => {
    const newSlide: SliderSlide = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
  };

  const updateSlide = (id: string, slide: Partial<SliderSlide>) => {
    setCmsData(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, ...slide } : s)
    }));
  };

  const deleteSlide = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id)
    }));
  };

  const reorderSlides = (slides: SliderSlide[]) => {
    setCmsData(prev => ({ ...prev, slides }));
  };

  // Posts
  const addPost = (post: Omit<BlogPost, 'id' | 'views'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      views: 0
    };
    setCmsData(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
  };

  const updatePost = (id: string, post: Partial<BlogPost>) => {
    setCmsData(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === id ? { ...p, ...post } : p)
    }));
  };

  const deletePost = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== id)
    }));
  };

  // Categories
  const addCategory = (category: Omit<ScrapCategory, 'id'>) => {
    const newCat: ScrapCategory = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      categories: [...prev.categories, newCat]
    }));
  };

  const updateCategory = (id: string, category: Partial<ScrapCategory>) => {
    setCmsData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...category } : c)
    }));
  };

  const deleteCategory = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  // Services
  const addService = (service: Omit<ScrapServiceItem, 'id'>) => {
    const newSrv: ScrapServiceItem = {
      ...service,
      id: `srv-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      services: [...prev.services, newSrv]
    }));
  };

  const updateService = (id: string, service: Partial<ScrapServiceItem>) => {
    setCmsData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...service } : s)
    }));
  };

  const deleteService = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  // Equipments
  const addEquipment = (equipment: Omit<EquipmentItem, 'id'>) => {
    const newEq: EquipmentItem = {
      ...equipment,
      id: `eq-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      equipments: [...(prev.equipments || []), newEq]
    }));
  };

  const updateEquipment = (id: string, equipment: Partial<EquipmentItem>) => {
    setCmsData(prev => ({
      ...prev,
      equipments: (prev.equipments || []).map(e => e.id === id ? { ...e, ...equipment } : e)
    }));
  };

  const deleteEquipment = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      equipments: (prev.equipments || []).filter(e => e.id !== id)
    }));
  };

  // Tags
  const addTag = (tag: Omit<TagItem, 'id'>) => {
    const newTag: TagItem = {
      ...tag,
      id: `tag-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
  };

  const deleteTag = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t.id !== id)
    }));
  };

  // Users
  const addUser = (user: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCmsData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const updateUser = (id: string, user: Partial<AdminUser>) => {
    setCmsData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...user } : u)
    }));
  };

  const deleteUser = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  };

  // Inquiries
  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newInq: Inquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: formattedDate
    };
    setCmsData(prev => ({
      ...prev,
      inquiries: [newInq, ...prev.inquiries]
    }));
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setCmsData(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(i => i.id === id ? { ...i, status } : i)
    }));
  };

  const deleteInquiry = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(i => i.id !== id)
    }));
  };

  // FAQs
  const addFAQ = (faq: Omit<FAQEntry, 'id'>) => {
    const newFaq: FAQEntry = {
      ...faq,
      id: `faq-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }));
  };

  const updateFAQ = (id: string, faq: Partial<FAQEntry>) => {
    setCmsData(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...faq } : f)
    }));
  };

  const deleteFAQ = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  // Testimonials
  const addTestimonial = (test: Omit<TestimonialEntry, 'id'>) => {
    const newTest: TestimonialEntry = {
      ...test,
      id: `test-${Date.now()}`
    };
    setCmsData(prev => ({
      ...prev,
      testimonials: [newTest, ...prev.testimonials]
    }));
  };

  const updateTestimonial = (id: string, test: Partial<TestimonialEntry>) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...test } : t)
    }));
  };

  const deleteTestimonial = (id: string) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  // Backup & Reset
  const importCMSData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.settings && parsed.slides) {
        setCmsData(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON format for import:', e);
    }
    return false;
  };

  const exportCMSData = (): string => {
    return JSON.stringify(cmsData, null, 2);
  };

  const resetToDefaults = () => {
    setCmsData(initialCMSData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCMSData));
  };

  // Search & Category Analytics
  const logSearchQuery = (
    query: string,
    category?: string,
    source: SearchQueryLog['source'] = 'header_search'
  ) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setCmsData(prev => {
      const existingLogs = prev.searchLogs || [];
      const index = existingLogs.findIndex(l => l.query.toLowerCase() === trimmed.toLowerCase());
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

      let updatedLogs: SearchQueryLog[];
      if (index >= 0) {
        updatedLogs = [...existingLogs];
        updatedLogs[index] = {
          ...updatedLogs[index],
          count: updatedLogs[index].count + 1,
          lastSearched: now,
          category: category || updatedLogs[index].category
        };
      } else {
        const newLog: SearchQueryLog = {
          id: `srch-${Date.now()}`,
          query: trimmed,
          category: category || 'عام',
          count: 1,
          lastSearched: now,
          source
        };
        updatedLogs = [newLog, ...existingLogs];
      }

      // Also update category search count if category specified
      let updatedStats = prev.categoryStats || [];
      if (category) {
        const catIndex = updatedStats.findIndex(s => 
          s.categoryNameAr === category || s.categoryNameEn === category || s.categoryId === category
        );
        if (catIndex >= 0) {
          updatedStats = [...updatedStats];
          updatedStats[catIndex] = {
            ...updatedStats[catIndex],
            searchesCount: (updatedStats[catIndex].searchesCount || 0) + 1
          };
        }
      }

      return {
        ...prev,
        searchLogs: updatedLogs,
        categoryStats: updatedStats
      };
    });
  };

  const clearSearchLogs = () => {
    setCmsData(prev => ({
      ...prev,
      searchLogs: []
    }));
  };

  const incrementCategoryView = (categoryId: string) => {
    setCmsData(prev => {
      const existingStats = prev.categoryStats || [];
      const catIndex = existingStats.findIndex(s => s.categoryId === categoryId);
      let updatedStats: CategoryAnalyticsStat[];

      if (catIndex >= 0) {
        updatedStats = [...existingStats];
        updatedStats[catIndex] = {
          ...updatedStats[catIndex],
          viewsCount: (updatedStats[catIndex].viewsCount || 0) + 1
        };
      } else {
        const catObj = prev.categories.find(c => c.id === categoryId);
        if (!catObj) return prev;
        updatedStats = [
          ...existingStats,
          {
            categoryId,
            categoryNameAr: catObj.nameAr,
            categoryNameEn: catObj.nameEn,
            viewsCount: 1,
            inquiriesCount: 0,
            searchesCount: 0
          }
        ];
      }

      return {
        ...prev,
        categoryStats: updatedStats
      };
    });
  };

  return (
    <CMSContext.Provider value={{
      cmsData,
      saveStatus,
      saveCMSData,
      forceServerSync,
      currentUser,
      isAdminOpen,
      setIsAdminOpen,
      activeAdminTab,
      setActiveAdminTab,
      login,
      logout,
      updateSettings,
      updateTheme,
      addPage,
      updatePage,
      deletePage,
      addSlide,
      updateSlide,
      deleteSlide,
      reorderSlides,
      addPost,
      updatePost,
      deletePost,
      addVideoPost,
      updateVideoPost,
      deleteVideoPost,
      addCategory,
      updateCategory,
      deleteCategory,
      addService,
      updateService,
      deleteService,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      addTag,
      deleteTag,
      addClient,
      updateClient,
      deleteClient,
      addUser,
      updateUser,
      deleteUser,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      importCMSData,
      exportCMSData,
      resetToDefaults,
      logSearchQuery,
      clearSearchLogs,
      incrementCategoryView
    }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
