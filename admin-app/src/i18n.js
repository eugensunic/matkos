import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en'

i18n.use(initReactI18next).init({
  // we init with resources
  resources: {
    en,
  },
  lng: localStorage.getItem('enatega-language') || 'en',
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false // not needed for react!!
  }
})

export default i18n
