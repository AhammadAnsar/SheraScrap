import React, { createContext, useContext } from 'react';
import type { CMSData } from '../cms/types';
type Context = {
  cmsData: CMSData;
  logSearchQuery: (...args: unknown[]) => void;
  incrementCategoryView: (...args: unknown[]) => void;
};
const Content = createContext<Context | null>(null);
export function CMSProvider({ children, initialData }: { children: React.ReactNode; initialData?: CMSData }) {
  if (!initialData) throw new Error('Static page content is missing. Rebuild the website.');
  const value = {
    cmsData: initialData,
    logSearchQuery: () => {}, incrementCategoryView: () => {},
  } satisfies Context;
  return <Content.Provider value={value}>{children}</Content.Provider>;
}
export function useCMS() {
  const value = useContext(Content);
  if (!value) throw new Error('Missing static content provider');
  return value;
}
