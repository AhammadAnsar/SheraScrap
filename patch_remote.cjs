const fs = require('fs');
let code = fs.readFileSync('src/cms/CMSContext.tsx', 'utf8');

// 1. Add the ref at the top of CMSProvider
const refImportTarget = "import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';";
const refImportReplace = "import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';";
code = code.replace(refImportTarget, refImportReplace);

const providerStartTarget = `export const CMSProvider = ({ children }: { children: ReactNode }) => {
  const [cmsData, setCmsData] = useState<CMSData>(() => {`;
const providerStartReplace = `export const CMSProvider = ({ children }: { children: ReactNode }) => {
  const isRemoteChange = useRef(false);
  const [cmsData, setCmsData] = useState<CMSData>(() => {`;
code = code.replace(providerStartTarget, providerStartReplace);

// 2. In onSnapshot, set the ref
const snapshotTarget = `          setCmsData(prev => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(mergedData);
            if (prevStr === newStr) {
              return prev; // Break the infinite loop
            }
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, newStr);
            } catch (e) {}
            return mergedData;
          });`;

const snapshotReplace = `          isRemoteChange.current = true;
          setCmsData(mergedData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
          } catch (e) {}`;

code = code.replace(snapshotTarget, snapshotReplace); // Replace both occurrences (main and fallback)
code = code.replace(snapshotTarget, snapshotReplace);

// 3. In useEffect for cmsData, check the ref
const useEffectTarget = `  // Automatically sync to Firebase Cloud Firestore, Hostinger PHP server API, and LocalStorage whenever cmsData changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cmsData));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage:', e);
    }

    if (isServerLoaded) {
      setSaveStatus('saving');`;

const useEffectReplace = `  // Automatically sync to Firebase Cloud Firestore, Hostinger PHP server API, and LocalStorage whenever cmsData changes
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
      setSaveStatus('saving');`;

code = code.replace(useEffectTarget, useEffectReplace);

fs.writeFileSync('src/cms/CMSContext.tsx', code);
console.log("Patched with isRemoteChange ref.");
