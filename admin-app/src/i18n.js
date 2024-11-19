import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en'
import de from './translations/de'
import fr from './translations/fr'
import km from './translations/km'
import zh from './translations/zh'
import ar from './translations/ar'
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
