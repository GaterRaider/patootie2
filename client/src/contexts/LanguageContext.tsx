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
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [initialized, setInitialized] = useState(false);
  const [location, setLocation] = useLocation();
  const search = useSearch();

  // Get country from IP geolocation
  const { data: geoData } = trpc.geo.getCountry.useQuery(undefined, {
    enabled: !initialized,
  });

  // Sync state with URL query param
  useEffect(() => {
    const params = new URLSearchParams(search);
    const langParam = params.get('lang') as Language | null;

    if (langParam && (langParam === 'en' || langParam === 'ko')) {
      if (language !== langParam) {
        setLanguageState(langParam);
      }
      setInitialized(true);
    } else if (!initialized) {
      // Initial load logic (Storage -> IP -> Default)
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ko')) {
        setLanguageState(storedLanguage);
      } else if (geoData) {
        if (geoData.countryCode === 'KR') {
          setLanguageState('ko');
        } else {
          setLanguageState('en');
        }
      }
      setInitialized(true);
    }
  }, [search, geoData, initialized, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

    // Update URL
    const params = new URLSearchParams(search);
    params.set('lang', lang);
    setLocation(`${location}?${params.toString()}`);
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
