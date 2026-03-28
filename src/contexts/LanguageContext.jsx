import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { languages, translations } from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('mcf-language') || 'fr')

  useEffect(() => {
    localStorage.setItem('mcf-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = languages[language]?.dir || 'ltr'
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    dir: languages[language]?.dir || 'ltr',
    dictionary: translations[language] || translations.fr,
    languages,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
