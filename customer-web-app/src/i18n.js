import i18n from "i18next";
import { initReactI18next } from "../node_modules/react-i18next";
import en from "./translations/en";

i18n.use(initReactI18next).init({
  resources: {
    en: en,
  },
  lng: localStorage.getItem("enatega-language") || "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
