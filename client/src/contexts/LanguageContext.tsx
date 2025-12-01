import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from '../i18n/translations';
import { useLocation, useSearch } from "wouter";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isInitialized: boolean;
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

  // Sync state with URL path and detect language
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

    // 1. URL Path Priority
    if (firstPart === 'en' || firstPart === 'ko' || firstPart === 'de') {
      if (language !== firstPart) {
        setLanguageState(firstPart as Language);
      }
      setInitialized(true);
    } else if (!initialized) {
      // 2. Local Storage Priority
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ko' || storedLanguage === 'de')) {
        setLanguageState(storedLanguage);
        setInitialized(true);
      } else {
        // 3. Browser Language Priority
        const browserLang = navigator.language.toLowerCase();
        let detectedLang: Language = 'en'; // 4. Default Fallback

        if (browserLang.startsWith('de')) {
          detectedLang = 'de';
        } else if (browserLang.startsWith('ko')) {
          detectedLang = 'ko';
        }

        setLanguageState(detectedLang);
        setInitialized(true);
      }
    }
  }, [location, initialized, language, initialLanguage]);

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
    <LanguageContext.Provider value={{ language, setLanguage, t, isInitialized: initialized }}>
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
