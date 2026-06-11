import { createContext, useContext, useState, useCallback } from 'react';
import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'id';
  });

  const toggleLanguage = useCallback(() => {
    setLocale((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      localStorage.setItem('locale', next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang) => {
    localStorage.setItem('locale', lang);
    setLocale(lang);
  }, []);

  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      let value = translations[locale];
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English or the key itself
          let fallback = translations['en'];
          for (const fk of keys) {
            if (fallback && typeof fallback === 'object' && fk in fallback) {
              fallback = fallback[fk];
            } else {
              return key;
            }
          }
          return fallback ?? key;
        }
      }
      return value ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
