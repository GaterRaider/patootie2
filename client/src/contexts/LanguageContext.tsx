import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '../i18n/translations';
import { trpc } from '@/lib/trpc';
import { useLocation, useSearch } from "wouter";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'preferred-language';

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language; // For SSR: pre-set language without client-side detection
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || 'en');
  const [initialized, setInitialized] = useState(false);
  const [location, setLocation] = useLocation();
  const search = useSearch();

  // Get country from IP geolocation (skip in SSR mode)
  const { data: geoData } = trpc.geo.getCountry.useQuery(undefined, {
    enabled: !initialized && !initialLanguage, // Disable in SSR mode
  });

  // Sync state with URL path
  useEffect(() => {
    // SSR mode: if initialLanguage is provided, skip client-side detection
    if (initialLanguage) {
      setInitialized(true);
      return;
    }

    // Check if path starts with /en or /ko or /de
    const pathParts = location.split('/');
    const firstPart = pathParts[1];

    // Skip language detection for admin routes
    if (firstPart === 'admin') {
      if (!initialized) {
        setLanguageState('en'); // Default to English for admin
        setInitialized(true);
      }
      return;
    }

    if (firstPart === 'en' || firstPart === 'ko' || firstPart === 'de') {
      if (language !== firstPart) {
        setLanguageState(firstPart as Language);
      }
      setInitialized(true);
    } else if (!initialized) {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ko' || storedLanguage === 'de')) {
        setLanguageState(storedLanguage);
      } else if (geoData) {
        if (geoData.countryCode === 'KR') {
          setLanguageState('ko');
        } else if (geoData.countryCode === 'DE') {
          setLanguageState('de');
        } else {
          setLanguageState('en');
        }
      }
      setInitialized(true);
    }
  }, [location, geoData, initialized, language, initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

    const pathParts = location.split('/');
    const firstPart = pathParts[1];

    let newPath;
    if (firstPart === 'en' || firstPart === 'ko' || firstPart === 'de') {
      pathParts[1] = lang;
      newPath = pathParts.join('/');
    } else {
      if (location === '/') {
        newPath = `/${lang}`;
      } else {
        newPath = `/${lang}${location}`;
      }
    }
    setLocation(newPath);
  };

  const t = getTranslations(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
