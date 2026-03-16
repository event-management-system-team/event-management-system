import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import vi from '../locales/vi/translation.json';

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        vi: { translation: vi }
    },
    lng: 'en',          // ngôn ngữ mặc định
    fallbackLng: 'en',  // fallback nếu không tìm thấy key
});

export default i18n;