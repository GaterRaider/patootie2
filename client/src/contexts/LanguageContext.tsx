import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '../i18n/translations';
import { trpc } from '@/lib/trpc';

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

  // Get country from IP geolocation
  const { data: geoData } = trpc.geo.getCountry.useQuery(undefined, {
    enabled: !initialized,
  });

  useEffect(() => {
    // Check if user has manually set a language preference
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;

    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ko')) {
      // User has manually set a preference, use it
      setLanguageState(storedLanguage);
      setInitialized(true);
    } else if (geoData) {
      // No manual preference, use IP-based detection
      if (geoData.countryCode === 'KR') {
        setLanguageState('ko');
      } else {
        setLanguageState('en');
      }
      setInitialized(true);
    }
  }, [geoData]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
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
