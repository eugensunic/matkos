import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { Platform } from 'react-native'
import { en } from './translations/en'

import AsyncStorage from '@react-native-async-storage/async-storage'
export const languageResources = {
  en: { translation: en },
}
const getStoredLanguage = async () => {
  const lng = await AsyncStorage.getItem('enatega-language')
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: lng,
    fallbackLng: 'en',
    resources: languageResources
  })
}
if (Platform.OS === 'android') {
  getStoredLanguage()
}
if (Platform.OS === 'ios') {
  i18next.locale = Localization.locale
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: i18next.locale,
    fallbackLng: 'en',
    resources: languageResources
  })

  i18next.changeLanguage(i18next.locale)
}

export default i18next
