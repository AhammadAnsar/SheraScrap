import React, { createContext, useContext } from 'react';
import type { CMSData } from '../cms/types';
import type { useCMS as legacyUseCMS } from '../cms/CMSContext';

type Context = ReturnType<typeof legacyUseCMS>;
const Content = createContext<Context | null>(null);
export function CMSProvider({ children, initialData }: { children: React.ReactNode; initialData?: CMSData }) {
  if (!initialData) throw new Error('Static page content is missing. Rebuild the website.');
  const value = {
    cmsData: initialData, currentUser: null, authToken: null, isAdminOpen: false,
    logSearchQuery: () => {}, incrementCategoryView: () => {},
    setIsAdminOpen: () => {}, saveStatus: 'idle',
  } as unknown as Context;
  return <Content.Provider value={value}>{children}</Content.Provider>;
}
export function useCMS() {
  const value = useContext(Content);
  if (!value) throw new Error('Missing static content provider');
  return value;
}
