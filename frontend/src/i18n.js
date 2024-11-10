import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(Backend)
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: {
      // 'de-CH': ['de'],
      // de: ['de'],
      // 'gr-EL': ['de'],
      // el: ['de'],
      default: ['en'],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: { en },
  })

export default i18n
